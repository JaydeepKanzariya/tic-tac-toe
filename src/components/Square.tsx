import { Mark } from './Mark'
import type { Cell, Player } from '../types'

interface SquareProps {
  cell: Cell
  label: string
  isWinning: boolean
  dimmed: boolean
  disabled: boolean
  previewPlayer: Player | null
  tabIndex: number
  buttonRef: (element: HTMLButtonElement | null) => void
  onSelect: () => void
  onFocus: () => void
}

export function Square({
  cell,
  label,
  isWinning,
  dimmed,
  disabled,
  previewPlayer,
  tabIndex,
  buttonRef,
  onSelect,
  onFocus,
}: SquareProps) {
  const background = isWinning
    ? 'border-2 border-accent bg-accent-soft'
    : 'bg-cell'
  const hover = disabled ? 'cursor-default' : 'hover:bg-cell-hover'
  const dim = dimmed ? 'opacity-50' : ''

  return (
    <button
      type="button"
      ref={buttonRef}
      tabIndex={tabIndex}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onFocus={onFocus}
      onClick={() => {
        if (!disabled) {
          onSelect()
        }
      }}
      className={`group flex aspect-square items-center justify-center outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset ${background} ${hover} ${dim}`}
    >
      {cell !== null && (
        <Mark player={cell} className="h-3/5 w-3/5 animate-pop-in motion-reduce:animate-none" />
      )}
      {cell === null && previewPlayer !== null && !disabled && (
        <Mark
          player={previewPlayer}
          className="h-3/5 w-3/5 opacity-0 group-hover:opacity-25"
        />
      )}
    </button>
  )
}
