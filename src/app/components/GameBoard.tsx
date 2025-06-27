'use client'
import { useState, useCallback } from 'react'

interface GameBoardProps {
  grid: string[][]
  currentPath: {row: number, col: number}[]
  setCurrentPath: (path: {row: number, col: number}[]) => void
  selectedLetters: string
  setSelectedLetters: (letters: string) => void
  onWordFound: (word: string) => void
  onReset: () => void
  themeWords: string[]
  foundWords: string[]
}

export default function GameBoard({ 
  grid, currentPath, setCurrentPath, selectedLetters, setSelectedLetters,
  onWordFound, onReset, themeWords, foundWords 
}: GameBoardProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [foundWordPaths, setFoundWordPaths] = useState<{[word: string]: {row: number, col: number}[]}>({})

  const isAdjacent = (pos1: {row: number, col: number}, pos2: {row: number, col: number}) => {
    const rowDiff = Math.abs(pos1.row - pos2.row)
    const colDiff = Math.abs(pos1.col - pos2.col)
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
  }

  const isInPath = useCallback((row: number, col: number) => {
    return currentPath.some(pos => pos.row === row && pos.col === col)
  }, [currentPath])

  const isInFoundWord = useCallback((row: number, col: number) => {
    return Object.values(foundWordPaths).some(path => 
      path.some(pos => pos.row === row && pos.col === col)
    )
  }, [foundWordPaths])

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    if (isInFoundWord(row, col)) return
    
    setIsSelecting(true)
    setCurrentPath([{row, col}])
    setSelectedLetters(grid[row][col])
  }, [grid, setCurrentPath, setSelectedLetters, isInFoundWord])

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (!isSelecting || isInFoundWord(row, col)) return
    
    const lastPos = currentPath[currentPath.length - 1]
    if (!lastPos) return

    if (isInPath(row, col)) {
      const index = currentPath.findIndex(pos => pos.row === row && pos.col === col)
      const newPath = currentPath.slice(0, index + 1)
      setCurrentPath(newPath)
      setSelectedLetters(newPath.map(pos => grid[pos.row][pos.col]).join(''))
    } else if (isAdjacent(lastPos, {row, col})) {
      const newPath = [...currentPath, {row, col}]
      setCurrentPath(newPath)
      setSelectedLetters(newPath.map(pos => grid[pos.row][pos.col]).join(''))
    }
  }, [isSelecting, currentPath, grid, setCurrentPath, setSelectedLetters, isInFoundWord, isInPath])

  const handleMouseUp = useCallback(() => {
    if (selectedLetters.length >= 3) {
      if (themeWords.includes(selectedLetters) && !foundWords.includes(selectedLetters)) {
        setFoundWordPaths(prev => ({
          ...prev,
          [selectedLetters]: [...currentPath]
        }))
        onWordFound(selectedLetters)
      }
    }
    setIsSelecting(false)
    onReset()
  }, [selectedLetters, themeWords, foundWords, currentPath, onWordFound, onReset])

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const isCurrentlySelected = isInPath(rowIndex, colIndex)
    const isFoundCell = isInFoundWord(rowIndex, colIndex)
    
    if (isCurrentlySelected) {
      return 'bg-blue-500 text-white border-blue-600'
    } else if (isFoundCell) {
      return 'bg-yellow-400 text-black border-yellow-500'
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
    }
  }

  const getConnectionPath = (start: {row: number, col: number}, end: {row: number, col: number}) => {
    const cellSize = 48
    const gap = 8
    const totalCellSize = cellSize + gap
    const radius = 24
    
    const startX = start.col * totalCellSize + radius + 16
    const startY = start.row * totalCellSize + radius + 16
    const endX = end.col * totalCellSize + radius + 16
    const endY = end.row * totalCellSize + radius + 16
    
    const angle = Math.atan2(endY - startY, endX - startX)
    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
    
    const adjustedStartX = startX + Math.cos(angle) * radius
    const adjustedStartY = startY + Math.sin(angle) * radius
    
    const rectWidth = distance - (2 * radius)
    const rectHeight = 6
    
    return {
      x: adjustedStartX,
      y: adjustedStartY - rectHeight / 2,
      width: rectWidth,
      height: rectHeight,
      angle: angle * (180 / Math.PI)
    }
  }

  // Calculate proper SVG dimensions
  const rows = grid.length
  const cols = grid[0].length
  const cellSize = 48
  const gap = 8
  const padding = 16
  const svgWidth = cols * (cellSize + gap) + (padding * 2)
  const svgHeight = rows * (cellSize + gap) + (padding * 2)

  return (
    <div className="mb-6">
      <div className="relative bg-white p-4 rounded-lg shadow-lg select-none" style={{width: 'fit-content', margin: '0 auto'}}>
        {/* Connection rectangles for found words */}
        <svg 
          className="absolute inset-0 pointer-events-none" 
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{zIndex: 1, overflow: 'visible'}}
        >
          {Object.entries(foundWordPaths).map(([word, path]) => (
            <g key={word}>
              {path.map((pos, index) => {
                if (index === path.length - 1) return null
                const nextPos = path[index + 1]
                const connection = getConnectionPath(pos, nextPos)
                
                return (
                  <rect
                    key={`${word}-${index}`}
                    x={connection.x}
                    y={connection.y}
                    width={connection.width}
                    height={connection.height}
                    fill="#facc15"
                    transform={`rotate(${connection.angle} ${connection.x} ${connection.y + connection.height/2})`}
                  />
                )
              })}
            </g>
          ))}
        </svg>

        {/* Current selection connection rectangles */}
        <svg 
          className="absolute inset-0 pointer-events-none" 
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{zIndex: 1, overflow: 'visible'}}
        >
          {currentPath.map((pos, index) => {
            if (index === currentPath.length - 1) return null
            const nextPos = currentPath[index + 1]
            const connection = getConnectionPath(pos, nextPos)
            
            return (
              <rect
                key={`current-${index}`}
                x={connection.x}
                y={connection.y}
                width={connection.width}
                height={connection.height}
                fill="#3b82f6"
                transform={`rotate(${connection.angle} ${connection.x} ${connection.y + connection.height/2})`}
              />
            )
          })}
        </svg>

        {/* Grid of circular letters */}
        <div className="grid grid-cols-6 gap-2" style={{zIndex: 2, position: 'relative'}}>
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-lg font-bold
                  rounded-full cursor-pointer transition-all border-2
                  ${getCellStyle(rowIndex, colIndex)}
                `}
                onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
              >
                {letter}
              </div>
            ))
          )}
        </div>
      </div>
      
      {selectedLetters && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Current: {selectedLetters}</p>
        </div>
      )}
    </div>
  )
}
