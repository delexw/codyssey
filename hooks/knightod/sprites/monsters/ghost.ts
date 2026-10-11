import type { Palette, Sprite } from '../pixel'

const PALETTE = { w: '#ECEFF1', k: '#263238' }

export const GHOST_MINION_PALETTES: readonly Palette[] = [
  { w: '#B3E5FC', k: '#01579B' },
  { w: '#C8E6C9', k: '#1B5E20' },
  { w: '#F8BBD0', k: '#880E4F' },
]

export const GHOST: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.www.', 'wkwkw', 'wwwww', 'w.w.w'] },
  { palette: PALETTE, rows: ['.www.', 'wkwkw', 'wwwww', '.w.w.'] },
]
