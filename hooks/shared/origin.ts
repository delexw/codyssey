import type { Origin } from 'claude-code'

export function isSessionCall(origin: Origin): boolean {
  return origin.plugin === 'engine'
}
