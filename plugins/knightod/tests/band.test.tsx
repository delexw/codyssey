import type { EventCalls, On } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'

import { fightPlan } from '../hooks/game/fight'
import { hashText } from '../hooks/game/random'

const BAND = {
  plugin: 'knightod',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: true, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
} as const

function standInForEngine(on: On) {
  on('turn.start', ($, e) => ({ turnId: e.turnId }))
  on('turn.complete', ($, e) => ({ text: e.answer }))
  on('tool.call', () => ({ result: {}, text: 'ok' }))
  on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box key="below" />
  })
}

test('the band shows the monster coming, and the kill and its gold count only once the knight strikes it', async ($, on) => {
  mock.clock(on, { now: 1000 })
  standInForEngine(on)

  await $.turn.start({ text: 'fix the login bug', turnId: 'turn-1' })
  await $.tool.call({ tool: 'Edit', file_path: '/repo/app.ts', old_string: 'a', new_string: 'b' } as Parameters<typeof $.tool.call>[0])

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: /^⚔ Lv 1 · ♥♥♥♥♥ · 0 slain · 0 gold · the \w+ of "app\.ts"$/ })).toBeDefined()
  expect(await band.find({ key: 'knightod-strip' })).toBeDefined()
  expect(await band.find({ key: 'below' })).toBeDefined()

  await band.resize({ columns: 40, rows: 3, in: 'knightod-strip' })
  await band.advance(150 * 3)
  expect(await band.find({ type: 'Text', text: /· 0 slain ·/ })).toBeDefined()
  await band.advance(150 * 60)
  expect(await band.find({ type: 'Text', text: /^⚔ Lv 1 · ♥♥♥♥♥ · 1 slain · [1-9]\d* gold · slew the \w+ of "app\.ts"$/ })).toBeDefined()
  await band.unmount()
})

test('the band says it saved when the task ends, counting what the knight had not reached yet, and goes after the camp', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  standInForEngine(on)

  await $.turn.start({ text: 'fix the login bug', turnId: 'turn-1' })
  await $.tool.call({ tool: 'Edit', file_path: '/repo/app.ts', old_string: 'a', new_string: 'b' } as Parameters<typeof $.tool.call>[0])
  await $.turn.complete({ turnId: 'turn-1', reason: 'answer', answer: 'done', durationMs: 1, isAborted: false } as Parameters<EventCalls['turn']['complete']>[0])

  for (const surface of ['terminal', 'desktop'] as const) {
    const resting = await $.ui.mount({ ...BAND, surface })
    expect(await resting.find({ type: 'Text', text: /^⌂ Lv 1 · ♥♥♥♥♥ · 1 slain · .* progress saved$/ })).toBeDefined()
    await resting.unmount()
  }

  await clock.advance(13_000)
  const gone = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await gone.find({ key: 'knightod-strip' })).toBeUndefined()
  await gone.unmount()
})

function completeTurn(turnId: string) {
  return { turnId, reason: 'answer', answer: 'done', durationMs: 1, isAborted: false } as Parameters<EventCalls['turn']['complete']>[0]
}

async function stats(run: (input: never) => Promise<{ text: string }>): Promise<string> {
  return (await run({ command: 'knightod', args: '' } as never)).text
}

test('the King Slime comes after two minutes, its hits cost hearts as they land, and it counts once the knight slays it', async ($, on) => {
  let prompt = 'a long refactor'
  for (let attempt = 0; ; attempt += 1) {
    const plan = fightPlan(hashText(`1000:${prompt}`), 3, 2)
    if (plan.length === 2 && plan[0]?.isCountered === true) break
    prompt = `a long refactor ${attempt}`
  }
  const clock = mock.clock(on, { now: 1000 })
  standInForEngine(on)

  await $.turn.start({ text: prompt, turnId: 'turn-1' })
  await $.tool.call({ tool: 'Read', file_path: '/repo/a.ts' } as Parameters<typeof $.tool.call>[0])
  await clock.advance(2 * 60_000)
  await $.tool.call({ tool: 'Read', file_path: '/repo/b.ts' } as Parameters<typeof $.tool.call>[0])

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: /the King Slime ♥♥$/ })).toBeDefined()
  await band.resize({ columns: 40, rows: 3, in: 'knightod-strip' })

  let sawLiveWound = false
  for (let tick = 0; tick < 120; tick += 1) {
    await band.advance(150)
    if (await band.find({ type: 'Text', text: /♥♥♥♥♡ · 0 slain/ })) sawLiveWound = true
  }
  expect(sawLiveWound).toBe(true)
  expect(await band.find({ type: 'Text', text: /· 1 slain · .*slew the King Slime ♥♥$/ })).toBeDefined()
  await band.unmount()
  expect(await stats($.command.run as never)).toContain('1 of 5 bosses slain')
})

test('a boss nobody reached runs off when the task ends, and comes back in the next task', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  standInForEngine(on)

  await $.turn.start({ text: 'first', turnId: 'turn-1' })
  await clock.advance(2 * 60_000)
  await $.tool.call({ tool: 'Read', file_path: '/repo/a.ts' } as Parameters<typeof $.tool.call>[0])
  await $.turn.complete(completeTurn('turn-1'))
  const text = await stats($.command.run as never)
  expect(text).toContain('0 slain')
  expect(text).toContain('0 of 5 bosses slain')
  expect(text).toContain('♥♥♥♥♥')

  await $.turn.start({ text: 'second', turnId: 'turn-2' })
  await $.tool.call({ tool: 'Read', file_path: '/repo/b.ts' } as Parameters<typeof $.tool.call>[0])
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: /the King Slime ♥♥$/ })).toBeDefined()
  await band.unmount()
  await $.turn.complete(completeTurn('turn-2'))
  await clock.advance(20_000)
})
