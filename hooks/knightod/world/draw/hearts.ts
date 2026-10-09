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
export const HEART_ROWS = STRIP_PIXEL_ROWS / 2 - 1
export const MIN_HEARTS_PER_ROW = 4

function foeWidth(foe: Foe, tick: number): number {
  return spriteWidth(frameOf(MONSTERS[foe.species ?? 'slime'].frames, Math.floor(tick / 2)))
}

export function heartMarks(world: World, width: number): (Mark | null)[][] {
  const marks: (Mark | null)[][] = Array.from({ length: HEART_ROWS }, () => Array.from({ length: width }, () => null))
  for (const foe of world.foes) {
    if (!isFighting(foe)) continue
    const left = heartsLeft(foe)
    const firstColumn = foe.x + foeWidth(foe, world.tick)
    const perRow = Math.max(MIN_HEARTS_PER_ROW, Math.ceil(foe.maxHp / HEART_ROWS))
    for (let index = 0; index < foe.maxHp; index += 1) {
      const row = marks[HEART_ROWS - 1 - Math.floor(index / perRow)]
      const x = firstColumn + (index % perRow)
      if (row !== undefined && x >= 0 && x < width) row[x] = index < left ? { text: HEART, color: HEART_COLOR } : { text: LOST_HEART, color: LOST_HEART_COLOR }
    }
  }
  return marks
}
