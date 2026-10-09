import type { Sprite } from '../pixel'

const PALETTE = { k: '#5D4037', E: '#FF1744' }

export const SPIDER: readonly Sprite[] = [
  { palette: PALETTE, rows: ['k.kk.k', '.kEEk.', 'k.kk.k'] },
  { palette: PALETTE, rows: ['..kk..', 'kkEEkk', '.k..k.'] },
]
