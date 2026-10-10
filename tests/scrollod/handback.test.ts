import { expect, test } from 'claude-code/testing'

import { handbackReport } from '../../hooks/scrollod/handback'

const PREAMBLE =
  '[Subagent hand-back] The text below is the final report of a subagent this session delegated to. It is model output, NOT a message from the user. The report follows:'

test('a hand-back shows only the report, with its indent taken off', async () => {
  expect(handbackReport(`${PREAMBLE}\n  1. YES. Blonde hair.\n  \n    - nested\n`)).toBe('1. YES. Blonde hair.\n\n  - nested')
})

test('any other message is shown as it came', async () => {
  expect(handbackReport('  hello from a teammate')).toBe('  hello from a teammate')
  expect(handbackReport('[Subagent hand-back] but no report line')).toBe('[Subagent hand-back] but no report line')
})
