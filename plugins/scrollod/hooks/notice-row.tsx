import type { ElementTable, RenderElement } from 'claude-code'

import { QUEST_BADGE } from './badge'
import { durationText, noticeMark } from './notice'

export type NoticeRow = { text: string; status: string | undefined; durationMs: number | undefined }

export function drawNoticeRow(elements: ElementTable, row: NoticeRow): RenderElement {
  const { Box, Text } = elements
  const { mark, color } = noticeMark(row.status)
  const duration = durationText(row.durationMs)
  return (
    <Box key="notice-row" paddingLeft={2} marginTop={1} width="100%" overflow="hidden">
      <Box flexShrink={0}>
        <Text color={color}>{mark} </Text>
      </Box>
      <Box flexShrink={0} marginRight={1}>
        <Text backgroundColor={QUEST_BADGE.background} color={QUEST_BADGE.color} bold>
          {` ${QUEST_BADGE.label} `}
        </Text>
      </Box>
      <Box flexShrink={1} minWidth={0}>
        <Text dimColor wrap="truncate-end">
          {row.text.split('\n')[0]}
        </Text>
      </Box>
      {duration === '' ? null : (
        <Box flexShrink={0}>
          <Text dimColor>{` · ${duration}`}</Text>
        </Box>
      )}
    </Box>
  )
}
