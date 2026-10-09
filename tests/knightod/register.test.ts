import { expect, mock, test } from 'claude-code/testing'
import type { EventCalls, On } from 'claude-code'

function standInForEngine(on: On, store: Record<string, unknown> | null = {}) {
  if (store !== null) mock.store(on, store)
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
  on('turn.start', ($, e) => ({ turnId: e.turnId }))
  on('turn.complete', ($, e) => ({ text: e.answer }))
  on('tool.call', () => ({ result: {}, text: 'ok' }))
}

function complete(turnId: string) {
  return { turnId, reason: 'answer', answer: 'done', durationMs: 1_000, isAborted: false } as Parameters<EventCalls['turn']['complete']>[0]
}

type Stats = { text: string }

async function stats(run: (input: never) => Promise<Stats>): Promise<string> {
  return (await run({ command: 'knightod', args: '' } as never)).text
}

test('a task sends the knight out, each tool call is an encounter that counts once it is settled, and the game is saved and resumed in the next task', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  standInForEngine(on)

  await $.turn.start({ text: 'fix the login bug', turnId: 'turn-1' })
  await $.tool.call({ tool: 'Edit', file_path: '/repo/app.ts', old_string: 'a', new_string: 'b' } as Parameters<typeof $.tool.call>[0])
  await $.tool.call({ tool: 'Edit', file_path: '/repo/login.ts', old_string: 'a', new_string: 'b' } as Parameters<typeof $.tool.call>[0])
  expect(await stats($.command.run as never)).toContain('0 slain')

  await $.turn.complete(complete('turn-1'))
  expect(await stats($.command.run as never)).toContain('2 slain')
  expect(await stats($.command.run as never)).toContain('1 quests')

  await $.turn.start({ text: 'and the signup bug', turnId: 'turn-2' })
  await $.tool.call({ tool: 'Write', file_path: '/repo/signup.ts', content: 'x' } as Parameters<typeof $.tool.call>[0])
  expect(await stats($.command.run as never)).toContain('2 slain')
  await $.turn.complete(complete('turn-2'))
  expect(await stats($.command.run as never)).toContain('3 slain')
  await clock.advance(20_000)
})

test('a failed command costs a heart, and the Bug Dragon from passing tests runs off when nobody fights it', async ($, on) => {
  mock.clock(on, { now: 1000 })
  let shouldFail = true
  on('tool.call', { tool: 'Bash' }, () => (shouldFail ? { result: {}, text: 'failed', isError: true } : { result: {}, text: 'passed' }))
  standInForEngine(on)

  await $.turn.start({ text: 'fix the tests', turnId: 'turn-3' })
  await $.tool.call({ tool: 'Bash', command: 'bun run test' } as Parameters<typeof $.tool.call>[0])
  shouldFail = false
  await $.tool.call({ tool: 'Bash', command: 'bun run test' } as Parameters<typeof $.tool.call>[0])
  await $.turn.complete(complete('turn-3'))
  const after = await stats($.command.run as never)
  expect(after).toContain('♥♥♥♥♡')
  expect(after).toContain('0 slain')
})

test('/knightod off keeps tasks quiet, and /knightod reset starts a new knight', async ($, on) => {
  mock.clock(on, { now: 1000 })
  standInForEngine(on)

  const off = await $.command.run({ command: 'knightod', args: 'off' } as Parameters<typeof $.command.run>[0])
  expect(off.text).toBe('knightod off.')
  await $.turn.start({ text: 'anything', turnId: 'turn-4' })
  await $.tool.call({ tool: 'Edit', file_path: '/repo/a.ts', old_string: 'a', new_string: 'b' } as Parameters<typeof $.tool.call>[0])
  expect(await stats($.command.run as never)).toContain('0 slain')

  const reset = await $.command.run({ command: 'knightod', args: 'reset' } as Parameters<typeof $.command.run>[0])
  expect(reset.text).toBe('A new knight sets out.')
})

test('the boss clock resumes in the next task instead of starting over', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  standInForEngine(on)

  await $.turn.start({ text: 'first question', turnId: 'turn-1' })
  await clock.advance(90_000)
  await $.turn.complete(complete('turn-1'))
  await clock.advance(20_000)
  expect(await stats($.command.run as never)).toContain('played 1m · 0 of 5 bosses slain')

  await $.turn.start({ text: 'second question', turnId: 'turn-2' })
  await clock.advance(30_000)
  await $.turn.complete(complete('turn-2'))
  expect(await stats($.command.run as never)).toContain('played 2m')
  await clock.advance(20_000)
})

test('/knightod off is saved, so a later session starts with the knight away', async ($, on) => {
  standInForEngine(on, null)
  const saved: unknown[] = []
  on('store.set', ($, e) => {
    saved.push(e)
    return { value: undefined }
  })
  await $.command.run({ command: 'knightod', args: 'off' } as never)
  expect(saved).toEqual([{ key: 'knightod.isEnabled', value: false }])
})

test('a session starts with the knight away when /knightod was last turned off', async ($, on) => {
  mock.clock(on, { now: 1000 })
  standInForEngine(on, { 'knightod.isEnabled': false })
  await $.session.start({ source: 'startup', cwd: '/repo' } as never)
  expect(await stats($.command.run as never)).toContain('knightod off')
})
