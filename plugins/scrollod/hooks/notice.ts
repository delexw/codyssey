export type NoticeMark = { mark: string; color: string }

export function noticeMark(status: string | undefined): NoticeMark {
  if (status === 'completed') return { mark: '✓', color: 'success' }
  if (status === 'failed') return { mark: '✗', color: 'error' }
  if (status === 'killed') return { mark: '■', color: 'warning' }
  return { mark: '•', color: 'inactive' }
}

export function durationText(ms: number | undefined): string {
  if (ms === undefined) return ''
  const seconds = Math.round(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`
}
