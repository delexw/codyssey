import { CHEST_CLOSED, CHEST_OPEN } from '../../sprites/chest'
import { MONSTERS } from '../../sprites/monsters'
import type { Canvas } from '../../sprites/pixel'
import { frameOf, stamp } from '../../sprites/pixel'
import { SCROLL } from '../../sprites/scroll'
import type { Foe } from '../foe'
import { GROUND_ROW } from '../world'

const FLYING_ROW = 2

export function drawFoe(canvas: Canvas, foe: Foe, tick: number): void {
  if (foe.kind === 'scroll') {
    if (foe.phase === 'coming') stamp(canvas, SCROLL, foe.x, GROUND_ROW - 1)
    return
  }
  if (foe.kind === 'chest') {
    stamp(canvas, foe.phase === 'hit' ? CHEST_OPEN : CHEST_CLOSED, foe.x, GROUND_ROW - 1)
    return
  }
  const monster = MONSTERS[foe.species ?? 'slime']
  if (foe.phase === 'coming' || tick % 2 !== 0) stamp(canvas, frameOf(monster.frames, Math.floor(tick / 2)), foe.x, monster.isFlying ? FLYING_ROW : GROUND_ROW - 1)
}
