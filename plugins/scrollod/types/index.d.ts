export type CallStatus = { isRunning: boolean; isErrored: boolean; isInterrupted: boolean }

export type Style = 'plain' | 'game'

export type ProgressLook = 'spin' | 'charge'

declare module 'claude-code' {
  interface PluginState {
    'scrollod': { isOn: boolean; style: 'plain' | 'game'; runStarts: string[]; lastBlock: 'tool' | 'prose' | null }
  }
}
