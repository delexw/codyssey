import type { Sprite } from '../pixel'

const PALETTE = { W: '#FAFAFA', k: '#212121', p: '#6A1B9A', s: '#8D6E63', G: '#76FF03', g: '#33691E' }

export const LICH: readonly Sprite[] = [
  { palette: PALETTE, rows: ['G.WW.', 'sWkkW', 'spppp', 's.p.p'] },
  { palette: PALETTE, rows: ['g.WW.', 'sWkkW', 'spppp', 's.p.p'] },
]
