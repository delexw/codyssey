import type { Palette, Sprite } from '../pixel'

const PALETTE = { k: '#5D4037', E: '#FF1744' }

export const SPIDER_MINION_PALETTES: readonly Palette[] = [
  { k: '#212121', E: '#76FF03' },
  { k: '#1A237E', E: '#FFEB3B' },
  { k: '#880E4F', E: '#00E5FF' },
]

export const SPIDER: readonly Sprite[] = [
  { palette: PALETTE, rows: ['k.kk.k', '.kEEk.', 'k.kk.k'] },
  { palette: PALETTE, rows: ['..kk..', 'kkEEkk', '.k..k.'] },
]
