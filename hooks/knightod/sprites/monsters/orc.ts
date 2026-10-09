import type { Sprite } from '../pixel'

const PALETTE = { o: '#558B2F', E: '#FF7043', a: '#BDBDBD', h: '#6D4C41' }

export const ORC: readonly Sprite[] = [
  { palette: PALETTE, rows: ['a.oo.', 'hoEEo', 'hoooo', '.o..o'] },
  { palette: PALETTE, rows: ['a.oo.', 'hoEEo', 'hoooo', '..oo.'] },
]
