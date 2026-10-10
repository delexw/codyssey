const PREAMBLE_START = '[Subagent hand-back]'
const PREAMBLE_END = 'The report follows:'
const REPORT_INDENT = '  '

export function handbackReport(text: string): string {
  if (!text.startsWith(PREAMBLE_START)) return text
  const end = text.indexOf(PREAMBLE_END)
  if (end === -1) return text
  return text
    .slice(end + PREAMBLE_END.length)
    .replace(/^\n/, '')
    .split('\n')
    .map(line => (line.startsWith(REPORT_INDENT) ? line.slice(REPORT_INDENT.length) : line))
    .join('\n')
    .trimEnd()
}
