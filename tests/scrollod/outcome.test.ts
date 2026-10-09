import { expect, test } from 'claude-code/testing'

import { gameOutcome } from '../../hooks/scrollod/outcome'

test('a call ends as a win, a hit taken, or a retreat', async () => {
  const call = { isRunning: false, isErrored: false, isInterrupted: false }
  expect(gameOutcome(call)).toEqual({ mark: '✓', color: 'success', note: '' })
  expect(gameOutcome({ ...call, isErrored: true })).toEqual({ mark: '✗', color: 'error', note: ' — took a hit' })
  expect(gameOutcome({ ...call, isErrored: true, isInterrupted: true }).note).toBe(' — fled')
})
