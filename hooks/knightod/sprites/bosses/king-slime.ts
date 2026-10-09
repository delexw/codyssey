import type { Sprite } from '../pixel'

const PALETTE = { Y: '#FFD600', g: '#43A047', E: '#1B5E20' }

export const KING_SLIME: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.Y.Y.Y.', '.ggggg.', 'gEgggEg', 'ggggggg'] },
  { palette: PALETTE, rows: ['.Y.Y.Y.', 'ggggggg', 'gEgggEg', 'ggggggg'] },
]
