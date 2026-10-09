import { FIREBALL_SPRITE, KNIGHT_THROW } from '../../sprites/knight'
import type { Weapon } from './weapon'

export const FIREBALL: Weapon = { name: 'fireball', range: 20, power: 2, chance: 1, isThrown: true, pose: KNIGHT_THROW, projectile: FIREBALL_SPRITE }
