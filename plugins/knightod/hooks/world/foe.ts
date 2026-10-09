import type { EventKind, GameEvent, Species } from '../../types'
import type { Strike } from '../game/fight'
import { fightPlan } from '../game/fight'

export type FoePhase = 'coming' | 'struck' | 'hit'

export type Foe = {
  id: number
  kind: Exclude<EventKind, 'hurt'>
  species: Species | null
  x: number
  phase: FoePhase
  ticks: number
  hp: number
  maxHp: number
  strikes: number
}

export const FOE_SPACING = 9
export const STRIKE_TICKS = 5

export function spawnFoe(event: GameEvent, foes: readonly Foe[], width: number): Foe | null {
  if (event.kind === 'hurt') return null
  const lastX = foes.at(-1)?.x ?? 0
  const hearts = event.hearts ?? 1
  return { id: event.id, kind: event.kind, species: event.species, x: Math.max(width, lastX + FOE_SPACING), phase: 'coming', ticks: 0, hp: hearts, maxHp: hearts, strikes: 0 }
}

export function hitTicks(foe: Foe): number {
  switch (foe.kind) {
    case 'boss':
      return 8
    case 'monster':
    case 'chest':
      return 4
    case 'scroll':
      return 1
  }
}

export function heartsLeft(foe: Foe): number {
  return Number.isFinite(foe.hp) ? foe.hp : 1
}

export function strikeOf(foe: Foe, seed: number, index: number): Strike | undefined {
  if (foe.kind !== 'boss') return undefined
  return fightPlan(seed, foe.id, foe.maxHp)[index]
}

export function strike(foe: Foe, x: number, seed: number): Foe {
  const strikes = (foe.strikes || 0) + 1
  const hp = heartsLeft(foe) - (strikeOf(foe, seed, strikes - 1)?.damage ?? 1)
  return hp > 0 ? { ...foe, x, hp, strikes, phase: 'struck', ticks: STRIKE_TICKS } : { ...foe, x, hp: 0, strikes, phase: 'hit', ticks: hitTicks(foe) }
}

export function isFighting(foe: Foe): boolean {
  return foe.kind === 'monster' || foe.kind === 'boss'
}
