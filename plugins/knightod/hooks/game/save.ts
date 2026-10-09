import type { EventKind, Save } from '../../types'

export const NEW_SAVE: Save = { level: 1, xp: 0, hp: 5, maxHp: 5, kills: 0, gold: 0, deaths: 0, quests: 0, playMs: 0, bossesSlain: 0 }

export function playMinutes(save: Save): number {
  return Math.floor(save.playMs / 60_000)
}

export function xpForNextLevel(level: number): number {
  return level * 8
}

function gainXp(save: Save, xp: number): Save {
  let next = { ...save, xp: save.xp + xp }
  while (next.xp >= xpForNextLevel(next.level)) {
    next = { ...next, xp: next.xp - xpForNextLevel(next.level), level: next.level + 1, maxHp: next.maxHp + 1 }
    next = { ...next, hp: next.maxHp }
  }
  return next
}

export function applyEvent(save: Save, kind: EventKind, random: () => number, hearts = 1): Save {
  switch (kind) {
    case 'monster':
      return gainXp({ ...save, kills: save.kills + 1, gold: save.gold + 1 + Math.floor(random() * 3) }, 1)
    case 'boss':
      return gainXp({ ...save, kills: save.kills + 1, gold: save.gold + 5 * hearts + Math.floor(random() * 10) }, 2 * hearts)
    case 'chest':
      return { ...save, gold: save.gold + 5 + Math.floor(random() * 20) }
    case 'scroll':
      return { ...save, hp: Math.min(save.maxHp, save.hp + 1) }
    case 'hurt':
      return save.hp > 1 ? { ...save, hp: save.hp - 1 } : { ...save, hp: save.maxHp, deaths: save.deaths + 1, gold: Math.floor(save.gold / 2) }
  }
}

export function woundByBoss(save: Save, hits: number): Save {
  return { ...save, hp: Math.max(Math.min(save.hp, 1), save.hp - hits) }
}

export function finishQuest(save: Save, playedMs: number): Save {
  return { ...save, quests: save.quests + 1, playMs: save.playMs + Math.max(0, playedMs) }
}
