export type Sprite = {
  rows: readonly string[]
  palette: Readonly<Record<string, string>>
}

export type Canvas = (string | null)[][]

export type Run = { text: string; color?: string; backgroundColor?: string }

export type Mark = { text: string; color: string }

export function spriteWidth(sprite: Sprite): number {
  return sprite.rows.reduce((widest, row) => Math.max(widest, row.length), 0)
}

export function frameOf(frames: readonly Sprite[], index: number): Sprite {
  const frame = frames[index % frames.length] ?? frames[0]
  if (frame === undefined) throw new Error('a sprite needs at least one frame')
  return frame
}

export function blankCanvas(width: number, height: number): Canvas {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null))
}

export function stamp(canvas: Canvas, sprite: Sprite, left: number, bottom: number, tint?: string): void {
  const top = bottom - sprite.rows.length + 1
  sprite.rows.forEach((row, rowIndex) => {
    const line = canvas[top + rowIndex]
    if (line === undefined) return
    for (let column = 0; column < row.length; column += 1) {
      const color = sprite.palette[row[column] ?? '.']
      const x = left + column
      if (color !== undefined && x >= 0 && x < line.length) line[x] = tint ?? color
    }
  })
}

export function canvasRuns(canvas: Canvas, marks: readonly (readonly (Mark | null)[])[] = []): Run[][] {
  const rows: Run[][] = []
  for (let y = 0; y < canvas.length; y += 2) {
    const top = canvas[y] ?? []
    const bottom = canvas[y + 1] ?? []
    const runs: Run[] = []
    for (let x = 0; x < top.length; x += 1) {
      const upper = top[x] ?? null
      const lower = bottom[x] ?? null
      const mark = marks[y / 2]?.[x] ?? null
      const cell: Run =
        mark !== null
          ? { text: mark.text, color: mark.color }
          : upper !== null && lower !== null
          ? { text: '▀', color: upper, backgroundColor: lower }
          : upper !== null
            ? { text: '▀', color: upper }
            : lower !== null
              ? { text: '▄', color: lower }
              : { text: ' ' }
      const last = runs.at(-1)
      if (last !== undefined && last.color === cell.color && last.backgroundColor === cell.backgroundColor && last.text.at(-1) === cell.text) {
        last.text += cell.text
      } else {
        runs.push(cell)
      }
    }
    rows.push(runs)
  }
  return rows
}
