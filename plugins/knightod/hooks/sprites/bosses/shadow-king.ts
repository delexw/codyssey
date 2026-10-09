import type { Sprite } from '../pixel'

const PALETTE = { Y: '#FFD600', d: '#311B92', E: '#E040FB', S: '#B0BEC5' }

export const SHADOW_KING: readonly Sprite[] = [
  { palette: PALETTE, rows: ['S.Y.Y.Y', 'S.dEdEd', 'Sdddddd', '..d.d..'] },
  { palette: PALETTE, rows: ['S.Y.Y.Y', 'S.dEdEd', 'Sdddddd', '...dd..'] },
]
