import type { Canvas } from '../../sprites/pixel'
import type { Foe } from '../foe'
import { heartsLeft } from '../foe'

const HEARTS_ROW = 0
const HEART_COLOR = '#FF1744'
const LOST_HEART_COLOR = '#424242'

export function drawHearts(canvas: Canvas, foe: Foe): void {
  const row = canvas[HEARTS_ROW]
  if (row === undefined || foe.maxHp <= 1) return
  const left = heartsLeft(foe)
  for (let index = 0; index < foe.maxHp; index += 1) {
    const x = foe.x + index
    if (x >= 0 && x < row.length) row[x] = index < left ? HEART_COLOR : LOST_HEART_COLOR
  }
}
