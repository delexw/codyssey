import { expect, test } from 'claude-code/testing'

import { heartCount, hearts } from '../../hooks/knightod/game/label'
import { NEW_SAVE } from '../../hooks/knightod/game/save'

test('the knight draws every heart up to five, then one heart with what is left of the most', async () => {
  expect(hearts({ ...NEW_SAVE, hp: 4, maxHp: 5 })).toBe('♥♥♥♥♡')
  expect(hearts({ ...NEW_SAVE, hp: 7, maxHp: 12 })).toBe('♥7/12')
})

test('a name lists up to five hearts, then one heart and the number', async () => {
  expect(heartCount(4)).toBe('♥♥♥♥')
  expect(heartCount(7)).toBe('♥7')
})
