import type { CallStatus } from '../../types'

export type Outcome = { mark: string; color: string; note: string }

export function gameOutcome(call: CallStatus): Outcome {
  if (call.isInterrupted) return { mark: '■', color: 'warning', note: ' — fled' }
  if (call.isErrored) return { mark: '✗', color: 'error', note: ' — took a hit' }
  return { mark: '✓', color: 'success', note: '' }
}
