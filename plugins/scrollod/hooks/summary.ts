const INPUT_FIELDS = ['command', 'file_path', 'notebook_path', 'pattern', 'url', 'query', 'description', 'prompt', 'skill'] as const

function firstLine(text: string): string {
  return text.split('\n').find(line => line.trim() !== '')?.trim() ?? ''
}

function shortPath(path: string): string {
  const parts = path.split('/').filter(Boolean)
  return parts.length <= 3 ? path : `…/${parts.slice(-3).join('/')}`
}

export function inputSummary(input: unknown): string {
  if (typeof input !== 'object' || input === null) return ''
  const fields = input as Record<string, unknown>
  for (const field of INPUT_FIELDS) {
    const value = fields[field]
    if (typeof value !== 'string' || value.trim() === '') continue
    return field === 'file_path' || field === 'notebook_path' ? shortPath(value) : firstLine(value)
  }
  const anyText = Object.values(fields).find((value): value is string => typeof value === 'string' && value.trim() !== '')
  return anyText === undefined ? '' : firstLine(anyText)
}
