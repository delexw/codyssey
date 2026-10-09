import { MONSTERS } from '../../sprites/monsters'
import type { Mark } from '../../sprites/pixel'
import { frameOf, spriteWidth } from '../../sprites/pixel'
import type { Foe } from '../foe'
import { heartsLeft, isFighting } from '../foe'
import type { World } from '../world'
import { STRIP_PIXEL_ROWS } from '../world'

export const HEART = '♥'
export const LOST_HEART = '♡'
export const HEART_COLOR = '#FF1744'
export const LOST_HEART_COLOR = '#757575'
export const HEART_ROW = STRIP_PIXEL_ROWS / 2 - 2

function foeWidth(foe: Foe, tick: number): number {
  return spriteWidth(frameOf(MONSTERS[foe.species ?? 'slime'].frames, Math.floor(tick / 2)))
}

export function heartLabel(left: number): string {
  return left > 0 ? `${HEART}${left}` : LOST_HEART
}

export function heartMarks(world: World, width: number): (Mark | null)[][] {
  const marks: (Mark | null)[][] = Array.from({ length: HEART_ROW + 1 }, () => Array.from({ length: width }, () => null))
  const row = marks[HEART_ROW]
  if (row === undefined) return marks
  for (const foe of world.foes) {
    if (!isFighting(foe)) continue
    const left = heartsLeft(foe)
    const color = left > 0 ? HEART_COLOR : LOST_HEART_COLOR
    const firstColumn = foe.x + foeWidth(foe, world.tick)
    ;[...heartLabel(left)].forEach((text, index) => {
      const x = firstColumn + index
      if (x >= 0 && x < width) row[x] = { text, color }
    })
  }
  return marks
}
