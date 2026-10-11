import type { Palette, Sprite } from '../pixel'

const PALETTE = { o: '#9E9D24', E: '#D50000', c: '#5D4037' }

export const OGRE_MINION_PALETTES: readonly Palette[] = [
  { o: '#8D6E63', E: '#FFEB3B', c: '#3E2723' },
  { o: '#607D8B', E: '#FF1744', c: '#263238' },
  { o: '#7B1FA2', E: '#76FF03', c: '#4A148C' },
]

export const OGRE: readonly Sprite[] = [
  { palette: PALETTE, rows: ['c.oo..', 'coEEo.', 'cooooo', '.o..o.'] },
  { palette: PALETTE, rows: ['c.oo..', 'coEEo.', 'cooooo', '..oo..'] },
]
