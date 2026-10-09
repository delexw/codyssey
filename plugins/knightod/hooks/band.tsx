import type { ElementTable, RenderElement } from 'claude-code'

import type { Save, Scene } from '../types'
import { statusLine } from './game/label'
import { STRIP_PIXEL_ROWS } from './world/world'

export const STRIP_MAX_COLUMNS = 64
export const STRIP_MIN_COLUMNS = 16
export const STRIP_KEY = 'knightod-strip'

export function drawBand(elements: ElementTable, save: Save, scene: Scene, columns: number, below: RenderElement): RenderElement {
  const { Box, Text } = elements
  const stripColumns = Math.min(STRIP_MAX_COLUMNS, columns)
  const strip =
    'Client' in elements && stripColumns >= STRIP_MIN_COLUMNS ? (
      <elements.Client key={STRIP_KEY} module="./strip.tsx" props={{ scene }} width={stripColumns} height={STRIP_PIXEL_ROWS / 2} />
    ) : null

  return (
    <Box flexDirection="column">
      <Text color={scene.isRunning ? '#FFC107' : 'subtle'} wrap="truncate-end">
        {statusLine(save, scene)}
      </Text>
      {strip}
      {below}
    </Box>
  )
}
