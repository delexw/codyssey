export type BlockKind = 'tool' | 'prose'

export const MAX_RUN_STARTS = 500

type Block = { type: string; id?: unknown }

export function markRunStarts(previous: BlockKind | null, blocks: readonly Block[]): { starts: string[]; last: BlockKind | null } {
  const starts: string[] = []
  let last = previous
  for (const block of blocks) {
    if (block.type === 'tool_use') {
      if (last === 'prose' && typeof block.id === 'string') starts.push(block.id)
      last = 'tool'
    } else if (block.type === 'text' || block.type === 'thinking' || block.type === 'redacted_thinking') {
      last = 'prose'
    }
  }
  return { starts, last }
}
