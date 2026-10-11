import type { Palette, Sprite } from '../pixel'

const PALETTE = { g: '#9E9E9E', E: '#FFEB3B', d: '#616161' }

export const WOLF_MINION_PALETTES: readonly Palette[] = [
  { g: '#ECEFF1', E: '#40C4FF', d: '#B0BEC5' },
  { g: '#8D6E63', E: '#FFEB3B', d: '#4E342E' },
  { g: '#424242', E: '#FF1744', d: '#212121' },
]

export const WOLF: readonly Sprite[] = [
  { palette: PALETTE, rows: ['g....', 'Egggg', '.gggd', '.g..g'] },
  { palette: PALETTE, rows: ['g....', 'Egggg', '.gggd', '..gg.'] },
]
