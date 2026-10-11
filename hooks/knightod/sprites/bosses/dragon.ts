import type { Palette, Sprite } from '../pixel'

const PALETTE = { r: '#E53935', d: '#B71C1C', E: '#FFEB3B', f: '#FF9800' }

export const DRAGON_MINION_PALETTES: readonly Palette[] = [
  { r: '#43A047', d: '#1B5E20', E: '#FFEB3B', f: '#00E5FF' },
  { r: '#1E88E5', d: '#0D47A1', E: '#FFFFFF', f: '#B388FF' },
  { r: '#424242', d: '#212121', E: '#FF1744', f: '#7C4DFF' },
]

export const DRAGON: readonly Sprite[] = [
  { palette: PALETTE, rows: ['f...rr.', 'frrrrEr', 'rrrrrrr', '.d...d.'] },
  { palette: PALETTE, rows: ['....rr.', 'ffrrrEr', 'rrrrrrr', 'd.....d'] },
]
