interface GameControlsProps {
  canResetScores: boolean
  onNewGame: () => void
  onResetScores: () => void
}

const BASE =
  'min-h-11 flex-1 rounded-xl px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-card'

export function GameControls({ canResetScores, onNewGame, onResetScores }: GameControlsProps) {
  const resetStyle = canResetScores
    ? 'hover:bg-subtle'
    : 'cursor-not-allowed opacity-50'

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onNewGame}
        className={`${BASE} bg-accent text-on-accent hover:bg-accent-hover`}
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
        className={`${BASE} border border-grid text-ink ${resetStyle}`}
      >
        Reset scores
      </button>
    </div>
  )
}
