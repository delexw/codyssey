import type { Palette, Sprite } from '../pixel'

const PALETTE = { W: '#FAFAFA', k: '#212121', p: '#6A1B9A', s: '#8D6E63', G: '#76FF03', g: '#33691E' }

export const LICH_MINION_PALETTES: readonly Palette[] = [
  { W: '#FAFAFA', k: '#212121', p: '#1565C0', s: '#8D6E63', G: '#18FFFF', g: '#006064' },
  { W: '#FFE082', k: '#3E2723', p: '#B71C1C', s: '#5D4037', G: '#FF9100', g: '#BF360C' },
  { W: '#E0E0E0', k: '#212121', p: '#2E7D32', s: '#795548', G: '#EEFF41', g: '#827717' },
]

export const LICH: readonly Sprite[] = [
  { palette: PALETTE, rows: ['G.WW.', 'sWkkW', 'spppp', 's.p.p'] },
  { palette: PALETTE, rows: ['g.WW.', 'sWkkW', 'spppp', 's.p.p'] },
]
