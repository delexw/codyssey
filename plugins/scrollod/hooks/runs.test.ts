import { expect, test } from 'claude-code/testing'

import { markRunStarts } from './runs'

test('a tool call right after thinking or text starts a run, and the calls after it do not', async () => {
  const marked = markRunStarts('tool', [
    { type: 'thinking' },
    { type: 'tool_use', id: 'a' },
    { type: 'tool_use', id: 'b' },
    { type: 'text' },
    { type: 'tool_use', id: 'c' },
  ])
  expect(marked).toEqual({ starts: ['a', 'c'], last: 'tool' })
  expect(markRunStarts('tool', [{ type: 'tool_use', id: 'd' }])).toEqual({ starts: [], last: 'tool' })
  expect(markRunStarts('prose', [{ type: 'tool_use', id: 'e' }]).starts).toEqual(['e'])
  expect(markRunStarts(null, [{ type: 'image' }])).toEqual({ starts: [], last: null })
})
