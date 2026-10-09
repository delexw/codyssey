import { expect, test } from 'claude-code/testing'

import { durationText, noticeMark } from './notice'

test('a finished task is marked as done, failed, stopped, or just noted', async () => {
  expect(noticeMark('completed')).toEqual({ mark: '✓', color: 'success' })
  expect(noticeMark('failed')).toEqual({ mark: '✗', color: 'error' })
  expect(noticeMark('killed')).toEqual({ mark: '■', color: 'warning' })
  expect(noticeMark(undefined).mark).toBe('•')
})

test('a run time reads in minutes and seconds', async () => {
  expect(durationText(undefined)).toBe('')
  expect(durationText(4_400)).toBe('4s')
  expect(durationText(122_000)).toBe('2m 2s')
})
