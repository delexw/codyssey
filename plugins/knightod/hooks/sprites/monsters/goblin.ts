import type { Sprite } from '../pixel'

const PALETTE = { g: '#8BC34A', E: '#FFEB3B', b: '#795548' }

export const GOBLIN: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.gg.', 'gEEg', '.bb.', '.b.b'] },
  { palette: PALETTE, rows: ['.gg.', 'gEEg', '.bb.', 'b.b.'] },
]
