import { Theme } from '@/types/game'
import themesData from '@/data/themes.json'

// Type the themes object
const themes: Record<string, Theme> = themesData as Record<string, Theme>

export function getTodaysTheme(): Theme {
  const today = new Date().toISOString().slice(0, 10)
  return themes[today] || themes['default']
}

export function isValidPath(from: number, to: number, gridSize: number = 4): boolean {
  const fromRow = Math.floor(from / gridSize)
  const fromCol = from % gridSize
  const toRow = Math.floor(to / gridSize)
  const toCol = to % gridSize
  
  const rowDiff = Math.abs(fromRow - toRow)
  const colDiff = Math.abs(fromCol - toCol)
  
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)
}
