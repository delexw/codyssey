import { expect, test } from 'claude-code/testing'

import { NAMEPLATE, toolBadge } from '../../hooks/scrollod/badge'

test('each kind of tool gets its own coloured action badge', async () => {
  expect(toolBadge('Read').label).toBe('☰ SCOUT')
  expect(toolBadge('Edit').label).toBe('⚒ FORGE')
  expect(toolBadge('Bash')).toEqual({ label: '⚔ FIGHT', background: '#546E7A', color: '#FFFFFF' })
  expect(toolBadge('WebFetch').label).toBe('☄ MAGIC')
  expect(toolBadge('Agent').label).toBe('♞ ALLY')
  expect(toolBadge('mcp__buildkite__list_builds').label).toBe('⚗ POTION')
  expect(toolBadge('Something').label).toBe('✦ SKILL')
})

test('badges hold no emoji, which terminals draw wider than Claude Code counts', async () => {
  for (const tool of ['Read', 'Edit', 'Bash', 'WebFetch', 'Agent', 'mcp__x__y', 'Something']) {
    expect(toolBadge(tool).label).not.toMatch(/\p{Emoji_Presentation}|\uFE0F/u)
  }
  expect(NAMEPLATE.label).not.toMatch(/\p{Emoji_Presentation}|\uFE0F/u)
})
