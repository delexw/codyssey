import { AXE } from './axe'
import { DAGGER } from './dagger'
import { FIREBALL } from './fireball'
import { LANCE } from './lance'
import { SWORD } from './sword'
import type { Weapon, WeaponName } from './weapon'

export type { Weapon, WeaponName } from './weapon'

export const WEAPONS: Record<WeaponName, Weapon> = { sword: SWORD, axe: AXE, lance: LANCE, dagger: DAGGER, fireball: FIREBALL }

export function pickWeapon(random: () => number): Weapon {
  const all = Object.values(WEAPONS)
  let roll = random() * all.reduce((sum, weapon) => sum + weapon.chance, 0)
  for (const weapon of all) {
    roll -= weapon.chance
    if (roll < 0) return weapon
  }
  return SWORD
}
