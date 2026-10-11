import { expect, test } from 'claude-code/testing'

import { MONSTERS } from '../../hooks/knightod/sprites/monsters'

test('every monster and boss has spare colours for subagents that fill the same slots as its own and never repeat them', async () => {
  for (const [species, monster] of Object.entries(MONSTERS)) {
    const main = monster.frames[0]?.palette ?? {}
    expect({ species, count: monster.minionPalettes.length > 0 }).toEqual({ species, count: true })
    for (const palette of monster.minionPalettes) {
      expect({ species, slots: Object.keys(palette).sort() }).toEqual({ species, slots: Object.keys(main).sort() })
      expect({ species, isMain: JSON.stringify(palette) === JSON.stringify(main) }).toEqual({ species, isMain: false })
    }
    const distinct = new Set(monster.minionPalettes.map(palette => JSON.stringify(palette)))
    expect({ species, distinct: distinct.size }).toEqual({ species, distinct: monster.minionPalettes.length })
  }
})
