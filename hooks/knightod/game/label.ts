import type { Save, Scene } from '../../../types'

export function hearts(save: Save): string {
  return '♥'.repeat(save.hp) + '♡'.repeat(Math.max(0, save.maxHp - save.hp))
}

export function statusLine(save: Save, scene: Scene): string {
  const mark = scene.isRunning ? '⚔' : scene.isPaused === true ? '⏸' : '⌂'
  return `${mark} Lv ${save.level} · ${hearts(save)} · ${save.kills} slain · ${save.gold} gold · ${scene.latest}`
}
