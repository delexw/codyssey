import type { Palette, Sprite } from '../pixel'

const PALETTE = { Y: '#FFD600', g: '#43A047', E: '#1B5E20' }

export const KING_SLIME_MINION_PALETTES: readonly Palette[] = [
  { Y: '#FFD600', g: '#1E88E5', E: '#0D47A1' },
  { Y: '#E0E0E0', g: '#D81B60', E: '#880E4F' },
  { Y: '#FFD600', g: '#8E24AA', E: '#4A148C' },
]

export const KING_SLIME: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.Y.Y.Y.', '.ggggg.', 'gEgggEg', 'ggggggg'] },
  { palette: PALETTE, rows: ['.Y.Y.Y.', 'ggggggg', 'gEgggEg', 'ggggggg'] },
]
