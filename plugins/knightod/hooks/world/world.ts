import type { Scene } from '../../types'
import type { Foe } from './foe'

export type KnightAction = 'walk' | 'slash' | 'special' | 'hurt'

export type World = {
  tick: number
  scroll: number
  lastEventId: number
  foes: Foe[]
  action: KnightAction
  actionTicks: number
  settled: number[]
  wounds: Record<string, number>
  scene: Scene
}

export const KNIGHT_X = 3
export const STRIP_PIXEL_ROWS = 6
export const GROUND_ROW = STRIP_PIXEL_ROWS - 1
export const MAX_FOES = 6
export const MAX_SETTLED = 32

export function startWorld(scene: Scene): World {
  return {
    tick: 0,
    scroll: 0,
    lastEventId: (scene.events.find(event => !event.isSettled)?.id ?? scene.nextId) - 1,
    foes: [],
    action: 'walk',
    actionTicks: 0,
    settled: [],
    wounds: {},
    scene,
  }
}

export function isSameScene(left: Scene, right: Scene): boolean {
  return left.nextId === right.nextId && left.isRunning === right.isRunning && left.speed === right.speed && left.seed === right.seed && left.latest === right.latest
}
