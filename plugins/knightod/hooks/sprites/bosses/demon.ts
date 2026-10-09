import type { Sprite } from '../pixel'

const PALETTE = { h: '#FFCC80', r: '#C62828', E: '#FFEB3B', w: '#4E342E' }

export const DEMON: readonly Sprite[] = [
  { palette: PALETTE, rows: ['h.....h', 'wrErErw', 'wwrrrww', '..r.r..'] },
  { palette: PALETTE, rows: ['hw...wh', '.rErEr.', 'wwrrrww', '..r.r..'] },
]
