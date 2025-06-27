'use client'
import { useState, useCallback } from 'react'
import GameBoard from './components/GameBoard'
import { getDailyPuzzle } from './utils/puzzleGenerator'

export default function Home() {
  const dailyPuzzle = getDailyPuzzle()
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<{row: number, col: number}[]>([])
  const [selectedLetters, setSelectedLetters] = useState<string>('')

  const handleWordFound = useCallback((word: string) => {
    if (dailyPuzzle.themeWords.includes(word) && !foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word])
    }
  }, [foundWords, dailyPuzzle.themeWords])

  const resetSelection = useCallback(() => {
    setCurrentPath([])
    setSelectedLetters('')
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2">Word Strands</h1>
        <p className="text-center text-gray-600 mb-6">Theme: {dailyPuzzle.theme}</p>
        
        <GameBoard 
          grid={dailyPuzzle.grid}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          selectedLetters={selectedLetters}
          setSelectedLetters={setSelectedLetters}
          onWordFound={handleWordFound}
          onReset={resetSelection}
          themeWords={dailyPuzzle.themeWords}
          foundWords={foundWords}
        />
        
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">
            Found: {foundWords.length} / {dailyPuzzle.themeWords.length}
          </p>
          {foundWords.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Found words:</p>
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {foundWords.map(word => (
                  <span key={word} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {foundWords.length === dailyPuzzle.themeWords.length && (
          <div className="text-center mt-4 p-4 bg-green-100 rounded">
            <h2 className="text-xl font-bold text-green-800">Congratulations!</h2>
            <p className="text-green-600">You found all words!</p>
          </div>
        )}
      </div>
    </div>
  )
}
