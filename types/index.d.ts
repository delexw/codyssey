export type NowPlaying = {
  clipId: number
  label: string
  color: string
  levels: number[]
  pointsPerSecond: number
}

export type WaveProps = NowPlaying & { wave: string }

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
  isPaused?: boolean
  seed: number
  speed: number
  events: GameEvent[]
  nextId: number
  latest: string
  startedAt: number
}

export type StripProps = { scene: Scene }

export type CallStatus = { isRunning: boolean; isErrored: boolean; isInterrupted: boolean }

export type Style = 'plain' | 'game'

export type ProgressLook = 'spin' | 'charge'

declare module 'claude-code' {
  interface PluginState {
    codyssey: {
      'miod.isEnabled': boolean
      'miod.nowPlaying': NowPlaying | null
      'miod.wave': string
      'knightod.isEnabled': boolean
      'knightod.save': Save
      'knightod.scene': Scene | null
      'scrollod.isOn': boolean
      'scrollod.style': 'plain' | 'game'
      'scrollod.runStarts': string[]
      'scrollod.lastBlock': 'tool' | 'prose' | null
    }
  }
}
