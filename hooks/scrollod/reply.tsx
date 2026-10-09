import type { ElementTable, RenderElement } from 'claude-code'

import type { Style } from '../../types'
import { NAMEPLATE } from './badge'

export type Reply = { text: string; isFirstOfReply: boolean; style: Style }

export function drawReply(elements: ElementTable, reply: Reply): RenderElement {
  const { Box, Markdown, Text } = elements
  if (reply.style !== 'game') {
    return (
      <Box key="reply-body" flexDirection="row" marginTop={reply.isFirstOfReply ? 1 : 0}>
        <Box key="reply-bar" width={1} flexShrink={0} backgroundColor="claude" />
        <Box flexGrow={1} flexShrink={1} paddingLeft={1}>
          <Markdown text={reply.text} />
        </Box>
      </Box>
    )
  }
  return (
    <Box key="dialogue" flexDirection="column" borderStyle="round" borderColor="claude" paddingX={1} marginTop={reply.isFirstOfReply ? 1 : 0}>
      {reply.isFirstOfReply ? (
        <Box key="nameplate" marginBottom={1}>
          <Text backgroundColor={NAMEPLATE.background} color={NAMEPLATE.color} bold>
            {` ${NAMEPLATE.label} `}
          </Text>
        </Box>
      ) : null}
      <Markdown text={reply.text} />
    </Box>
  )
}
