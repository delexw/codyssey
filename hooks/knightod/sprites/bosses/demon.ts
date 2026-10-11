import type { Palette, Sprite } from '../pixel'

const PALETTE = { h: '#FFCC80', r: '#C62828', E: '#FFEB3B', w: '#4E342E' }

export const DEMON_MINION_PALETTES: readonly Palette[] = [
  { h: '#ECEFF1', r: '#4527A0', E: '#76FF03', w: '#1A237E' },
  { h: '#FFD54F', r: '#2E7D32', E: '#FF1744', w: '#1B5E20' },
  { h: '#B0BEC5', r: '#212121', E: '#FF6D00', w: '#424242' },
]

export const DEMON: readonly Sprite[] = [
  { palette: PALETTE, rows: ['h.....h', 'wrErErw', 'wwrrrww', '..r.r..'] },
  { palette: PALETTE, rows: ['hw...wh', '.rErEr.', 'wwrrrww', '..r.r..'] },
]
