import { BUTTON_PRIMARY } from './buttonStyles'

interface GameControlsProps {
  onNewGame: () => void
}

export function GameControls({ onNewGame }: GameControlsProps) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={onNewGame} className={`${BUTTON_PRIMARY} flex-1`}>
        New game
      </button>
    </div>
  )
}
