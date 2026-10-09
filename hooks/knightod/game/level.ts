import type { Cue } from './cues'

export const MONSTER_LEVELS_PER_HEART = 3
export const BOSS_LEVELS_PER_HEART = 2

export function levelledCue(cue: Cue, level: number): Cue {
  const gained = Math.max(0, level - 1)
  if (cue.kind === 'monster') {
    const hearts = 1 + Math.floor(gained / MONSTER_LEVELS_PER_HEART)
    return hearts > 1 ? { ...cue, hearts } : cue
  }
  if (cue.kind === 'boss') return { ...cue, hearts: (cue.hearts ?? 1) + Math.floor(gained / BOSS_LEVELS_PER_HEART) }
  return cue
}
