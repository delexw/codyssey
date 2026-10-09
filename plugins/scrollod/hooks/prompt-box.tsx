import type { ElementTable, RenderElement } from 'claude-code'

import { YOU_PLATE } from './badge'

export function drawPromptBox(elements: ElementTable, text: string): RenderElement {
  const { Box, Text } = elements
  return (
    <Box key="prompt-box" flexDirection="column" borderStyle="round" borderColor={YOU_PLATE.background} paddingX={1} marginTop={1}>
      <Box key="you-plate" marginBottom={1}>
        <Text backgroundColor={YOU_PLATE.background} color={YOU_PLATE.color} bold>
          {` ${YOU_PLATE.label} `}
        </Text>
      </Box>
      <Text>{text}</Text>
    </Box>
  )
}
