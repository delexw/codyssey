import { expect, test } from 'claude-code/testing'

import { counterHits, fightPlan } from '../hooks/game/fight'
import { NEW_SAVE, woundByBoss } from '../hooks/game/save'
import { startScene, withCue } from '../hooks/game/scene'
import { settleEvents } from '../hooks/game/settle'

test('a fight plan uses up exactly the boss hearts, the same way every time for the same fight', async () => {
  for (let id = 1; id <= 100; id += 1) {
    const plan = fightPlan(7, id, 6)
    expect(plan.reduce((sum, strike) => sum + strike.damage, 0)).toBe(6)
    expect(fightPlan(7, id, 6)).toEqual(plan)
  }
})

test('the knight lands a special now and then that takes two hearts, and the boss strikes back sometimes', async () => {
  let strikes = 0
  let specials = 0
  let counters = 0
  for (let id = 1; id <= 300; id += 1) {
    for (const strike of fightPlan(7, id, 6)) {
      strikes += 1
      if (strike.isSpecial) {
        specials += 1
        expect(strike.damage).toBe(2)
      }
      if (strike.isCountered) counters += 1
    }
  }
  expect(specials / strikes).toBeGreaterThan(0.05)
  expect(specials / strikes).toBeLessThan(0.25)
  expect(counters / strikes).toBeGreaterThan(0.25)
  expect(counters / strikes).toBeLessThan(0.55)
  expect(fightPlan(7, 1, 1)).toHaveLength(1)
  expect(fightPlan(7, 1, 1)[0]?.isSpecial).toBe(false)
})

test('boss hits can take the knight down to one heart but never kill him', async () => {
  expect(woundByBoss({ ...NEW_SAVE, hp: 5 }, 2).hp).toBe(3)
  expect(woundByBoss({ ...NEW_SAVE, hp: 3 }, 6).hp).toBe(1)
  expect(woundByBoss({ ...NEW_SAVE, hp: 1 }, 4)).toEqual({ ...NEW_SAVE, hp: 1 })
})

test('slaying a boss costs the knight a heart for each time it struck back, leaving at least one', async () => {
  let id = 1
  while (counterHits(1, id, 6) < 2) id += 1
  const hits = counterHits(1, id, 6)
  const veteran = { ...NEW_SAVE, level: 20, hp: 5, maxHp: 5 }
  const scene = withCue({ ...startScene(1, null, 0), nextId: id }, { kind: 'boss', species: 'shadow-king', target: '', hearts: 6 })
  const healthy = settleEvents(veteran, scene, [id]).save
  expect(healthy.hp).toBe(5 - hits)
  expect(healthy.deaths).toBe(0)
  const weak = settleEvents({ ...veteran, hp: 1 }, scene, [id]).save
  expect(weak.hp).toBe(1)
  expect(weak.deaths).toBe(0)
})
