export interface GameState {
    selectedPath: number[]
    foundWords: string[]
    currentWord: string
    isComplete: boolean
  }
  
  export interface Theme {
    theme: string
    words: string[]
    grid: string[][]
  }
  