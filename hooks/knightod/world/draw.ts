import type { Canvas } from '../sprites/pixel'
import { blankCanvas } from '../sprites/pixel'
import { drawCampfire } from './draw/campfire'
import { drawFoe } from './draw/foe'
import { drawGround } from './draw/ground'
import { drawKnight } from './draw/knight'
import { drawShot } from './draw/shot'
import type { World } from './world'
import { STRIP_PIXEL_ROWS } from './world'

export function drawWorld(world: World, width: number): Canvas {
  const canvas = blankCanvas(width, STRIP_PIXEL_ROWS)
  drawGround(canvas, world, width)
  drawCampfire(canvas, world)
  for (const foe of world.foes) drawFoe(canvas, foe, world.tick)
  drawKnight(canvas, world)
  drawShot(canvas, world)
  return canvas
}
