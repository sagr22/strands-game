interface DailyPuzzle {
    grid: string[][]
    themeWords: string[]
    theme: string
    date: string
  }
  
  const puzzles: DailyPuzzle[] = [
    {
      grid: [
        ['U', 'R', 'A', 'P', 'P', 'I'],
        ['B', 'S', 'W', 'E', 'H', 'R'],
        ['Y', 'E', 'E', 'M', 'L', 'E'],
        ['J', 'T', 'H', 'S', 'A', 'T'],
        ['G', 'S', 'Y', 'T', 'O', 'E'],
        ['A', 'R', 'E', 'N', 'E', 'M'],
        ['N', 'T', 'P', 'T', 'D', 'R'],
        ['E', 'Z', 'A', 'O', 'L', 'A']
      ],
      themeWords: ['RUBY', 'SAPPHIRE', 'AMETHYST', 'JEWELTONES', 'GARNET', 'TOPAZ', 'EMERALD'],
      theme: 'Precious Gems',
      date: '2025-06-27'
    }
  ]
  
  export function getDailyPuzzle(): DailyPuzzle {
    const today = new Date().toISOString().slice(0, 10)
    const puzzleIndex = Math.abs(hashCode(today)) % puzzles.length
    return puzzles[puzzleIndex]
  }
  
  function hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash
  }
  