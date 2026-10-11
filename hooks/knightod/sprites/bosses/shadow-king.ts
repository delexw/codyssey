import type { Palette, Sprite } from '../pixel'

const PALETTE = { Y: '#FFD600', d: '#311B92', E: '#E040FB', S: '#B0BEC5' }

export const SHADOW_KING_MINION_PALETTES: readonly Palette[] = [
  { Y: '#FFD600', d: '#B71C1C', E: '#FFEB3B', S: '#B0BEC5' },
  { Y: '#E0E0E0', d: '#004D40', E: '#1DE9B6', S: '#90A4AE' },
  { Y: '#FFD600', d: '#212121', E: '#FF1744', S: '#757575' },
]

export const SHADOW_KING: readonly Sprite[] = [
  { palette: PALETTE, rows: ['S.Y.Y.Y', 'S.dEdEd', 'Sdddddd', '..d.d..'] },
  { palette: PALETTE, rows: ['S.Y.Y.Y', 'S.dEdEd', 'Sdddddd', '...dd..'] },
]
