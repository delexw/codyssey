export type Badge = { label: string; background: string; color: string }

type BadgeRule = { tools: readonly string[]; badge: Badge }

const DARK_TEXT = '#000000'
const LIGHT_TEXT = '#FFFFFF'

const BADGES: readonly BadgeRule[] = [
  { tools: ['Read', 'Grep', 'Glob', 'LS', 'NotebookRead'], badge: { label: '☰ SCOUT', background: '#1E88E5', color: LIGHT_TEXT } },
  { tools: ['Edit', 'Write', 'MultiEdit', 'NotebookEdit'], badge: { label: '⚒ FORGE', background: '#F9A825', color: DARK_TEXT } },
  { tools: ['Bash'], badge: { label: '⚔ FIGHT', background: '#546E7A', color: LIGHT_TEXT } },
  { tools: ['WebFetch', 'WebSearch'], badge: { label: '☄ MAGIC', background: '#8E24AA', color: LIGHT_TEXT } },
  { tools: ['Agent', 'Task'], badge: { label: '♞ ALLY', background: '#43A047', color: LIGHT_TEXT } },
]
const MCP_BADGE: Badge = { label: '⚗ POTION', background: '#00ACC1', color: DARK_TEXT }
const OTHER_BADGE: Badge = { label: '✦ SKILL', background: '#8D6E63', color: LIGHT_TEXT }

export const NAMEPLATE: Badge = { label: '◆ CLAUDE', background: 'claude', color: DARK_TEXT }

export const QUEST_BADGE: Badge = { label: '⚑ QUEST', background: '#3949AB', color: LIGHT_TEXT }

export const YOU_PLATE: Badge = { label: '◆ YOU', background: '#42A5F5', color: DARK_TEXT }

export function toolBadge(tool: string): Badge {
  if (tool.startsWith('mcp__')) return MCP_BADGE
  return BADGES.find(rule => rule.tools.includes(tool))?.badge ?? OTHER_BADGE
}
