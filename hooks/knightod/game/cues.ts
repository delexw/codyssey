import type { EventKind, GameEvent, Species } from '../../../types'
import { heartCount } from './label'
import { hashText } from './random'

export type Cue = { kind: EventKind; species: Species | null; target: string; hearts?: number }

const READING_TOOLS = ['Read', 'Grep', 'Glob', 'LS', 'NotebookRead']
const EXPLORING_TOOLS = ['WebFetch', 'WebSearch']
const EDITING_TOOLS = ['Edit', 'Write', 'MultiEdit', 'NotebookEdit']
const DELEGATING_TOOLS = ['Agent', 'Task']
const EDIT_SPECIES: readonly Species[] = ['slime', 'goblin', 'skeleton', 'orc', 'spider']
const WEB_SPECIES: readonly Species[] = ['bat', 'ghost']
const SHELL_SPECIES: readonly Species[] = ['goblin', 'wolf']
const BUG_DRAGON_HEARTS = 4

const SHIPPING_COMMAND = /\bgit (commit|push|merge|tag)\b|\bgh pr (create|merge)\b/
const TEST_COMMAND = /\b(test|tests|spec|jest|vitest|pytest|rspec|mocha|check|lint|tsc)\b/

export function isTestCommand(command: string): boolean {
  return TEST_COMMAND.test(command)
}

function baseName(path: string): string {
  return path.split('/').filter(Boolean).at(-1) ?? path
}

function textField(input: Record<string, unknown>, ...names: string[]): string {
  for (const name of names) {
    const value = input[name]
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
  }
  return ''
}

function pickSpecies(species: readonly Species[], target: string): Species {
  return species[hashText(target) % species.length] ?? 'slime'
}

function hostOf(url: string): string {
  const match = /^[a-z]+:\/\/([^/]+)/i.exec(url)
  return match?.[1] ?? url
}

export function cueForTool(tool: string, input: Record<string, unknown>): Cue {
  if (READING_TOOLS.includes(tool)) {
    return { kind: 'scroll', species: null, target: baseName(textField(input, 'file_path', 'notebook_path', 'path', 'pattern')) || tool }
  }
  if (EXPLORING_TOOLS.includes(tool)) {
    const target = hostOf(textField(input, 'url', 'query')) || 'the web'
    return { kind: 'monster', species: pickSpecies(WEB_SPECIES, target), target }
  }
  if (EDITING_TOOLS.includes(tool)) {
    const target = baseName(textField(input, 'file_path', 'notebook_path')) || tool
    return { kind: 'monster', species: pickSpecies(EDIT_SPECIES, target), target }
  }
  if (DELEGATING_TOOLS.includes(tool)) {
    return { kind: 'monster', species: 'skeleton', target: textField(input, 'description') || 'the crypt' }
  }
  if (tool.startsWith('mcp__')) {
    return { kind: 'monster', species: 'slime', target: tool.split('__')[1] ?? tool }
  }
  return { kind: 'monster', species: 'slime', target: tool }
}

export function cueForCommand(command: string, hasFailed: boolean, wasFailing: boolean): Cue {
  const target = command.trim().split(/\s+/).slice(0, 2).join(' ') || 'the shell'
  if (hasFailed) return { kind: 'hurt', species: null, target }
  if (SHIPPING_COMMAND.test(command)) return { kind: 'chest', species: null, target }
  if (isTestCommand(command) && wasFailing) return { kind: 'boss', species: 'dragon', target, hearts: BUG_DRAGON_HEARTS }
  return { kind: 'monster', species: pickSpecies(SHELL_SPECIES, target), target }
}

const SPECIES_NAMES: Record<Species, string> = {
  slime: 'Slime',
  goblin: 'Goblin',
  bat: 'Bat',
  skeleton: 'Skeleton',
  wolf: 'Wolf',
  spider: 'Spider',
  ghost: 'Ghost',
  orc: 'Orc',
  'king-slime': 'King Slime',
  ogre: 'Ogre',
  lich: 'Lich',
  demon: 'Demon',
  'shadow-king': 'Shadow King',
  dragon: 'Bug Dragon',
}

export function cueName(cue: Cue): string {
  switch (cue.kind) {
    case 'monster':
      return `the ${SPECIES_NAMES[cue.species ?? 'slime']} of "${cue.target}"`
    case 'boss':
      return `the ${SPECIES_NAMES[cue.species ?? 'dragon']} ${heartCount(cue.hearts ?? 1)}`
    case 'chest':
      return 'a treasure chest'
    case 'scroll':
      return `a scroll of "${cue.target}"`
    case 'hurt':
      return `hit by "${cue.target}"`
  }
}

export function settledName(event: GameEvent): string {
  switch (event.kind) {
    case 'monster':
    case 'boss':
      return `slew ${event.name}`
    case 'chest':
      return `opened ${event.name}`
    case 'scroll':
      return `picked up ${event.name}`
    case 'hurt':
      return event.name
  }
}
