import type { Sprite } from '../../sprites/pixel'

export type WeaponName = 'sword' | 'axe' | 'lance' | 'dagger' | 'fireball'

export type Weapon = {
  name: WeaponName
  range: number
  power: number
  chance: number
  isThrown: boolean
  pose: Sprite
  projectile?: readonly Sprite[]
}
