'use client'
import { useState } from 'react'

export default function GameBoard() {
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])
  
  return (
    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
      {/* Placeholder for letter grid */}
      <div className="aspect-square bg-blue-100 rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-blue-200">
        A
      </div>
    </div>
  )
}
