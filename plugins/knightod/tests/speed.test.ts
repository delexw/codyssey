import { expect, test } from 'claude-code/testing'

import { speedFromRate, tokensPerMinute } from '../hooks/game/speed'

test('the knight walks faster the faster tokens are spent, counting only the last minute', async () => {
  expect(tokensPerMinute([{ at: 0, tokens: 5_000 }], 0)).toBe(30_000)
  expect(tokensPerMinute([{ at: 0, tokens: 5_000 }, { at: 70_000, tokens: 1_000 }], 70_000)).toBe(6_000)
  expect(speedFromRate(10_000)).toBe(1)
  expect(speedFromRate(30_000)).toBe(2)
  expect(speedFromRate(80_000)).toBe(3)
})
