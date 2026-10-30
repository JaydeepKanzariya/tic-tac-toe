interface GameControlsProps {
  canResetScores: boolean
  onNewGame: () => void
  onResetScores: () => void
}

const BASE =
  'min-h-11 flex-1 rounded-xl px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'

export function GameControls({ canResetScores, onNewGame, onResetScores }: GameControlsProps) {
  const resetStyle = canResetScores
    ? 'hover:bg-slate-100 dark:hover:bg-slate-800'
    : 'cursor-not-allowed opacity-50'

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onNewGame}
        className={`${BASE} bg-rose-600 text-white hover:bg-rose-700`}
      >
        New game
      </button>
      <button
        type="button"
        aria-disabled={!canResetScores}
        onClick={() => {
          if (canResetScores) {
            onResetScores()
          }
        }}
        className={`${BASE} border border-slate-300 text-slate-800 dark:border-slate-600 dark:text-slate-100 ${resetStyle}`}
      >
        Reset scores
      </button>
    </div>
  )
}
