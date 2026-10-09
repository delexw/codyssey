import type { Register } from 'claude-code'

import { registerKnightod } from './knightod/register'
import { registerMiod } from './miod/register'
import { registerScrollod } from './scrollod/register'

export const register: Register = (on, options) => {
  registerMiod(on, options)
  registerKnightod(on, options)
  registerScrollod(on, options)
}
