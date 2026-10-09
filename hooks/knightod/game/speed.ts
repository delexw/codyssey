export function speedFromRate(perMinute: number): number {
  if (perMinute >= 80_000) return 3
  if (perMinute >= 30_000) return 2
  return 1
}
