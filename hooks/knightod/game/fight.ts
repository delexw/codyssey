import { seededRandom } from './random'
import type { WeaponName } from './weapons'
import { pickWeapon } from './weapons'

export const COUNTER_CHANCE = 0.4
export const SPECIAL_CHANCE = 0.15
export const SPECIAL_DAMAGE = 2

export type Strike = { damage: number; isSpecial: boolean; isCountered: boolean; weapon: WeaponName }

export function fightPlan(seed: number, eventId: number, hearts: number): Strike[] {
  const random = seededRandom(seed + eventId * 104729)
  const strikes: Strike[] = []
  let left = hearts
  while (left > 0) {
    const isSpecial = left > 1 && random() < SPECIAL_CHANCE
    const weapon = pickWeapon(random, strikes.length === 0)
    const damage = Math.min(isSpecial ? SPECIAL_DAMAGE : weapon.power, left)
    strikes.push({ damage, isSpecial, isCountered: random() < COUNTER_CHANCE, weapon: isSpecial ? 'sword' : weapon.name })
    left -= damage
  }
  return strikes
}

export function counterHits(seed: number, eventId: number, hearts: number): number {
  return fightPlan(seed, eventId, hearts).filter(strike => strike.isCountered).length
}
