import { HURT_TINT, KNIGHT_REST, KNIGHT_SLASH, KNIGHT_SPECIAL, KNIGHT_WALK } from '../../sprites/knight'
import type { Canvas, Sprite } from '../../sprites/pixel'
import { frameOf, stamp } from '../../sprites/pixel'
import type { World } from '../world'
import { GROUND_ROW, KNIGHT_X } from '../world'

function knightSprite(world: World): Sprite {
  if (!world.scene.isRunning) return KNIGHT_REST
  if (world.action === 'slash') return KNIGHT_SLASH
  if (world.action === 'special') return KNIGHT_SPECIAL
  return frameOf(KNIGHT_WALK, Math.floor(world.scroll / 2))
}

export function drawKnight(canvas: Canvas, world: World): void {
  stamp(canvas, knightSprite(world), KNIGHT_X, GROUND_ROW - 1, world.action === 'hurt' && world.tick % 2 === 0 ? HURT_TINT : undefined)
}
