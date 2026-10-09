import type { Sprite } from '../pixel'

const PALETTE = { w: '#7E57C2', b: '#4527A0', E: '#FF5252' }

export const BAT: readonly Sprite[] = [
  { palette: PALETTE, rows: ['w.b.w', 'wwEww'] },
  { palette: PALETTE, rows: ['..b..', 'wwEww', 'w...w'] },
]
