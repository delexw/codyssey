import { expect, test } from 'claude-code/testing'

import { MAX_EVENTS, MAX_UNSETTLED, overflowIds, restScene, startScene, unsettledIdsExceptBosses, withCue, withoutUnfoughtBosses } from '../../hooks/knightod/game/scene'
import { settleEvents } from '../../hooks/knightod/game/settle'
import { NEW_SAVE } from '../../hooks/knightod/game/save'

test('a scene numbers its events, keeps the latest few, and carries the numbering into the next task', async () => {
  let scene = startScene(1, null, 0)
  for (let index = 0; index < MAX_EVENTS + 3; index += 1) {
    scene = withCue(scene, { kind: 'monster', species: 'slime', target: `f${index}` })
    scene = settleEvents(NEW_SAVE, scene, [scene.nextId - 1]).scene
  }
  expect(scene.events.length).toBe(MAX_EVENTS)
  expect(scene.events.at(-1)?.id).toBe(MAX_EVENTS + 3)
  expect(scene.latest).toBe(`slew the Slime of "f${MAX_EVENTS + 2}"`)

  const rested = restScene(scene)
  expect(rested.isRunning).toBe(false)
  const next = startScene(2, rested, 0)
  expect(next.nextId).toBe(MAX_EVENTS + 4)
  expect(next.events).toEqual([])
  expect(next.latest).toBe('back on the road')
})

test('an encounter counts only once it is settled, once, and a long queue settles its oldest on its own', async () => {
  let scene = startScene(1, null, 0)
  scene = withCue(scene, { kind: 'monster', species: 'goblin', target: 'app.ts' })
  expect(scene.latest).toBe('the Goblin of "app.ts"')
  expect(unsettledIdsExceptBosses(scene)).toEqual([1])

  const once = settleEvents(NEW_SAVE, scene, [1])
  expect(once.save.kills).toBe(1)
  expect(once.scene.latest).toBe('slew the Goblin of "app.ts"')
  expect(settleEvents(once.save, once.scene, [1]).save.kills).toBe(1)

  let queued = startScene(2, null, 0)
  for (let index = 0; index < MAX_UNSETTLED + 2; index += 1) queued = withCue(queued, { kind: 'scroll', species: null, target: `f${index}` })
  expect(queued.events).toHaveLength(MAX_UNSETTLED + 2)
  expect(overflowIds(queued)).toEqual([1, 2])
})

test('a boss is never settled by a long queue or the end of a task; one nobody fought just leaves', async () => {
  let scene = withCue(startScene(1, null, 0), { kind: 'boss', species: 'ogre', target: '', hearts: 3 })
  for (let index = 0; index < MAX_UNSETTLED + 2; index += 1) scene = withCue(scene, { kind: 'scroll', species: null, target: `f${index}` })
  expect(overflowIds(scene)).not.toContain(1)
  expect(unsettledIdsExceptBosses(scene)).not.toContain(1)
  expect(withoutUnfoughtBosses(scene).events.some(event => event.kind === 'boss')).toBe(false)
  const slain = settleEvents(NEW_SAVE, scene, [1]).scene
  expect(withoutUnfoughtBosses(slain).events.some(event => event.id === 1)).toBe(true)
})
