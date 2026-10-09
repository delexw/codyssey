import { expect, test } from 'claude-code/testing'

import { BOSS_TIERS, dueBoss, playedMs, withBoss } from '../../hooks/knightod/game/bosses'
import { counterHits } from '../../hooks/knightod/game/fight'
import { finishQuest, NEW_SAVE } from '../../hooks/knightod/game/save'
import { restScene, startScene } from '../../hooks/knightod/game/scene'
import { settleEvents, woundEvents } from '../../hooks/knightod/game/settle'

const MINUTE_MS = 60_000

test('five bosses come in order every two minutes of play, each once the last is slain, with one more heart each', async () => {
  expect(BOSS_TIERS.map(tier => tier.hearts)).toEqual([3, 4, 5, 6, 7])
  let save = { ...NEW_SAVE, level: 50 }
  let scene = startScene(1, null, 0)
  expect(dueBoss(save, scene, MINUTE_MS)).toBeNull()

  const met: string[] = []
  for (let minute = 1; minute <= 12; minute += 1) {
    const tier = dueBoss(save, scene, minute * MINUTE_MS)
    if (tier === null) continue
    met.push(`${minute}:${tier.species}`)
    scene = withBoss(scene, tier)
    expect(dueBoss(save, scene, minute * MINUTE_MS)).toBeNull()
    ;({ save, scene } = settleEvents(save, scene, [scene.nextId - 1]))
  }
  expect(met).toEqual(['2:king-slime', '4:ogre', '6:lich', '8:demon', '10:shadow-king'])
  expect(save.bossesSlain).toBe(5)
  expect(scene.events.map(event => event.name)).toEqual([
    'the King Slime ♥♥♥',
    'the Ogre ♥♥♥♥',
    'the Lich ♥♥♥♥♥',
    'the Demon ♥6',
    'the Shadow King ♥7',
  ])
  expect(dueBoss(save, scene, 60 * MINUTE_MS)).toBeNull()
})

test('play time carries over from one task to the next, so short tasks still reach the bosses', async () => {
  const first = startScene(1, null, 0)
  const afterFirst = finishQuest(NEW_SAVE, 90_000)
  expect(dueBoss(afterFirst, restScene(first), 10 * MINUTE_MS)).toBeNull()

  const second = startScene(2, restScene(first), 5 * MINUTE_MS)
  expect(playedMs(afterFirst, second, 5 * MINUTE_MS + 20_000)).toBe(110_000)
  expect(dueBoss(afterFirst, second, 5 * MINUTE_MS + 20_000)).toBeNull()
  expect(dueBoss(afterFirst, second, 5 * MINUTE_MS + 30_000)?.species).toBe('king-slime')
})

test('each boss hit costs a heart as it lands, and slaying the boss does not charge them again', async () => {
  let id = 1
  while (counterHits(1, id, 6) < 2) id += 1
  const hits = counterHits(1, id, 6)
  const veteran = { ...NEW_SAVE, level: 50, hp: 5, maxHp: 5 }
  const scene = withBoss({ ...startScene(1, null, 0), nextId: id }, { species: 'shadow-king', hearts: 6, atMs: 0 })
  const first = woundEvents(veteran, scene, { [String(id)]: 1 })
  expect(first.save.hp).toBe(4)
  expect(woundEvents(first.save, first.scene, { [String(id)]: 1 }).save.hp).toBe(4)
  const all = woundEvents(first.save, first.scene, { [String(id)]: 99 })
  expect(all.save.hp).toBe(5 - hits)
  expect(settleEvents(all.save, all.scene, [id]).save.hp).toBe(5 - hits)
})
