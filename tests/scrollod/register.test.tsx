import type { On } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'

function standInForEngine(on: On) {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine row</Text>
  })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
}

const TOOL_PROPS = {
  tool_use_id: 'toolu_1',
  tool: 'Bash',
  input: { command: 'git status', description: 'Show status' },
  isRunning: false,
  isErrored: false,
  isInterrupted: false,
  output: { stdout: 'clean', stderr: '' },
}

for (const surface of ['terminal', 'desktop'] as const) {
  test(`a tool call draws as one quiet line on the terminal and is left alone elsewhere (${surface})`, async ($, on) => {
    standInForEngine(on)
    const ui = await $.ui.mount({ plugin: 'codyssey', surface, component: 'ToolUse', requestId: 'toolu_1', props: TOOL_PROPS as never })
    expect((await ui.find({ text: ' git status' })) !== undefined).toBe(surface === 'terminal')
    expect((await ui.find({ text: 'engine row' })) !== undefined).toBe(surface !== 'terminal')
    await ui.unmount()
  })
}

test('a result is hidden unless the call failed', async ($, on) => {
  standInForEngine(on)
  const ok = await $.ui.mount({
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'ToolResult',
    requestId: 'toolu_1',
    props: { tool_use_id: 'toolu_1', tool: 'Bash', output: { stdout: 'clean output', stderr: '' }, isErrored: false } as never,
  })
  expect(await ok.find({ text: 'engine row' })).toBeUndefined()
  await ok.unmount()
  const failed = await $.ui.mount({
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'ToolResult',
    requestId: 'toolu_2',
    props: { tool_use_id: 'toolu_2', tool: 'Bash', output: 'exit 1', isErrored: true } as never,
  })
  expect(await failed.find({ text: 'engine row' })).toBeDefined()
  await failed.unmount()
})

test('/scrollod off hands every row back to the engine and is remembered', async ($, on) => {
  standInForEngine(on)
  mock.store(on)
  await $.session.start({ source: 'startup', cwd: '/repo' } as never)
  const off = await $.command.run({ command: 'scrollod', args: 'off' } as Parameters<typeof $.command.run>[0])
  expect(off.text).toBe('scrollod off.')
  const ui = await $.ui.mount({ plugin: 'codyssey', surface: 'terminal', component: 'ToolUse', requestId: 'toolu_1', props: TOOL_PROPS as never })
  expect(await ui.find({ text: '✓ ' })).toBeUndefined()
  expect(await ui.find({ text: 'engine row' })).toBeDefined()
  await ui.unmount()
  const status = await $.command.run({ command: 'scrollod', args: '' } as Parameters<typeof $.command.run>[0])
  expect(status.text).toBe('scrollod is off, style game. Use /scrollod on, off or style <plain|game>.')
})

test('a session starts quiet or not as /scrollod was last left', async ($, on) => {
  standInForEngine(on)
  mock.store(on, { 'scrollod.isOn': false })
  await $.session.start({ source: 'startup', cwd: '/repo' } as never)
  const ui = await $.ui.mount({ plugin: 'codyssey', surface: 'terminal', component: 'ToolUse', requestId: 'toolu_1', props: TOOL_PROPS as never })
  expect(await ui.find({ text: 'engine row' })).toBeDefined()
  await ui.unmount()
})

test('a running call shows the animated spinner in place of its mark', async ($, on) => {
  standInForEngine(on)
  const ui = await $.ui.mount({
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'ToolUse',
    requestId: 'toolu_3',
    props: { ...TOOL_PROPS, tool_use_id: 'toolu_3', isRunning: true, output: undefined } as never,
  })
  expect(await ui.find({ type: 'Client' })).toBeDefined()
  expect(await ui.find({ text: '✓ ' })).toBeUndefined()
  await ui.unmount()
})

test('a tool call that follows thinking gets a blank line above it, the next one in the run does not', async ($, on) => {
  standInForEngine(on)
  await $.session.append({
    message: { type: 'assistant', role: 'assistant', content: [{ type: 'thinking', thinking: 'hmm', signature: 's' }] },
    door: 'response',
    origin: { kind: 'model', model: 'test' },
    uuid: 'u1',
  } as never)
  for (const [uuid, id] of [['u2', 'toolu_a'], ['u3', 'toolu_b']] as const) {
    await $.session.append({
      message: { type: 'assistant', role: 'assistant', content: [{ type: 'tool_use', id, name: 'Bash', input: {} }] },
      door: 'response',
      origin: { kind: 'model', model: 'test' },
      uuid,
    } as never)
  }
  for (const [id, gap] of [['toolu_a', 1], ['toolu_b', 0]] as const) {
    const ui = await $.ui.mount({ plugin: 'codyssey', surface: 'terminal', component: 'ToolUse', requestId: id, props: { ...TOOL_PROPS, tool_use_id: id } as never })
    expect((await ui.find({ key: `row-${id}` }))?.props.marginTop).toBe(gap)
    await ui.unmount()
  }
})

test('/scrollod style game draws tools as a battle log and replies as dialogue boxes, and is remembered', async ($, on) => {
  standInForEngine(on)
  mock.store(on)
  const list = await $.command.run({ command: 'scrollod', args: 'style' } as Parameters<typeof $.command.run>[0])
  expect(list.text).toBe('styles: plain, game. Now: game. Use /scrollod style <name>.')
  await $.command.run({ command: 'scrollod', args: 'style plain' } as Parameters<typeof $.command.run>[0])
  const game = await $.command.run({ command: 'scrollod', args: 'style game' } as Parameters<typeof $.command.run>[0])
  expect(game.text).toBe('scrollod style is game.')

  const failed = await $.ui.mount({
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'ToolUse',
    requestId: 'toolu_4',
    props: { ...TOOL_PROPS, tool_use_id: 'toolu_4', isErrored: true } as never,
  })
  expect(await failed.find({ text: ' ⚔ FIGHT ' })).toBeDefined()
  expect(await failed.find({ text: ' · git status' })).toBeDefined()
  expect(await failed.find({ text: ' — took a hit' })).toBeDefined()
  await failed.unmount()

  const running = await $.ui.mount({
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'ToolUse',
    requestId: 'toolu_5',
    props: { ...TOOL_PROPS, tool_use_id: 'toolu_5', isRunning: true, output: undefined } as never,
  })
  expect((await running.find({ type: 'Client' }))?.props.props).toMatchObject({ look: 'charge' })
  await running.unmount()

  const reply = await $.ui.mount({
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'AssistantMessage',
    requestId: 'msg_1',
    props: { text: 'Done.', isFirstOfReply: true } as never,
  })
  expect(await reply.find({ text: ' ◆ CLAUDE ' })).toBeDefined()
  expect(await reply.find({ key: 'nameplate' })).toBeDefined()
  expect((await reply.find({ key: 'dialogue' }))?.props).toMatchObject({ borderStyle: 'round' })
  expect((await reply.find({ key: 'dialogue' })) !== undefined).toBe(true)
  await reply.unmount()

  await $.session.start({ source: 'startup', cwd: '/repo' } as never)
  const status = await $.command.run({ command: 'scrollod', args: '' } as Parameters<typeof $.command.run>[0])
  expect(status.text).toContain('style game')
})

test('in the game style your typed prompts get a blue YOU box, other rows and plain style are left alone', async ($, on) => {
  standInForEngine(on)
  mock.store(on)
  const prompt = { plugin: 'codyssey', surface: 'terminal', component: 'UserMessage', requestId: 'msg_u1', props: { text: 'fix the bug', origin: { kind: 'composer' }, isExpanded: false } } as const
  await $.command.run({ command: 'scrollod', args: 'style plain' } as Parameters<typeof $.command.run>[0])
  const plain = await $.ui.mount(prompt as never)
  expect(await plain.find({ key: 'prompt-box' })).toBeUndefined()
  await plain.unmount()

  await $.command.run({ command: 'scrollod', args: 'style game' } as Parameters<typeof $.command.run>[0])
  const game = await $.ui.mount(prompt as never)
  expect(await game.find({ key: 'prompt-box' })).toBeDefined()
  expect(await game.find({ text: ' ◆ YOU ' })).toBeDefined()
  expect(await game.find({ text: 'fix the bug' })).toBeDefined()
  await game.unmount()

  const expanded = await $.ui.mount({ ...prompt, props: { ...prompt.props, isExpanded: true } } as never)
  expect(await expanded.find({ key: 'prompt-box' })).toBeDefined()
  await expanded.unmount()
})

test('in the game style a finished background task shows as a quest row', async ($, on) => {
  standInForEngine(on)
  mock.store(on)
  await $.command.run({ command: 'scrollod', args: 'style game' } as Parameters<typeof $.command.run>[0])
  const notice = {
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'UserMessage',
    requestId: 'msg_n1',
    props: { text: 'Monitor "wait" stream ended', origin: { kind: 'task-notification' }, isExpanded: false, task: { status: 'completed', durationMs: 122_000 } },
  } as const
  const row = await $.ui.mount(notice as never)
  expect(await row.find({ key: 'notice-row' })).toBeDefined()
  expect(await row.find({ text: ' ⚑ QUEST ' })).toBeDefined()
  expect(await row.find({ text: ' · 2m 2s' })).toBeDefined()
  await row.unmount()

})

test('in the game style a message from another agent sits in a green ally box under its name', async ($, on) => {
  standInForEngine(on)
  mock.store(on)
  await $.command.run({ command: 'scrollod', args: 'style game' } as Parameters<typeof $.command.run>[0])
  const message = {
    plugin: 'codyssey',
    surface: 'terminal',
    component: 'UserMessage',
    requestId: 'msg_a1',
    props: {
      text: '[Subagent hand-back] The text below is the final report. The report follows:\n  All checks pass.',
      origin: { kind: 'unclassified' },
      isExpanded: false,
      from: { name: 'general-purpose' },
    },
  } as const
  const box = await $.ui.mount(message as never)
  expect((await box.find({ key: 'ally-box' }))?.props).toMatchObject({ borderStyle: 'round', borderColor: '#43A047' })
  expect(await box.find({ text: ' ♞ GENERAL-PURPOSE ' })).toBeDefined()
  expect((await box.find({ type: 'Markdown' }))?.props.text).toBe('All checks pass.')
  await box.unmount()

  await $.command.run({ command: 'scrollod', args: 'style plain' } as Parameters<typeof $.command.run>[0])
  const plain = await $.ui.mount(message as never)
  expect(await plain.find({ key: 'ally-box' })).toBeUndefined()
  await plain.unmount()
})
