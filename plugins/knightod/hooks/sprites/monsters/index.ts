import type { Species } from '../../../types'
import type { Sprite } from '../pixel'
import { DEMON } from '../bosses/demon'
import { KING_SLIME } from '../bosses/king-slime'
import { LICH } from '../bosses/lich'
import { OGRE } from '../bosses/ogre'
import { SHADOW_KING } from '../bosses/shadow-king'
import { BAT } from './bat'
import { DRAGON } from '../bosses/dragon'
import { GHOST } from './ghost'
import { GOBLIN } from './goblin'
import { ORC } from './orc'
import { SKELETON } from './skeleton'
import { SLIME } from './slime'
import { SPIDER } from './spider'
import { WOLF } from './wolf'

export type Monster = { frames: readonly Sprite[]; isFlying: boolean }

export const MONSTERS: Record<Species, Monster> = {
  slime: { frames: SLIME, isFlying: false },
  goblin: { frames: GOBLIN, isFlying: false },
  bat: { frames: BAT, isFlying: true },
  skeleton: { frames: SKELETON, isFlying: false },
  wolf: { frames: WOLF, isFlying: false },
  spider: { frames: SPIDER, isFlying: false },
  ghost: { frames: GHOST, isFlying: true },
  orc: { frames: ORC, isFlying: false },
  'king-slime': { frames: KING_SLIME, isFlying: false },
  ogre: { frames: OGRE, isFlying: false },
  lich: { frames: LICH, isFlying: false },
  demon: { frames: DEMON, isFlying: false },
  'shadow-king': { frames: SHADOW_KING, isFlying: false },
  dragon: { frames: DRAGON, isFlying: false },
}
