import type { Style } from '../types'

export const STYLES: readonly Style[] = ['plain', 'game']

export const DEFAULT_STYLE: Style = 'plain'

export function isStyle(value: unknown): value is Style {
  return (STYLES as readonly unknown[]).includes(value)
}
