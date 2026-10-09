import type { Save, Scene } from '../../../types'

export const MAX_DRAWN_HEARTS = 5

export function hearts(save: Save): string {
  if (save.maxHp > MAX_DRAWN_HEARTS) return `♥${save.hp}/${save.maxHp}`
  return '♥'.repeat(save.hp) + '♡'.repeat(Math.max(0, save.maxHp - save.hp))
}

export function heartCount(count: number): string {
  return count > MAX_DRAWN_HEARTS ? `♥${count}` : '♥'.repeat(count)
}

export function statusLine(save: Save, scene: Scene): string {
  const mark = scene.isRunning ? '⚔' : scene.isPaused === true ? '⏸' : '⌂'
  return `${mark} Lv ${save.level} · ${hearts(save)} · ${save.kills} slain · ${save.gold} gold · ${scene.latest}`
}
