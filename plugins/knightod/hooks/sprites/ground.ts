import { hashText } from '../game/random'

const DIRT = ['#6D4C41', '#5D4037']
const GRASS = '#66BB6A'
const FLOWER = '#F06292'

export function groundColor(worldX: number, seed: number): string {
  return DIRT[hashText(`${seed}:${worldX}`) % DIRT.length] ?? '#6D4C41'
}

export function plantColor(worldX: number, seed: number): string | null {
  const roll = hashText(`${seed}:plant:${worldX}`) % 23
  if (roll === 0) return FLOWER
  if (roll < 4) return GRASS
  return null
}
