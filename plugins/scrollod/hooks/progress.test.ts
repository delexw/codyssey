import { expect, test } from 'claude-code/testing'

import { chargeText, PROGRESS_COLUMNS, spinnerText } from './progress'

test('the spinner turns a frame every tick and counts whole seconds', async () => {
  expect(spinnerText(0)).toBe('⠋ 0s')
  expect(spinnerText(1)).toBe('⠙ 0s')
  expect(spinnerText(10)).toBe('⠋ 1s')
  expect(spinnerText(125)).toBe('⠴ 12s')
})

test('the charging bar fills a cell every other tick, starts over when full, and fits its columns', async () => {
  expect(chargeText(0)).toBe('▱▱▱▱▱ 0s')
  expect(chargeText(2)).toBe('▰▱▱▱▱ 0s')
  expect(chargeText(10)).toBe('▰▰▰▰▰ 1s')
  expect(chargeText(12)).toBe('▱▱▱▱▱ 1s')
  expect(chargeText(125).length).toBeLessThanOrEqual(PROGRESS_COLUMNS.charge)
  expect(spinnerText(125).length).toBeLessThanOrEqual(PROGRESS_COLUMNS.spin)
})
