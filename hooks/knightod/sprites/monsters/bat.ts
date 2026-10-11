import type { Palette, Sprite } from '../pixel'

const PALETTE = { w: '#7E57C2', b: '#4527A0', E: '#FF5252' }

export const BAT_MINION_PALETTES: readonly Palette[] = [
  { w: '#EF5350', b: '#B71C1C', E: '#FFEB3B' },
  { w: '#26C6DA', b: '#00838F', E: '#FF5252' },
  { w: '#8D6E63', b: '#4E342E', E: '#76FF03' },
]

export const BAT: readonly Sprite[] = [
  { palette: PALETTE, rows: ['w.b.w', 'wwEww'] },
  { palette: PALETTE, rows: ['..b..', 'wwEww', 'w...w'] },
]
