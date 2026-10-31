import { useId } from 'react'
import { isMode } from '../lib/game'
import type { Mode } from '../types'

interface ModeSelectProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

const OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'two-player', label: 'Two players' },
  { value: 'easy', label: 'Computer (easy)' },
  { value: 'hard', label: 'Computer (hard)' },
]

export function ModeSelect({ mode, onChange }: ModeSelectProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-sm font-medium text-ink-muted">
          Opponent
        </label>
        <select
          id={id}
          value={mode}
          aria-describedby={hintId}
          onChange={(event) => {
            if (isMode(event.target.value)) {
              onChange(event.target.value)
            }
          }}
          className="min-h-11 rounded-xl border border-grid bg-card px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <p id={hintId} className="text-xs text-ink-muted">
        Switching opponent starts a new scoreboard.
      </p>
    </div>
  )
}
