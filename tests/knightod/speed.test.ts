import { expect, test } from 'claude-code/testing'

import { speedFromRate } from '../../hooks/knightod/game/speed'

test('the knight walks faster the faster tokens are spent', async () => {
  expect(speedFromRate(10_000)).toBe(1)
  expect(speedFromRate(30_000)).toBe(2)
  expect(speedFromRate(80_000)).toBe(3)
})
