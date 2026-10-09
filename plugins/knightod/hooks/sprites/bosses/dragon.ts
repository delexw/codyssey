import type { Sprite } from '../pixel'

const PALETTE = { r: '#E53935', d: '#B71C1C', E: '#FFEB3B', f: '#FF9800' }

export const DRAGON: readonly Sprite[] = [
  { palette: PALETTE, rows: ['f...rr.', 'frrrrEr', 'rrrrrrr', '.d...d.'] },
  { palette: PALETTE, rows: ['....rr.', 'ffrrrEr', 'rrrrrrr', 'd.....d'] },
]
