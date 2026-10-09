import type { Sprite } from '../pixel'

const PALETTE = { w: '#ECEFF1', k: '#263238' }

export const GHOST: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.www.', 'wkwkw', 'wwwww', 'w.w.w'] },
  { palette: PALETTE, rows: ['.www.', 'wkwkw', 'wwwww', '.w.w.'] },
]
