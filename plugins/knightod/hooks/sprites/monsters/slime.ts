import type { Sprite } from '../pixel'

const PALETTE = { g: '#66BB6A', E: '#1B5E20' }

export const SLIME: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.ggg.', 'gEgEg', 'ggggg'] },
  { palette: PALETTE, rows: ['.....', '.ggg.', 'gEgEg', 'ggggg'] },
]
