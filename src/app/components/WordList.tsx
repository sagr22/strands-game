interface WordListProps {
    themeWords: string[]
    foundWords: string[]
  }
  
  export default function WordList({ themeWords, foundWords }: WordListProps) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Words to Find:</h3>
        <div className="space-y-2">
          {themeWords.map(word => (
            <div
              key={word}
              className={`p-2 rounded ${
                foundWords.includes(word)
                  ? 'bg-green-100 text-green-800 line-through'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {foundWords.includes(word) ? word : '?'.repeat(word.length)}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Found: {foundWords.length} / {themeWords.length}
        </p>
      </div>
    )
  }
  