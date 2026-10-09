import { expect, test } from 'claude-code/testing'

import { levelledCue } from '../../hooks/knightod/game/level'

test('monsters gain a heart every three knight levels, starting with one', async () => {
  const slime = { kind: 'monster', species: 'slime', target: 'app.ts' } as const
  expect(levelledCue(slime, 1)).toEqual(slime)
  expect(levelledCue(slime, 3)).toEqual(slime)
  expect(levelledCue(slime, 4).hearts).toBe(2)
  expect(levelledCue(slime, 10).hearts).toBe(4)
})

test('bosses gain a heart every two knight levels on top of their own', async () => {
  const ogre = { kind: 'boss', species: 'ogre', target: '', hearts: 4 } as const
  expect(levelledCue(ogre, 1).hearts).toBe(4)
  expect(levelledCue(ogre, 3).hearts).toBe(5)
  expect(levelledCue(ogre, 6).hearts).toBe(6)
})

test('scrolls, chests and hits stay as they are', async () => {
  const chest = { kind: 'chest', species: null, target: 'git push' } as const
  expect(levelledCue(chest, 9)).toEqual(chest)
})
