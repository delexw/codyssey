import { expect, test } from 'claude-code/testing'

import { applyEvent, finishQuest, NEW_SAVE, xpForNextLevel } from '../hooks/game/save'

const noLuck = () => 0

test('a slain monster adds a kill, gold and xp, and enough xp levels the knight up with full health', async () => {
  const once = applyEvent(NEW_SAVE, 'monster', noLuck)
  expect(once).toEqual({ ...NEW_SAVE, kills: 1, gold: 1, xp: 1 })

  let save = { ...NEW_SAVE, hp: 2 }
  for (let index = 0; index < xpForNextLevel(1); index += 1) save = applyEvent(save, 'monster', noLuck)
  expect(save.level).toBe(2)
  expect(save.xp).toBe(0)
  expect(save.maxHp).toBe(6)
  expect(save.hp).toBe(6)
})

test('a hit costs a heart, and the last heart revives the knight at half the gold', async () => {
  expect(applyEvent(NEW_SAVE, 'hurt', noLuck).hp).toBe(4)
  const fallen = applyEvent({ ...NEW_SAVE, hp: 1, gold: 21 }, 'hurt', noLuck)
  expect(fallen).toEqual({ ...NEW_SAVE, hp: 5, gold: 10, deaths: 1 })
})

test('a scroll heals one heart up to the most, a chest and a boss bring gold, and a finished task counts a quest', async () => {
  expect(applyEvent({ ...NEW_SAVE, hp: 3 }, 'scroll', noLuck).hp).toBe(4)
  expect(applyEvent(NEW_SAVE, 'scroll', noLuck).hp).toBe(5)
  expect(applyEvent(NEW_SAVE, 'chest', noLuck).gold).toBe(5)
  expect(applyEvent(NEW_SAVE, 'boss', noLuck, 3)).toMatchObject({ kills: 1, gold: 15, xp: 6 })
  expect(finishQuest(NEW_SAVE, 90_000)).toMatchObject({ quests: 1, playMs: 90_000 })
  expect(finishQuest({ ...NEW_SAVE, playMs: 60_000 }, -5).playMs).toBe(60_000)
})
