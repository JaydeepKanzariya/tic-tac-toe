import { Board } from './components/Board'
import { GameControls } from './components/GameControls'
import { ResetScores } from './components/ResetScores'
import { ScoreBoard } from './components/ScoreBoard'
import { StatusBar } from './components/StatusBar'
import { useGame } from './hooks/useGame'

const SOURCE_URL = 'https://github.com/JaydeepKanzariya/tic-tac-toe'

export default function App() {
  const game = useGame()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-page p-4 font-sans text-ink">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-card p-4 shadow-lg sm:p-6">
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-extrabold text-accent-ink">Tic Tac Toe</h1>
          <p className="mt-1 text-sm text-ink-muted">Two players, one device. Rounds alternate who starts.</p>
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
          <GameControls onNewGame={game.newGame} />
          <div className="flex flex-col gap-1">
            <ScoreBoard scores={game.scores} />
            <ResetScores canReset={game.canResetScores} onReset={game.resetScores} />
          </div>
        </main>
        <footer className="mt-5 text-center text-xs text-ink-muted">
          <span>© 2026 Jaydeep Kanzariya</span>
          <span aria-hidden="true"> · </span>
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded underline underline-offset-2 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-focus"
          >
            Source on GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
