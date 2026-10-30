import { Mark } from './Mark'
import type { Player } from '../types'

interface StatusBarProps {
  status: string
  currentPlayer: Player | null
  round: number
  starter: Player
}

interface TurnChipProps {
  player: Player
  active: boolean
}

function TurnChip({ player, active }: TurnChipProps) {
  const style = active
    ? 'bg-accent-soft ring-2 ring-accent'
    : 'ring-1 ring-line'

  return (
    <div className={`flex min-w-28 items-center gap-2 rounded-xl px-3 py-2 ${style}`}>
      <Mark player={player} className="h-6 w-6" />
      <div className="text-left leading-tight">
        <p className="text-sm font-semibold text-ink">Player {player}</p>
        <p className="text-xs text-ink-muted">
          {active ? 'Your turn' : '\u00A0'}
        </p>
      </div>
    </div>
  )
}

export function StatusBar({ status, currentPlayer, round, starter }: StatusBarProps) {
  return (
    <section className="flex flex-col items-center gap-3">
      <p aria-live="polite" className="text-xl font-bold text-ink">
        {status}
      </p>
      <div className="flex gap-3">
        <TurnChip player="X" active={currentPlayer === 'X'} />
        <TurnChip player="O" active={currentPlayer === 'O'} />
      </div>
      <p className="text-sm text-ink-muted">
        Round <span className="tabular-nums">{round}</span> · {starter} starts
      </p>
    </section>
  )
}
