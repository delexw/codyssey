import type { ClientModule } from 'claude-code'

import type { ProgressLook } from '../../types'
import { progressText, SPINNER_TICK_MS } from './progress'

const Spinner: ClientModule<{ color: string; look: ProgressLook }, number> = ({ color, look }, surface) => {
  const { Text } = surface.elements
  if (surface.state === undefined) {
    surface.setState(0)
    surface.every(SPINNER_TICK_MS, () => surface.setState((surface.state ?? 0) + 1))
  }
  return <Text color={color}>{progressText(look, surface.state ?? 0)}</Text>
}

export default Spinner
