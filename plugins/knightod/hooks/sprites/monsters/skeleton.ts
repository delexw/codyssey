import type { Sprite } from '../pixel'

const PALETTE = { W: '#FAFAFA', k: '#212121' }

export const SKELETON: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.WW.', 'WkkW', '.WW.', 'W..W'] },
  { palette: PALETTE, rows: ['.WW.', 'WkkW', '.WW.', '.WW.'] },
]
