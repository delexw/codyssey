import { expect, test } from 'claude-code/testing'

import { statusMark } from '../../hooks/scrollod/mark'

test('the status mark tells running, interrupted, failed and done apart', async () => {
  const call = { isRunning: false, isErrored: false, isInterrupted: false }
  expect(statusMark({ ...call, isRunning: true }).glyph).toBe('…')
  expect(statusMark({ ...call, isInterrupted: true, isErrored: true }).glyph).toBe('■')
  expect(statusMark({ ...call, isErrored: true })).toEqual({ glyph: '✗', color: 'error' })
  expect(statusMark(call)).toEqual({ glyph: '✓', color: 'success' })
})
