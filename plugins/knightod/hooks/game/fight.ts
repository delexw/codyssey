import { seededRandom } from './random'

export const COUNTER_CHANCE = 0.4
export const SPECIAL_CHANCE = 0.15
export const SPECIAL_DAMAGE = 2

export type Strike = { damage: number; isSpecial: boolean; isCountered: boolean }

export function fightPlan(seed: number, eventId: number, hearts: number): Strike[] {
  const random = seededRandom(seed + eventId * 104729)
  const strikes: Strike[] = []
  let left = hearts
  while (left > 0) {
    const isSpecial = left > 1 && random() < SPECIAL_CHANCE
    const damage = isSpecial ? Math.min(SPECIAL_DAMAGE, left) : 1
    strikes.push({ damage, isSpecial, isCountered: random() < COUNTER_CHANCE })
    left -= damage
  }
  return strikes
}

export function counterHits(seed: number, eventId: number, hearts: number): number {
  return fightPlan(seed, eventId, hearts).filter(strike => strike.isCountered).length
}
