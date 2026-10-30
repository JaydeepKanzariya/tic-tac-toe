import { Square } from './Square'
import { useRovingFocus } from '../hooks/useRovingFocus'
import type { Board as BoardState, Player, WinResult } from '../types'

interface BoardProps {
  board: BoardState
  winResult: WinResult | null
  draw: boolean
  gameOver: boolean
  currentPlayer: Player | null
  onPlay: (index: number) => void
}

const COLUMNS = 3

export function Board({ board, winResult, draw, gameOver, currentPlayer, onPlay }: BoardProps) {
  const { activeIndex, setActiveIndex, register, onKeyDown } = useRovingFocus(
    board.length,
    COLUMNS,
  )

  return (
    <div
      role="group"
      aria-label="Game board"
      onKeyDown={onKeyDown}
      className={`mx-auto grid w-full max-w-sm grid-cols-3 gap-1 overflow-hidden rounded-xl border-4 border-slate-300 bg-slate-300 sm:max-w-md dark:border-slate-600 dark:bg-slate-600 ${draw ? 'opacity-70' : ''}`}
    >
      {board.map((cell, index) => {
        const isWinning = winResult?.line.includes(index) ?? false
        const row = Math.floor(index / COLUMNS) + 1
        const column = (index % COLUMNS) + 1
        const state = cell ?? 'empty'
        const label = `Row ${row}, column ${column}, ${state}${isWinning ? ', winning cell' : ''}`

        return (
          <Square
            key={index}
            cell={cell}
            label={label}
            isWinning={isWinning}
            dimmed={winResult !== null && !isWinning}
            disabled={cell !== null || gameOver}
            previewPlayer={currentPlayer}
            tabIndex={index === activeIndex ? 0 : -1}
            buttonRef={register(index)}
            onSelect={() => onPlay(index)}
            onFocus={() => setActiveIndex(index)}
          />
        )
      })}
    </div>
  )
}
