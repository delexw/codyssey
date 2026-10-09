import { CAMPFIRE } from '../../sprites/campfire'
import { KNIGHT_WIDTH } from '../../sprites/knight'
import type { Canvas } from '../../sprites/pixel'
import { frameOf, stamp } from '../../sprites/pixel'
import type { World } from '../world'
import { GROUND_ROW, KNIGHT_X } from '../world'

export function drawCampfire(canvas: Canvas, world: World): void {
  if (world.scene.isRunning) return
  stamp(canvas, frameOf(CAMPFIRE, Math.floor(world.tick / 2)), KNIGHT_X + KNIGHT_WIDTH + 1, GROUND_ROW - 1)
}
