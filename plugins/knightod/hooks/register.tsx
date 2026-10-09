import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import { drawBand, STRIP_KEY } from './band'
import { BOSS_TIERS, dueBoss, withBoss } from './game/bosses'
import type { Cue } from './game/cues'
import { cueForCommand, cueForTool, isTestCommand } from './game/cues'
import { hashText } from './game/random'
import { finishQuest, NEW_SAVE, playMinutes } from './game/save'
import { overflowIds, restScene, startScene, unsettledIdsExceptBosses, withCue, withoutUnfoughtBosses } from './game/scene'
import { settledIdsOf, settleEvents, woundEvents, woundsOf } from './game/settle'
import type { Spend } from './game/speed'
import { RATE_WINDOW_MS, speedFromRate, tokensPerMinute } from './game/speed'
import { hearts } from './game/label'

const isEnabled = atom({ plugin: 'knightod', key: 'isEnabled' } as const, true)
const save = atom({ plugin: 'knightod', key: 'save' } as const, NEW_SAVE)
const scene = atom({ plugin: 'knightod', key: 'scene' } as const, null)

const CAMP_MS = 12_000

type Session = { turnId: string | null; spends: Spend[]; wasFailing: boolean; campTimer: Timer | null }

const session: Session = { turnId: null, spends: [], wasFailing: false, campTimer: null }

async function startQuest($: EngineInterface, prompt: string, turnId: string) {
  session.campTimer?.cancel()
  session.campTimer = null
  session.turnId = turnId
  session.spends = []
  session.wasFailing = false
  const now = await $.clock.now()
  await update($, scene, previous => startScene(hashText(`${now}:${prompt}`), previous, now))
}

async function settle($: EngineInterface, ids: readonly number[]) {
  const current = await read($, scene)
  if (current === null || ids.length === 0) return
  const settled = settleEvents(await read($, save), current, ids)
  await update($, save, () => settled.save)
  await update($, scene, () => settled.scene)
}

async function wound($: EngineInterface, wounds: Readonly<Record<string, number>>) {
  const current = await read($, scene)
  if (current === null || Object.keys(wounds).length === 0) return
  const wounded = woundEvents(await read($, save), current, wounds)
  await update($, save, () => wounded.save)
  await update($, scene, () => wounded.scene)
}

async function recordCue($: EngineInterface, cue: Cue) {
  const current = await read($, scene)
  if (current === null || !current.isRunning) return
  const next = withCue(current, cue)
  await update($, scene, () => next)
  await settle($, overflowIds(next))
}

async function summonDueBoss($: EngineInterface) {
  const current = await read($, scene)
  if (current === null) return
  const tier = dueBoss(await read($, save), current, await $.clock.now())
  if (tier === null) return
  const next = withBoss(current, tier)
  await update($, scene, () => next)
  await settle($, overflowIds(next))
}

async function endQuest($: EngineInterface) {
  session.turnId = null
  const current = await read($, scene)
  if (current === null || !current.isRunning) return
  await settle($, unsettledIdsExceptBosses(current))
  const endedAt = await $.clock.now()
  await update($, save, previous => finishQuest(previous, endedAt - current.startedAt))
  await update($, scene, now => (now === null ? now : restScene(withoutUnfoughtBosses(now))))
  session.campTimer = $.clock.after(CAMP_MS, () => {
    session.campTimer = null
    update($, scene, now => (now !== null && !now.isRunning ? null : now)).catch(() => undefined)
  })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'knightod',
      description: 'knightod, the pixel knight: show the saved game, or turn it on, off, or start over.',
      argumentHint: '[on|off|reset]',
      immediate: true,
    })
    return next(e)
  })

  on('command.run', { command: 'knightod' }, async ($, e) => {
    const choice = e.args.trim().toLowerCase()
    if (choice === 'on' || choice === 'off') {
      await update($, isEnabled, () => choice === 'on')
      if (choice === 'off') await update($, scene, () => null)
      return { text: `knightod ${choice}.` }
    }
    if (choice === 'reset') {
      await update($, save, () => NEW_SAVE)
      return { text: 'A new knight sets out.' }
    }
    const now = await read($, save)
    const state = (await read($, isEnabled)) ? 'on' : 'off'
    return {
      text: `knightod ${state}. Lv ${now.level} · ${hearts(now)} · ${now.kills} slain · ${now.gold} gold · ${now.quests} quests · played ${playMinutes(now)}m · ${now.bossesSlain} of ${BOSS_TIERS.length} bosses slain · fell ${now.deaths} times. Use /knightod on, off or reset.`,
    }
  })

  on('turn.start', async ($, e, next) => {
    const result = await next(e)
    if (session.turnId === null && (await read($, isEnabled))) await startQuest($, e.text, e.turnId)
    return result
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    const hasFailed = ran.deny === undefined && ran.isError === true
    await recordCue($, cueForCommand(e.command, hasFailed, session.wasFailing))
    await summonDueBoss($)
    if (hasFailed) session.wasFailing = true
    else if (isTestCommand(e.command)) session.wasFailing = false
    return ran
  }).catch(($, e, next) => next(e))

  on('tool.call', async ($, e, next) => {
    if (e.tool === 'Bash') return next(e)
    await recordCue($, cueForTool(e.tool, e as unknown as Record<string, unknown>))
    await summonDueBoss($)
    return next(e)
  }).catch(($, e, next) => next(e))

  on('turn.step', async function* ($, e, next) {
    const result = yield* next(e)
    if (session.turnId !== null && result.usage) {
      const { input_tokens, output_tokens, cache_creation_input_tokens } = result.usage
      const now = await $.clock.now()
      session.spends = [...session.spends.filter(spend => now - spend.at < RATE_WINDOW_MS), { at: now, tokens: input_tokens + output_tokens + cache_creation_input_tokens }]
      const speed = speedFromRate(tokensPerMinute(session.spends, now))
      await update($, scene, current => (current === null || current.speed === speed ? current : { ...current, speed }))
      await summonDueBoss($)
    }
    return result
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.turnId === session.turnId) await endQuest($)
    return result
  })

  on('ui.message', async ($, e, next) => {
    if (e.element !== STRIP_KEY) return next(e)
    await wound($, woundsOf(e.data))
    await settle($, settledIdsOf(e.data))
    return {}
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const below = await next(e)
    const current = await read($, scene)
    if (current === null || e.props.hasSurvey) return below
    return drawBand($.ui.resolve(e), await read($, save), current, e.props.bodyColumns, below)
  })

  on('session.end', async ($, e, next) => {
    session.campTimer?.cancel()
    return next(e)
  })
}
