import { expect, test } from 'claude-code/testing'

import { isSessionCall } from '../../hooks/shared/origin'

test('only a call the engine raised for the session counts, not one a plugin made on its own', async () => {
  expect(isSessionCall({ plugin: 'engine', tier: 'core' })).toBe(true)
  expect(isSessionCall({ plugin: 'cockpit', tier: 'append' })).toBe(false)
  expect(isSessionCall({ plugin: 'client', tier: 'append' })).toBe(false)
})
