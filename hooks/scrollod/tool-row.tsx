import type { ElementTable, RenderElement } from 'claude-code'

import type { CallStatus, Style } from '../../types'
import { toolBadge } from './badge'
import { statusMark } from './mark'
import { gameOutcome } from './outcome'
import { PROGRESS_COLUMNS } from './progress'
import { inputSummary } from './summary'

const ROW_INDENT = 2

export type ToolRow = CallStatus & { id: string; tool: string; input: unknown; style: Style; startsRun: boolean }

export function drawToolRow(elements: ElementTable, row: ToolRow): RenderElement {
  const { Box, Text } = elements
  const isGame = row.style === 'game'
  const look = isGame ? 'charge' : 'spin'
  const plainMark = statusMark(row)
  const outcome = gameOutcome(row)
  const badge = toolBadge(row.tool)
  const isSpinning = row.isRunning && 'Client' in elements
  const note = isGame && !row.isRunning ? outcome.note : ''
  const summary = inputSummary(row.input)
  return (
    <Box key={`row-${row.id}`} paddingLeft={ROW_INDENT} marginTop={row.startsRun ? 1 : 0} width="100%" overflow="hidden">
      {isSpinning ? (
        <Box width={PROGRESS_COLUMNS[look] + 1} flexShrink={0}>
          <elements.Client key={`spin-${row.id}`} module="./spinner.tsx" props={{ color: plainMark.color, look }} width={PROGRESS_COLUMNS[look]} height={1} />
        </Box>
      ) : (
        <Box flexShrink={0}>
          <Text color={isGame ? outcome.color : plainMark.color}>{isGame ? outcome.mark : plainMark.glyph} </Text>
        </Box>
      )}
      {isGame ? (
        <Box flexShrink={0} marginRight={1}>
          <Text backgroundColor={badge.background} color={badge.color} bold>
            {` ${badge.label} `}
          </Text>
        </Box>
      ) : null}
      <Box flexShrink={0}>
        <Text dimColor bold>
          {row.tool}
        </Text>
      </Box>
      <Box flexShrink={1} minWidth={0}>
        <Text dimColor wrap="truncate-end">
          {summary === '' ? '' : isGame ? ` · ${summary}` : ` ${summary}`}
        </Text>
      </Box>
      {note === '' ? null : (
        <Box flexShrink={0}>
          <Text color={outcome.color}>{note}</Text>
        </Box>
      )}
    </Box>
  )
}
