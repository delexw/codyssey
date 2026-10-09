import type { ClientModule } from 'claude-code'

import type { StripProps } from '../types'
import { canvasRuns } from './sprites/pixel'
import { drawWorld } from './world/draw'
import { stepWorld } from './world/step'
import type { World } from './world/world'
import { isSameScene, startWorld } from './world/world'

const TICK_MS = 150

const Strip: ClientModule<StripProps, World> = ({ scene }, surface) => {
  const { Box, Text } = surface.elements

  if (surface.state === undefined) {
    surface.setState(startWorld(scene))
    surface.every(TICK_MS, () => {
      const world = surface.state
      if (!world) return
      const next = stepWorld(world, surface.columns)
      surface.setState(next)
      const isNewlyWounded = JSON.stringify(next.wounds) !== JSON.stringify(world.wounds)
      if (next.settled.at(-1) !== world.settled.at(-1) || isNewlyWounded) surface.post({ settled: next.settled, wounds: next.wounds })
    })
  } else if (!isSameScene(surface.state.scene, scene)) {
    surface.setState({ ...surface.state, scene })
  }

  const world = surface.state ?? startWorld(scene)
  const rows = canvasRuns(drawWorld(world, surface.columns))

  return (
    <Box flexDirection="column">
      {rows.map(runs => (
        <Box>
          {runs.map(run => (
            <Text color={run.color} backgroundColor={run.backgroundColor}>
              {run.text}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default Strip
