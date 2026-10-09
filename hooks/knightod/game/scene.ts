import type { GameEvent, Scene } from '../../../types'
import type { Cue } from './cues'
import { cueName } from './cues'

export const MAX_EVENTS = 12
export const MAX_UNSETTLED = 24

export function startScene(seed: number, previous: Scene | null, now: number): Scene {
  return {
    isRunning: true,
    seed,
    speed: 1,
    events: [],
    nextId: previous?.nextId ?? 1,
    latest: previous ? 'back on the road' : 'sets out',
    startedAt: now,
  }
}

export function withCue(scene: Scene, cue: Cue): Scene {
  const event: GameEvent = { id: scene.nextId, kind: cue.kind, species: cue.species, name: cueName(cue), isSettled: false }
  if (cue.hearts !== undefined) event.hearts = cue.hearts
  const events = [...scene.events, event]
  while (events.length > MAX_EVENTS && events[0]?.isSettled === true) events.shift()
  return { ...scene, events, nextId: scene.nextId + 1, latest: event.name }
}

export function unsettledIdsExceptBosses(scene: Scene): number[] {
  return scene.events.filter(event => !event.isSettled && event.kind !== 'boss').map(event => event.id)
}

export function withoutUnfoughtBosses(scene: Scene): Scene {
  return { ...scene, events: scene.events.filter(event => event.isSettled || event.kind !== 'boss') }
}

export function overflowIds(scene: Scene): number[] {
  const waiting = unsettledIdsExceptBosses(scene)
  return waiting.slice(0, Math.max(0, waiting.length - MAX_UNSETTLED))
}

export const PAUSED_TEXT = 'paused, waiting on background work'

export function restScene(scene: Scene, isPaused = false): Scene {
  return { ...scene, isRunning: false, isPaused, latest: isPaused ? PAUSED_TEXT : 'progress saved' }
}
