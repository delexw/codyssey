import { expect, test } from 'claude-code/testing'

import { fightPlan, SPECIAL_DAMAGE } from '../../hooks/knightod/game/fight'
import { seededRandom } from '../../hooks/knightod/game/random'
import { pickWeapon, WEAPONS } from '../../hooks/knightod/game/weapons'

test('thrown weapons reach further than close ones and carry something to fly, and every weapon hits for at least one heart', async () => {
  for (const weapon of Object.values(WEAPONS)) {
    expect(weapon.power).toBeGreaterThan(0)
    expect(weapon.chance).toBeGreaterThan(0)
    if (weapon.isThrown) {
      expect(weapon.range).toBeGreaterThan(WEAPONS.lance.range)
      expect(weapon.projectile?.length).toBeGreaterThan(0)
    } else {
      expect(weapon.projectile).toBeUndefined()
    }
  }
  expect(WEAPONS.fireball.range).toBeGreaterThan(WEAPONS.dagger.range)
})

test('every weapon gets picked now and then, the common ones more often', async () => {
  const random = seededRandom(42)
  const counts: Record<string, number> = {}
  for (let roll = 0; roll < 2_000; roll += 1) {
    const name = pickWeapon(random).name
    counts[name] = (counts[name] ?? 0) + 1
  }
  for (const name of Object.keys(WEAPONS)) expect(counts[name] ?? 0).toBeGreaterThan(0)
  expect(counts.sword ?? 0).toBeGreaterThan(counts.fireball ?? 0)
})

test('each strike in a fight names its weapon and takes that weapon\'s power, never more hearts than are left', async () => {
  for (let id = 1; id < 60; id += 1) {
    const plan = fightPlan(7, id, 6)
    expect(plan.reduce((sum, strike) => sum + strike.damage, 0)).toBe(6)
    let left = 6
    for (const strike of plan) {
      const expected = Math.min(strike.isSpecial ? SPECIAL_DAMAGE : WEAPONS[strike.weapon].power, left)
      expect(strike.damage).toBe(expected)
      if (strike.isSpecial) expect(strike.weapon).toBe('sword')
      left -= strike.damage
    }
  }
})

test('only the first strike of a fight may be thrown; once the monster is engaged, every strike is close', async () => {
  let sawThrownOpener = false
  for (let id = 1; id < 300; id += 1) {
    const plan = fightPlan(7, id, 8)
    if (WEAPONS[plan[0]?.weapon ?? 'sword'].isThrown) sawThrownOpener = true
    for (const strike of plan.slice(1)) expect(WEAPONS[strike.weapon].isThrown).toBe(false)
  }
  expect(sawThrownOpener).toBe(true)
})

test('a close-only pick never returns a thrown weapon', async () => {
  const random = seededRandom(9)
  for (let roll = 0; roll < 500; roll += 1) expect(pickWeapon(random, false).isThrown).toBe(false)
})
