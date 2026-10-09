import { WEAPONS } from '../game/weapons'
import { KNIGHT_WIDTH } from '../sprites/knight'
import type { Foe } from './foe'
import { hitTicks, isFighting, spawnFoe, STRIKE_TICKS, strike, strikeOf } from './foe'
import type { Shot, World } from './world'
import { KNIGHT_X, MAX_FOES, MAX_SETTLED } from './world'

const ACTION_TICKS = 3
const CONTACT_X = KNIGHT_X + KNIGHT_WIDTH + 1
const COUNTER_DELAY_TICKS = 2
const SHOT_SPEED = 3
const SHOT_START_X = KNIGHT_X + KNIGHT_WIDTH

function isCounterTick(foe: Foe, seed: number): boolean {
  if (foe.kind !== 'boss' || foe.phase === 'coming') return false
  const startTicks = foe.phase === 'struck' ? STRIKE_TICKS : hitTicks(foe)
  if (foe.ticks !== startTicks - COUNTER_DELAY_TICKS) return false
  return strikeOf(foe, seed, foe.strikes - 1)?.isCountered === true
}

export function stepWorld(world: World, width: number): World {
  const scene = world.scene
  let action = world.action
  let actionTicks = Math.max(0, world.actionTicks - 1)
  if (actionTicks === 0) action = 'walk'

  let foes: Foe[] = [...world.foes]
  const settled = [...world.settled]
  let lastEventId = world.lastEventId
  for (const event of scene.events) {
    if (event.id <= lastEventId) continue
    lastEventId = event.id
    if (event.kind === 'hurt') {
      action = 'hurt'
      actionTicks = ACTION_TICKS
      settled.push(event.id)
      continue
    }
    const foe = spawnFoe(event, foes, width)
    if (foe !== null) foes.push(foe)
  }
  while (foes.length > MAX_FOES) {
    const dropAt = foes.findIndex(foe => foe.phase === 'coming' && foe.kind !== 'boss')
    if (dropAt === -1) break
    settled.push(foes[dropAt]?.id ?? 0)
    foes.splice(dropAt, 1)
  }

  foes = foes
    .map(foe => (foe.phase === 'coming' ? foe : { ...foe, ticks: foe.ticks - 1 }))
    .map(foe => (foe.phase === 'struck' && foe.ticks <= 0 ? { ...foe, phase: 'coming' as const } : foe))
    .filter(foe => foe.phase !== 'hit' || foe.ticks > 0)

  const wounds = Object.fromEntries(Object.entries(world.wounds ?? {}).filter(([id]) => foes.some(foe => String(foe.id) === id)))
  for (const foe of foes) {
    if (!isCounterTick(foe, scene.seed)) continue
    wounds[String(foe.id)] = (wounds[String(foe.id)] ?? 0) + 1
    action = 'hurt'
    actionTicks = ACTION_TICKS
  }

  let weapon = world.weapon ?? 'sword'
  let shot: Shot | null = world.shot ?? null
  if (shot !== null) {
    const flying: Shot = shot
    const targetAt = foes.findIndex(foe => foe.id === flying.targetId)
    const target = foes[targetAt]
    const nextX = flying.x + SHOT_SPEED
    if (target === undefined) {
      shot = null
    } else if (nextX >= target.x) {
      const struck = strike(target, target.x, scene.seed)
      foes[targetAt] = struck
      if (struck.phase === 'hit') settled.push(target.id)
      shot = null
    } else {
      shot = { ...flying, x: nextX }
    }
  }

  if (!scene.isRunning) foes = foes.filter(foe => foe.kind !== 'boss' || scene.events.some(event => event.id === foe.id))
  const isOnRoad = scene.isRunning || foes.length > 0

  const front = foes[0]
  const isBusy = foes.some(foe => foe.phase !== 'coming')
  if (isOnRoad && front !== undefined && front.phase === 'coming' && shot === null && !isBusy) {
    const strikeIndex = front.strikes || 0
    const planned = strikeOf(front, scene.seed, strikeIndex)
    const isSpecial = planned?.isSpecial === true
    const chosen = planned?.weapon ?? 'sword'
    if (front.x <= CONTACT_X + WEAPONS[chosen].range) {
      if (WEAPONS[chosen].isThrown) {
        shot = { weapon: chosen, x: SHOT_START_X, targetId: front.id }
        weapon = chosen
        if (action !== 'hurt') {
          action = 'throw'
          actionTicks = ACTION_TICKS
        }
      } else {
        const struck = strike(front, Math.max(CONTACT_X, front.x), scene.seed)
        foes[0] = struck
        if (struck.phase === 'hit') settled.push(front.id)
        if (isFighting(front) && action !== 'hurt') {
          weapon = chosen
          action = isSpecial ? 'special' : 'slash'
          actionTicks = ACTION_TICKS
        }
      }
    }
  }

  const isBlocked = foes.some(foe => foe.phase !== 'coming') || (foes[0] !== undefined && foes[0].x <= CONTACT_X)
  const step = isOnRoad && !isBlocked ? scene.speed : 0
  if (step > 0) foes = foes.map(foe => ({ ...foe, x: foe.x - step }))

  return { ...world, tick: world.tick + 1, scroll: world.scroll + step, lastEventId, foes, action, actionTicks, weapon, shot, settled: settled.slice(-MAX_SETTLED), wounds }
}
