import type { Palette, Sprite } from '../pixel'

const PALETTE = { W: '#FAFAFA', k: '#212121' }

export const SKELETON_MINION_PALETTES: readonly Palette[] = [
  { W: '#FFE082', k: '#BF360C' },
  { W: '#B2EBF2', k: '#006064' },
  { W: '#D1C4E9', k: '#4A148C' },
]

export const SKELETON: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.WW.', 'WkkW', '.WW.', 'W..W'] },
  { palette: PALETTE, rows: ['.WW.', 'WkkW', '.WW.', '.WW.'] },
]
