import type { Sprite } from './pixel'

const PALETTE = { b: '#8D6E63', G: '#FFC107', y: '#FFF59D' }

export const CHEST_CLOSED: Sprite = { palette: PALETTE, rows: ['.bbb.', 'bbGbb', 'bbbbb'] }

export const CHEST_OPEN: Sprite = { palette: PALETTE, rows: ['y.y.y', '.bbb.', 'bGGGb', 'bbbbb'] }
