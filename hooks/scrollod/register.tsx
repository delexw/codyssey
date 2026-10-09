import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { drawNoticeRow } from './notice-row'
import { drawPromptBox } from './prompt-box'
import { drawReply } from './reply'
import { markRunStarts, MAX_RUN_STARTS } from './runs'
import { DEFAULT_STYLE, isStyle, STYLES } from './style'
import { drawToolRow } from './tool-row'

const STORE_KEY = 'scrollod.isOn'
const STYLE_STORE_KEY = 'scrollod.style'
const isOn = atom({ plugin: 'codyssey', key: 'scrollod.isOn' } as const, true)
const style = atom({ plugin: 'codyssey', key: 'scrollod.style' } as const, DEFAULT_STYLE)
const runStarts = atom({ plugin: 'codyssey', key: 'scrollod.runStarts' } as const, [])
const lastBlock = atom({ plugin: 'codyssey', key: 'scrollod.lastBlock' } as const, null)

export const registerScrollod: Register = on => {
  on('session.start', { cwd: /^/ }, async ($, e, next) => {
    const saved = await $.store.get(STORE_KEY)
    if (typeof saved === 'boolean') await update($, isOn, () => saved)
    const savedStyle = await $.store.get(STYLE_STORE_KEY)
    if (isStyle(savedStyle)) await update($, style, () => savedStyle)
    await $.command.register({
      name: 'scrollod',
      description: 'Quiet transcript: show its state, turn it on or off, or pick the plain or game style.',
      argumentHint: '[on|off|style <plain|game>]',
      immediate: true,
    })
    return next(e)
  })

  on('command.run', { command: 'scrollod' }, async ($, e) => {
    const [choice = '', name = ''] = e.args.trim().toLowerCase().split(/\s+/)
    if (choice === 'style') {
      if (!isStyle(name)) return { text: `styles: ${STYLES.join(', ')}. Now: ${await read($, style)}. Use /scrollod style <name>.` }
      await update($, style, () => name)
      await $.store.set(STYLE_STORE_KEY, name)
      return { text: `scrollod style is ${name}.` }
    }
    if (choice === 'on' || choice === 'off') {
      await update($, isOn, () => choice === 'on')
      await $.store.set(STORE_KEY, choice === 'on')
      return { text: `scrollod ${choice}.` }
    }
    return { text: `scrollod is ${(await read($, isOn)) ? 'on' : 'off'}, style ${await read($, style)}. Use /scrollod on, off or style <plain|game>.` }
  })

  on('session.append', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result
    if (e.door === 'prompt') {
      await update($, lastBlock, () => 'prose')
    } else if (e.door === 'response') {
      const marked = markRunStarts(await read($, lastBlock), e.message.content as readonly { type: string; id?: unknown }[])
      await update($, lastBlock, () => marked.last)
      if (marked.starts.length > 0) await update($, runStarts, ids => [...ids, ...marked.starts].slice(-MAX_RUN_STARTS))
    }
    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    if (e.surface !== 'terminal' || !(await read($, isOn))) return next(e)
    return drawToolRow($.ui.resolve(e), {
      id: e.props.tool_use_id,
      tool: e.props.tool,
      input: e.props.input,
      isRunning: e.props.isRunning,
      isErrored: e.props.isErrored,
      isInterrupted: e.props.isInterrupted,
      style: await read($, style),
      startsRun: (await read($, runStarts)).includes(e.props.tool_use_id),
    })
  })

  on('ui.render', { component: 'ToolResult' }, async ($, e, next) => {
    if (e.surface !== 'terminal' || e.props.isErrored || !(await read($, isOn))) return next(e)
    const { Box } = $.ui.resolve(e)
    return <Box />
  })

  on('ui.render', { component: 'UserMessage' }, async ($, e, next) => {
    if (e.surface !== 'terminal' || !(await read($, isOn)) || (await read($, style)) !== 'game') return next(e)
    if (e.props.origin.kind === 'composer') return drawPromptBox($.ui.resolve(e), e.props.text)
    if (e.props.origin.kind === 'task-notification') {
      return drawNoticeRow($.ui.resolve(e), { text: e.props.text, status: e.props.task?.status, durationMs: e.props.task?.durationMs })
    }
    return next(e)
  })

  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.surface !== 'terminal' || e.props.isSummary || !(await read($, isOn))) return next(e)
    return drawReply($.ui.resolve(e), { text: e.props.text, isFirstOfReply: e.props.isFirstOfReply, style: await read($, style) })
  })
}
