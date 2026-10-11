import type { Palette, Sprite } from '../pixel'

const PALETTE = { g: '#66BB6A', E: '#1B5E20' }

export const SLIME_MINION_PALETTES: readonly Palette[] = [
  { g: '#42A5F5', E: '#0D47A1' },
  { g: '#F06292', E: '#880E4F' },
  { g: '#FFCA28', E: '#E65100' },
]

export const SLIME: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.ggg.', 'gEgEg', 'ggggg'] },
  { palette: PALETTE, rows: ['.....', '.ggg.', 'gEgEg', 'ggggg'] },
]
