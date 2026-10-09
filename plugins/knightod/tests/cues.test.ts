import { expect, test } from 'claude-code/testing'

import { cueForCommand, cueForTool, cueName } from '../hooks/game/cues'

test('each kind of tool brings its own encounter, named after what it touches', async () => {
  expect(cueForTool('Read', { file_path: '/repo/hooks/register.tsx' })).toEqual({ kind: 'scroll', species: null, target: 'register.tsx' })
  expect(cueForTool('WebFetch', { url: 'https://example.com/docs' })).toMatchObject({ kind: 'monster', target: 'example.com' })
  expect(cueForTool('Agent', { description: 'Find callers' })).toEqual({ kind: 'monster', species: 'skeleton', target: 'Find callers' })
  expect(cueForTool('mcp__buildkite__list_builds', {})).toEqual({ kind: 'monster', species: 'slime', target: 'buildkite' })

  const edit = cueForTool('Edit', { file_path: '/repo/src/app.ts' })
  expect(edit.kind).toBe('monster')
  expect(edit.target).toBe('app.ts')
  expect(cueForTool('Edit', { file_path: '/other/app.ts' }).species).toBe(edit.species)
})

test('a failed command hurts, shipping finds a chest, and passing tests after a failure bring the Bug Dragon', async () => {
  expect(cueForCommand('bun run test', true, false).kind).toBe('hurt')
  expect(cueForCommand('git commit -m x', false, false).kind).toBe('chest')
  expect(cueForCommand('bun run test', false, true)).toMatchObject({ kind: 'boss', species: 'dragon', hearts: 3 })
  expect(cueForCommand('bun run test', false, false)).toMatchObject({ kind: 'monster', target: 'bun run' })
})

test('every encounter has a name for the status line', async () => {
  expect(cueName({ kind: 'monster', species: 'goblin', target: 'app.ts' })).toBe('the Goblin of "app.ts"')
  expect(cueName({ kind: 'boss', species: 'dragon', target: 'bun run', hearts: 3 })).toBe('the Bug Dragon ♥♥♥')
  expect(cueName({ kind: 'scroll', species: null, target: 'README.md' })).toBe('a scroll of "README.md"')
})
