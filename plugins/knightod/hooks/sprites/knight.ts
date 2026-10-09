import type { Sprite } from './pixel'

const PALETTE = {
  H: '#CFD8DC',
  V: '#37474F',
  A: '#90A4AE',
  C: '#E53935',
  S: '#ECEFF1',
  G: '#FFC107',
  L: '#546E7A',
  Y: '#FFEB3B',
  O: '#FF9800',
}

export const KNIGHT_WIDTH = 5

export const KNIGHT_WALK: readonly Sprite[] = [
  { palette: PALETTE, rows: ['.HH.S', '.HV.S', 'CAAAG', '.AA..', '.L.L.'] },
  { palette: PALETTE, rows: ['.HH.S', '.HV.S', 'CAAAG', '.AA..', '..LL.'] },
]

export const KNIGHT_SLASH: Sprite = { palette: PALETTE, rows: ['.HH....', '.HV....', 'CAAAGSS', '.AA....', '.L.L...'] }

export const KNIGHT_SPECIAL: Sprite = { palette: PALETTE, rows: ['.HH...Y.', '.HV..YO.', 'CAAAGYYYO', '.AA..YO.', '.L.L..Y.'] }

export const KNIGHT_REST: Sprite = { palette: PALETTE, rows: ['.HH.S', '.HV.S', 'CAAAG', 'LLL..'] }

export const HURT_TINT = '#EF5350'
