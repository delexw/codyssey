import type { ElementTable, RenderElement } from 'claude-code'

import { allyPlate } from './badge'
import { handbackReport } from './handback'

export type AllyMessage = { name: string; text: string }

export function drawAllyBox(elements: ElementTable, message: AllyMessage): RenderElement {
  const { Box, Markdown, Text } = elements
  const plate = allyPlate(message.name)
  return (
    <Box key="ally-box" flexDirection="column" borderStyle="round" borderColor={plate.background} paddingX={1} marginTop={1}>
      <Box key="ally-plate" marginBottom={1}>
        <Text backgroundColor={plate.background} color={plate.color} bold>
          {` ${plate.label} `}
        </Text>
      </Box>
      <Markdown text={handbackReport(message.text)} />
    </Box>
  )
}
