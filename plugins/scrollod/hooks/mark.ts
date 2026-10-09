import type { CallStatus } from '../types'

export type StatusMark = { glyph: string; color: string }

export function statusMark(call: CallStatus): StatusMark {
  if (call.isRunning) return { glyph: '…', color: 'warning' }
  if (call.isInterrupted) return { glyph: '■', color: 'warning' }
  if (call.isErrored) return { glyph: '✗', color: 'error' }
  return { glyph: '✓', color: 'success' }
}
