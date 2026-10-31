import { BUTTON_PRIMARY, BUTTON_SECONDARY } from './buttonStyles'

interface GameControlsProps {
  canUndo: boolean
  onNewGame: () => void
  onUndo: () => void
}

export function GameControls({ canUndo, onNewGame, onUndo }: GameControlsProps) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={onNewGame} className={`${BUTTON_PRIMARY} flex-1`}>
        New game
      </button>
      <button
        type="button"
        aria-disabled={!canUndo}
        onClick={() => {
          if (canUndo) {
            onUndo()
          }
        }}
        className={`${BUTTON_SECONDARY} flex-1 ${canUndo ? '' : 'cursor-not-allowed opacity-50'}`}
      >
        Undo
      </button>
    </div>
  )
}
