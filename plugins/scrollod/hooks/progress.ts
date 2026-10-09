import type { ProgressLook } from '../types'

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const CHARGE_CELLS = 5

export const SPINNER_TICK_MS = 100

export const PROGRESS_COLUMNS: Record<ProgressLook, number> = { spin: 6, charge: 9 }

function seconds(ticks: number): number {
  return Math.floor((ticks * SPINNER_TICK_MS) / 1000)
}

export function spinnerText(ticks: number): string {
  return `${FRAMES[ticks % FRAMES.length] ?? FRAMES[0]} ${seconds(ticks)}s`
}

export function chargeText(ticks: number): string {
  const filled = Math.floor(ticks / 2) % (CHARGE_CELLS + 1)
  return `${'▰'.repeat(filled)}${'▱'.repeat(CHARGE_CELLS - filled)} ${seconds(ticks)}s`
}

export function progressText(look: ProgressLook, ticks: number): string {
  return look === 'charge' ? chargeText(ticks) : spinnerText(ticks)
}
