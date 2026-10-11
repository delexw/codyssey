import type { Palette, Sprite } from '../pixel'

const PALETTE = { g: '#8BC34A', E: '#FFEB3B', b: '#795548' }

export const GOBLIN_MINION_PALETTES: readonly Palette[] = [
  { g: '#26A69A', E: '#FFEB3B', b: '#37474F' },
  { g: '#EF5350', E: '#FFF59D', b: '#4E342E' },
  { g: '#AB47BC', E: '#C6FF00', b: '#5D4037' },
]

export const GOBLIN: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.gg.', 'gEEg', '.bb.', '.b.b'] },
  { palette: PALETTE, rows: ['.gg.', 'gEEg', '.bb.', 'b.b.'] },
]
