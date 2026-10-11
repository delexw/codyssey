import type { Palette, Sprite } from '../pixel'

const PALETTE = { o: '#558B2F', E: '#FF7043', a: '#BDBDBD', h: '#6D4C41' }

export const ORC_MINION_PALETTES: readonly Palette[] = [
  { o: '#5D4037', E: '#FFEB3B', a: '#BDBDBD', h: '#3E2723' },
  { o: '#546E7A', E: '#FF1744', a: '#ECEFF1', h: '#263238' },
  { o: '#8E24AA', E: '#76FF03', a: '#FFD54F', h: '#4A148C' },
]

export const ORC: readonly Sprite[] = [
  { palette: PALETTE, rows: ['a.oo.', 'hoEEo', 'hoooo', '.o..o'] },
  { palette: PALETTE, rows: ['a.oo.', 'hoEEo', 'hoooo', '..oo.'] },
]
