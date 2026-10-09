import type { Sprite } from '../pixel'

const PALETTE = { g: '#9E9E9E', E: '#FFEB3B', d: '#616161' }

export const WOLF: readonly Sprite[] = [
  { palette: PALETTE, rows: ['g....', 'Egggg', '.gggd', '.g..g'] },
  { palette: PALETTE, rows: ['g....', 'Egggg', '.gggd', '..gg.'] },
]
