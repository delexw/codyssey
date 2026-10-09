import type { Sprite } from './pixel'

const PALETTE = { o: '#FF7043', Y: '#FFEB3B', w: '#6D4C41' }

export const CAMPFIRE: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.o.', 'oYo', 'www'] },
  { palette: PALETTE, rows: ['o..', '.Yo', 'www'] },
]
