import { Board } from './components/Board'
import { GameControls } from './components/GameControls'
import { ScoreBoard } from './components/ScoreBoard'
import { StatusBar } from './components/StatusBar'
import { useGame } from './hooks/useGame'

export default function App() {
  const game = useGame()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-100 p-4 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">Tic Tac Toe</h1>
        </header>
        <main className="flex flex-col gap-5">
          <StatusBar
            status={game.status}
            currentPlayer={game.currentPlayer}
            round={game.round}
            starter={game.starter}
          />
          <Board
            board={game.board}
            winResult={game.winResult}
            draw={game.draw}
            gameOver={game.gameOver}
            currentPlayer={game.currentPlayer}
            onPlay={game.play}
          />
          <ScoreBoard scores={game.scores} />
          <GameControls
            canResetScores={game.canResetScores}
            onNewGame={game.newGame}
            onResetScores={game.resetScores}
          />
        </main>
        <footer className="mt-5 text-center text-xs text-slate-600 dark:text-slate-300">
          Built with React
        </footer>
      </div>
    </div>
  )
}
