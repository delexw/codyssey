import { WEAPONS } from '../../game/weapons'
import type { Canvas } from '../../sprites/pixel'
import { frameOf, stamp } from '../../sprites/pixel'
import type { World } from '../world'

const HAND_ROW = 2

export function drawShot(canvas: Canvas, world: World): void {
  const shot = world.shot
  const frames = shot ? WEAPONS[shot.weapon].projectile : undefined
  if (!shot || frames === undefined) return
  const sprite = frameOf(frames, world.tick)
  stamp(canvas, sprite, shot.x, HAND_ROW + Math.floor(sprite.rows.length / 2))
}
