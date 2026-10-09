import { DAGGER_SPRITE, KNIGHT_THROW } from '../../sprites/knight'
import type { Weapon } from './weapon'

export const DAGGER: Weapon = { name: 'dagger', range: 14, power: 1, chance: 2, isThrown: true, pose: KNIGHT_THROW, projectile: DAGGER_SPRITE }
