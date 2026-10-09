import { expect, test } from 'claude-code/testing'

import { blankCanvas, canvasRuns, spriteWidth, stamp } from '../hooks/sprites/pixel'

test('two pixel rows become one row of half blocks, merging cells that look the same', async () => {
  const canvas = blankCanvas(4, 2)
  stamp(canvas, { palette: { a: '#111111', b: '#222222' }, rows: ['aa.b', 'a..b'] }, 0, 1)
  expect(canvasRuns(canvas)).toEqual([
    [
      { text: '▀', color: '#111111', backgroundColor: '#111111' },
      { text: '▀', color: '#111111' },
      { text: ' ' },
      { text: '▀', color: '#222222', backgroundColor: '#222222' },
    ],
  ])
})

test('a sprite is drawn from its bottom row up, clipped at the edges, and a tint recolours it', async () => {
  const canvas = blankCanvas(3, 3)
  stamp(canvas, { palette: { a: '#111111' }, rows: ['a', 'a'] }, 2, 1, '#FF0000')
  stamp(canvas, { palette: { a: '#111111' }, rows: ['aa'] }, -1, 2)
  expect(canvas).toEqual([
    [null, null, '#FF0000'],
    [null, null, '#FF0000'],
    ['#111111', null, null],
  ])
  expect(spriteWidth({ palette: {}, rows: ['ab', 'abc'] })).toBe(3)
})
