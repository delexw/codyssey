export type EventKind = 'monster' | 'boss' | 'chest' | 'scroll' | 'hurt'

export type MonsterSpecies = 'slime' | 'goblin' | 'bat' | 'skeleton' | 'wolf' | 'spider' | 'ghost' | 'orc'

export type BossSpecies = 'king-slime' | 'ogre' | 'lich' | 'demon' | 'shadow-king' | 'dragon'

export type Species = MonsterSpecies | BossSpecies

export type GameEvent = {
  id: number
  kind: EventKind
  species: Species | null
  name: string
  hearts?: number
  woundsTaken?: number
  isSettled: boolean
}

export type Save = {
  level: number
  xp: number
  hp: number
  maxHp: number
  kills: number
  gold: number
  deaths: number
  quests: number
  playMs: number
  bossesSlain: number
}

export type Scene = {
  isRunning: boolean
  seed: number
  speed: number
  events: GameEvent[]
  nextId: number
  latest: string
  startedAt: number
}

export type StripProps = { scene: Scene }

declare module 'claude-code' {
  interface PluginState {
    knightod: { isEnabled: boolean; save: Save; scene: Scene | null }
  }
}
