import type { Player } from '../types'

interface MarkProps {
  player: Player
  className?: string
}

export function Mark({ player, className = '' }: MarkProps) {
  const color =
    player === 'X' ? 'text-mark-x' : 'text-mark-o'

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={`${color} ${className}`}
    >
      {player === 'X' ? <path d="M5 5l14 14M19 5L5 19" /> : <circle cx="12" cy="12" r="7.5" />}
    </svg>
  )
}
