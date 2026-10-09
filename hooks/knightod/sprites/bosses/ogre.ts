import type { Sprite } from '../pixel'

const PALETTE = { o: '#9E9D24', E: '#D50000', c: '#5D4037' }

export const OGRE: readonly Sprite[] = [
  { palette: PALETTE, rows: ['c.oo..', 'coEEo.', 'cooooo', '.o..o.'] },
  { palette: PALETTE, rows: ['c.oo..', 'coEEo.', 'cooooo', '..oo..'] },
]
