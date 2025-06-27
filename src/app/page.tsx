import GameBoard from '@/components/game/GameBoard'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Word Challenge</h1>
      <GameBoard />
    </main>
  )
}
