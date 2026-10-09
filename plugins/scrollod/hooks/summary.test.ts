import { expect, test } from 'claude-code/testing'

import { inputSummary } from './summary'

test('the summary picks the field that says what the call did, first line only', async () => {
  expect(inputSummary({ command: 'git status\ngit log', description: 'Show status' })).toBe('git status')
  expect(inputSummary({ file_path: '/Users/me/code/app/src/lib/a.ts' })).toBe('…/src/lib/a.ts')
  expect(inputSummary({ file_path: 'src/a.ts' })).toBe('src/a.ts')
  expect(inputSummary({ pattern: 'TODO', path: '/repo' })).toBe('TODO')
  expect(inputSummary({ other: '  ', name: 'thing' })).toBe('thing')
  expect(inputSummary({ count: 3 })).toBe('')
  expect(inputSummary(null)).toBe('')
})
