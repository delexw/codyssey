import type { Save, Scene } from '../../../types'
import { settledName } from './cues'
import { seededRandom } from './random'
import { isTimedBoss } from './bosses'
import { counterHits } from './fight'
import { applyEvent, woundByBoss } from './save'

export function settleEvents(save: Save, scene: Scene, ids: readonly number[]): { save: Save; scene: Scene } {
  let next = save
  let latest = scene.latest
  const events = scene.events.map(event => {
    if (event.isSettled || !ids.includes(event.id)) return event
    if (event.kind === 'boss') next = woundByBoss(next, counterHits(scene.seed, event.id, event.hearts ?? 1) - (event.woundsTaken ?? 0))
    if (event.kind === 'boss' && isTimedBoss(event.species)) next = { ...next, bossesSlain: next.bossesSlain + 1 }
    next = applyEvent(next, event.kind, seededRandom(scene.seed + event.id * 7919), event.hearts)
    latest = settledName(event)
    return { ...event, isSettled: true }
  })
  return { save: next, scene: { ...scene, events, latest } }
}

export function woundEvents(save: Save, scene: Scene, wounds: Readonly<Record<string, number>>): { save: Save; scene: Scene } {
  let next = save
  const events = scene.events.map(event => {
    const landed = wounds[String(event.id)]
    if (event.kind !== 'boss' || event.isSettled || landed === undefined) return event
    const total = Math.min(landed, counterHits(scene.seed, event.id, event.hearts ?? 1))
    const fresh = total - (event.woundsTaken ?? 0)
    if (fresh <= 0) return event
    next = woundByBoss(next, fresh)
    return { ...event, woundsTaken: total }
  })
  return { save: next, scene: { ...scene, events } }
}

export function woundsOf(data: unknown): Record<string, number> {
  if (typeof data !== 'object' || data === null || !('wounds' in data)) return {}
  const wounds = (data as { wounds: unknown }).wounds
  if (typeof wounds !== 'object' || wounds === null) return {}
  return Object.fromEntries(Object.entries(wounds).filter((entry): entry is [string, number] => typeof entry[1] === 'number'))
}

export function settledIdsOf(data: unknown): number[] {
  if (typeof data !== 'object' || data === null || !('settled' in data)) return []
  const settled = (data as { settled: unknown }).settled
  return Array.isArray(settled) ? settled.filter((id): id is number => typeof id === 'number') : []
}
