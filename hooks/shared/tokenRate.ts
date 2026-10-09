export const RATE_WINDOW_MS = 60_000

export type Spend = { at: number; tokens: number }

export function tokensPerMinute(spends: readonly Spend[], now: number): number {
  const recent = spends.filter(spend => now - spend.at < RATE_WINDOW_MS)
  const tokens = recent.reduce((sum, spend) => sum + spend.tokens, 0)
  const elapsed = Math.max(10_000, now - (recent[0]?.at ?? now))
  return (tokens * 60_000) / elapsed
}
