import type { BossSpecies, Save, Scene, Species } from '../../../types'
import { levelledCue } from './level'
import { withCue } from './scene'

export type BossTier = { species: BossSpecies; hearts: number; atMs: number }

const MINUTE_MS = 60_000

export const BOSS_TIERS: readonly BossTier[] = [
  { species: 'king-slime', hearts: 3, atMs: 2 * MINUTE_MS },
  { species: 'ogre', hearts: 4, atMs: 4 * MINUTE_MS },
  { species: 'lich', hearts: 5, atMs: 6 * MINUTE_MS },
  { species: 'demon', hearts: 6, atMs: 8 * MINUTE_MS },
  { species: 'shadow-king', hearts: 7, atMs: 10 * MINUTE_MS },
]

export function playedMs(save: Save, scene: Scene, now: number): number {
  return save.playMs + (scene.isRunning ? Math.max(0, now - scene.startedAt) : 0)
}

export function isTimedBoss(species: Species | null): boolean {
  return BOSS_TIERS.some(tier => tier.species === species)
}

export function dueBoss(save: Save, scene: Scene, now: number): BossTier | null {
  const tier = BOSS_TIERS[save.bossesSlain]
  if (!scene.isRunning || tier === undefined || playedMs(save, scene, now) < tier.atMs) return null
  return scene.events.some(event => event.kind === 'boss' && !event.isSettled) ? null : tier
}

export function withBoss(scene: Scene, tier: BossTier, level = 1): Scene {
  return withCue(scene, levelledCue({ kind: 'boss', species: tier.species, target: '', hearts: tier.hearts }, level))
}
