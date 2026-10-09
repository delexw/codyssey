import { expect, test } from 'claude-code/testing'

import { tokensPerMinute } from '../../hooks/shared/tokenRate'

test('the token rate counts only the last minute, over at least ten seconds', async () => {
  expect(tokensPerMinute([{ at: 0, tokens: 5_000 }], 0)).toBe(30_000)
  expect(tokensPerMinute([{ at: 0, tokens: 5_000 }, { at: 70_000, tokens: 1_000 }], 70_000)).toBe(6_000)
  expect(tokensPerMinute([], 0)).toBe(0)
})
