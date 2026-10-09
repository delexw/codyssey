import { expect, test } from 'claude-code/testing'

import type { Scene } from '../../types'
import { KNIGHT_WIDTH } from '../../hooks/knightod/sprites/knight'
import { counterHits, fightPlan } from '../../hooks/knightod/game/fight'
import { drawWorld } from '../../hooks/knightod/world/draw'
import { HEART_COLOR, HEART_ROWS, heartMarks } from '../../hooks/knightod/world/draw/hearts'
import { canvasRuns } from '../../hooks/knightod/sprites/pixel'
import { WEAPONS } from '../../hooks/knightod/game/weapons'
import { stepWorld } from '../../hooks/knightod/world/step'
import type { World } from '../../hooks/knightod/world/world'
import { GROUND_ROW, KNIGHT_X, STRIP_PIXEL_ROWS, startWorld } from '../../hooks/knightod/world/world'

const WIDTH = 30

function scene(overrides: Partial<Scene> = {}): Scene {
  return { isRunning: true, seed: 7, speed: 1, events: [], nextId: 1, latest: 'sets out', startedAt: 0, ...overrides }
}

function run(world: World, ticks: number): World {
  let next = world
  for (let index = 0; index < ticks; index += 1) next = stepWorld(next, WIDTH)
  return next
}

test('the knight walks while the task runs and stops to rest when it ends', async () => {
  const walking = run(startWorld(scene()), 5)
  expect(walking.scroll).toBe(5)
  const resting = run({ ...walking, scene: scene({ isRunning: false }) }, 5)
  expect(resting.scroll).toBe(5)
})

test('a monster comes in from the right, the knight stops and slashes it, then walks on', async () => {
  const start = startWorld(scene())
  const withMonster = { ...start, scene: scene({ events: [{ id: 1, kind: 'monster', species: 'goblin', name: 'the Goblin of x', isSettled: false }], nextId: 2 }) }
  let world = stepWorld(withMonster, WIDTH)
  expect(world.foes).toHaveLength(1)
  expect(world.foes[0]?.x).toBe(WIDTH - 1)

  let sawSlash = false
  let ticks = 0
  while (world.foes.length > 0 && ticks < 100) {
    const before = world
    world = stepWorld(world, WIDTH)
    if (world.action === 'slash') {
      sawSlash = true
      expect(world.foes[0]?.x).toBe(KNIGHT_X + KNIGHT_WIDTH + 1)
    }
    if (before.action !== 'slash' && world.action === 'slash') expect(world.settled).toEqual([1])
    if (world.action !== 'slash' && world.foes[0]?.phase === 'coming') expect(world.settled).toEqual([])
    ticks += 1
  }
  expect(sawSlash).toBe(true)
  expect(world.settled).toEqual([1])
  expect(world.foes).toHaveLength(0)
  const scrolled = world.scroll
  expect(stepWorld(world, WIDTH).scroll).toBe(scrolled + 1)
})

test('a hit flashes the knight without bringing anything onto the strip, and settled events are not replayed', async () => {
  const replayed = startWorld(scene({ events: [{ id: 3, kind: 'monster', species: 'slime', name: 'old', isSettled: true }], nextId: 4 }))
  expect(stepWorld(replayed, WIDTH).foes).toHaveLength(0)
  const waiting = startWorld(scene({ events: [{ id: 3, kind: 'monster', species: 'slime', name: 'waiting', isSettled: false }], nextId: 4 }))
  expect(stepWorld(waiting, WIDTH).foes.map(foe => foe.id)).toEqual([3])

  const hurt = stepWorld({ ...replayed, scene: scene({ events: [{ id: 4, kind: 'hurt', species: null, name: 'hit', isSettled: false }], nextId: 5 }) }, WIDTH)
  expect(hurt.action).toBe('hurt')
  expect(hurt.foes).toHaveLength(0)
  expect(hurt.settled).toEqual([4])
})

test('the drawing fills the strip with ground, the knight and a campfire when resting', async () => {
  const resting = startWorld(scene({ isRunning: false }))
  const canvas = drawWorld(resting, WIDTH)
  expect(canvas).toHaveLength(STRIP_PIXEL_ROWS)
  expect(canvas[STRIP_PIXEL_ROWS - 1]?.every(color => color !== null)).toBe(true)
  expect(canvas[GROUND_ROW - 1]?.slice(KNIGHT_X, KNIGHT_X + 3)).toContain('#546E7A')
  expect(canvas.flat()).toContain('#FFEB3B')
})

test('a boss takes one slash per heart and is only slain on the last one', async () => {
  const start = startWorld(scene())
  const withBoss = { ...start, scene: scene({ events: [{ id: 1, kind: 'boss', species: 'ogre', name: 'the Ogre ♥♥♥', hearts: 3, isSettled: false }], nextId: 2 }) }
  let world = stepWorld(withBoss, WIDTH)
  expect(world.foes[0]).toMatchObject({ hp: 3, maxHp: 3 })

  const hearts: number[] = []
  let ticks = 0
  while (world.foes.length > 0 && ticks < 200) {
    const before = world.foes[0]?.hp
    world = stepWorld(world, WIDTH)
    const after = world.foes[0]?.hp
    if (after !== undefined && after !== before) {
      hearts.push(after)
      if (after > 0) expect(world.settled).not.toContain(1)
    }
    ticks += 1
  }
  const expected: number[] = []
  let left = 3
  for (const strike of fightPlan(7, 1, 3)) expected.push((left -= strike.damage))
  expect(hearts).toEqual(expected)
  expect(hearts.at(-1)).toBe(0)
  expect(world.settled).toContain(1)
})

function heartColumns(world: World, from: number, to: number): string[] {
  return heartMarks(world, WIDTH).map(row => row.slice(from, to).map(mark => mark?.text ?? ' ').join(''))
}

test('a monster shows its hearts side by side in one row beside its body, full for those left and hollow for those lost', async () => {
  const world = { ...startWorld(scene()), foes: [{ id: 1, kind: 'boss', species: 'lich', x: 20, phase: 'coming', ticks: 0, hp: 3, maxHp: 4, strikes: 1 }] } as World
  expect(HEART_ROWS).toBe(2)
  expect(heartColumns(world, 24, 30)).toEqual(['      ', ' ♥♥♥♡ '])
  expect(heartMarks(world, WIDTH)[1]?.[25]?.color).toBe(HEART_COLOR)
})

test('a boss with more than four hearts starts a second row above, and a big one widens the rows so every heart shows', async () => {
  const start = startWorld(scene())
  const ogre = { ...start, foes: [{ id: 1, kind: 'boss', species: 'ogre', x: 10, phase: 'coming', ticks: 0, hp: 6, maxHp: 6, strikes: 0 }] } as World
  expect(heartColumns(ogre, 16, 21)).toEqual(['♥♥   ', '♥♥♥♥ '])
  const king = { ...start, foes: [{ id: 1, kind: 'boss', species: 'shadow-king', x: 5, phase: 'coming', ticks: 0, hp: 10, maxHp: 10, strikes: 0 }] } as World
  expect(heartColumns(king, 12, 18).join('').replaceAll(' ', '')).toHaveLength(10)
})

test('every monster shows its hearts on its right, even a one-heart slime, and scrolls and chests show none', async () => {
  const start = startWorld(scene())
  expect(heartColumns({ ...start, foes: [{ id: 1, kind: 'monster', species: 'slime', x: 20, phase: 'coming', ticks: 0, hp: 1, maxHp: 1, strikes: 0 }] }, 24, 27)).toEqual(['   ', ' ♥ '])
  expect(heartColumns({ ...start, foes: [{ id: 1, kind: 'chest', species: null, x: 20, phase: 'coming', ticks: 0, hp: 1, maxHp: 1, strikes: 0 }] }, 0, WIDTH).join('').trim()).toBe('')
})

test('a heart takes its whole cell on the strip, in place of the pixels under it', async () => {
  const canvas = [['#111111', null], ['#222222', null]]
  const rows = canvasRuns(canvas, [[{ text: '♥', color: HEART_COLOR }, null]])
  expect(rows[0]?.[0]).toEqual({ text: '♥', color: HEART_COLOR })
})

test('a thrown weapon leaves the knight early, flies, and lands on a monster that is still far away', async () => {
  let id = 1
  while (fightPlan(7, id, 1)[0]?.weapon !== 'fireball') id += 1
  let world = stepWorld({ ...startWorld(scene()), scene: scene({ events: [{ id, kind: 'monster', species: 'orc', name: 'the Orc', hearts: 1, isSettled: false }], nextId: id + 1 }) }, WIDTH)
  let thrownAt: number | null = null
  let landedAt: number | null = null
  for (let ticks = 0; ticks < 80 && landedAt === null; ticks += 1) {
    const before = world
    world = stepWorld(world, WIDTH)
    if (thrownAt === null && world.shot !== null) {
      thrownAt = world.foes[0]?.x ?? 0
      expect(world.action).toBe('throw')
      expect(world.shot.weapon).toBe('fireball')
    }
    if (before.shot !== null && world.shot === null) landedAt = before.foes[0]?.x ?? 0
  }
  expect(thrownAt).toBeGreaterThan(KNIGHT_X + KNIGHT_WIDTH + 1 + WEAPONS.lance.range)
  expect(landedAt).toBeGreaterThan(KNIGHT_X + KNIGHT_WIDTH + 1)
  expect(world.settled).toEqual([id])
})

test('when the task ends with a monster still on the road, the knight finishes it before making camp', async () => {
  let world = stepWorld({ ...startWorld(scene()), scene: scene({ events: [{ id: 1, kind: 'monster', species: 'slime', name: 'the Slime', isSettled: false }], nextId: 2 }) }, WIDTH)
  world = { ...world, scene: scene({ isRunning: false, events: [{ id: 1, kind: 'monster', species: 'slime', name: 'the Slime', isSettled: true }], nextId: 2 }) }
  const startX = world.foes[0]?.x ?? 0
  world = stepWorld(world, WIDTH)
  expect(world.foes[0]?.x).toBeLessThan(startX)
  let ticks = 0
  while (world.foes.length > 0 && ticks < 200) {
    world = stepWorld(world, WIDTH)
    ticks += 1
  }
  expect(world.foes).toHaveLength(0)
  expect(ticks).toBeLessThan(200)
})

test('a boss nobody reached runs off the road when the task ends', async () => {
  let world = stepWorld({ ...startWorld(scene()), scene: scene({ events: [{ id: 1, kind: 'boss', species: 'ogre', name: 'the Ogre', hearts: 4, isSettled: false }], nextId: 2 }) }, WIDTH)
  expect(world.foes).toHaveLength(1)
  world = stepWorld({ ...world, scene: scene({ isRunning: false, events: [], nextId: 2 }) }, WIDTH)
  expect(world.foes).toHaveLength(0)
})

test('the knight flashes hurt when a boss strikes back during the fight', async () => {
  let id = 1
  while (counterHits(7, id, 3) === 0) id += 1
  const start = startWorld(scene())
  let world = stepWorld({ ...start, scene: scene({ events: [{ id, kind: 'boss', species: 'ogre', name: 'the Ogre ♥♥♥', hearts: 3, isSettled: false }], nextId: id + 1 }) }, WIDTH)
  let sawHurt = false
  for (let ticks = 0; ticks < 200 && world.foes.length > 0; ticks += 1) {
    world = stepWorld(world, WIDTH)
    if (world.action === 'hurt') sawHurt = true
  }
  expect(sawHurt).toBe(true)
})

test('a special attack shows the glowing sword and takes two hearts at once', async () => {
  let id = 1
  while (fightPlan(7, id, 4)[0]?.isSpecial !== true) id += 1
  const start = startWorld(scene())
  let world = stepWorld({ ...start, scene: scene({ events: [{ id, kind: 'boss', species: 'lich', name: 'the Lich ♥♥♥♥', hearts: 4, isSettled: false }], nextId: id + 1 }) }, WIDTH)
  for (let ticks = 0; ticks < 100 && world.foes[0]?.strikes === 0; ticks += 1) world = stepWorld(world, WIDTH)
  expect(world.action).toBe('special')
  expect(world.foes[0]?.hp).toBe(2)
})
