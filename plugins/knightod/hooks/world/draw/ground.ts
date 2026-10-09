import { groundColor, plantColor } from '../../sprites/ground'
import type { Canvas } from '../../sprites/pixel'
import type { World } from '../world'
import { GROUND_ROW } from '../world'

export function drawGround(canvas: Canvas, world: World, width: number): void {
  const ground = canvas[GROUND_ROW]
  const above = canvas[GROUND_ROW - 1]
  for (let x = 0; x < width; x += 1) {
    const worldX = x + world.scroll
    if (ground) ground[x] = groundColor(worldX, world.scene.seed)
    const plant = plantColor(worldX, world.scene.seed)
    if (plant !== null && above) above[x] = plant
  }
}
