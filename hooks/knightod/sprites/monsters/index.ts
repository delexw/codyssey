import type { Species } from '../../../../types'
import type { Palette, Sprite } from '../pixel'
import { DEMON, DEMON_MINION_PALETTES } from '../bosses/demon'
import { KING_SLIME, KING_SLIME_MINION_PALETTES } from '../bosses/king-slime'
import { LICH, LICH_MINION_PALETTES } from '../bosses/lich'
import { OGRE, OGRE_MINION_PALETTES } from '../bosses/ogre'
import { SHADOW_KING, SHADOW_KING_MINION_PALETTES } from '../bosses/shadow-king'
import { BAT, BAT_MINION_PALETTES } from './bat'
import { DRAGON, DRAGON_MINION_PALETTES } from '../bosses/dragon'
import { GHOST, GHOST_MINION_PALETTES } from './ghost'
import { GOBLIN, GOBLIN_MINION_PALETTES } from './goblin'
import { ORC, ORC_MINION_PALETTES } from './orc'
import { SKELETON, SKELETON_MINION_PALETTES } from './skeleton'
import { SLIME, SLIME_MINION_PALETTES } from './slime'
import { SPIDER, SPIDER_MINION_PALETTES } from './spider'
import { WOLF, WOLF_MINION_PALETTES } from './wolf'

export type Monster = { frames: readonly Sprite[]; minionPalettes: readonly Palette[]; isFlying: boolean }

export const MONSTERS: Record<Species, Monster> = {
  slime: { frames: SLIME, minionPalettes: SLIME_MINION_PALETTES, isFlying: false },
  goblin: { frames: GOBLIN, minionPalettes: GOBLIN_MINION_PALETTES, isFlying: false },
  bat: { frames: BAT, minionPalettes: BAT_MINION_PALETTES, isFlying: true },
  skeleton: { frames: SKELETON, minionPalettes: SKELETON_MINION_PALETTES, isFlying: false },
  wolf: { frames: WOLF, minionPalettes: WOLF_MINION_PALETTES, isFlying: false },
  spider: { frames: SPIDER, minionPalettes: SPIDER_MINION_PALETTES, isFlying: false },
  ghost: { frames: GHOST, minionPalettes: GHOST_MINION_PALETTES, isFlying: true },
  orc: { frames: ORC, minionPalettes: ORC_MINION_PALETTES, isFlying: false },
  'king-slime': { frames: KING_SLIME, minionPalettes: KING_SLIME_MINION_PALETTES, isFlying: false },
  ogre: { frames: OGRE, minionPalettes: OGRE_MINION_PALETTES, isFlying: false },
  lich: { frames: LICH, minionPalettes: LICH_MINION_PALETTES, isFlying: false },
  demon: { frames: DEMON, minionPalettes: DEMON_MINION_PALETTES, isFlying: false },
  'shadow-king': { frames: SHADOW_KING, minionPalettes: SHADOW_KING_MINION_PALETTES, isFlying: false },
  dragon: { frames: DRAGON, minionPalettes: DRAGON_MINION_PALETTES, isFlying: false },
}
