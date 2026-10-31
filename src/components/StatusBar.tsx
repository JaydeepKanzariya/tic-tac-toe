import { Mark } from './Mark'
import { getPlayerNames } from '../lib/game'
import type { Mode, Player } from '../types'

interface StatusBarProps {
  status: string
  currentPlayer: Player | null
  round: number
  starter: Player
  mode: Mode
}

interface TurnChipProps {
  player: Player
  name: string
  cue: string
  active: boolean
}

function TurnChip({ player, name, cue, active }: TurnChipProps) {
  const style = active ? 'bg-accent-soft ring-2 ring-accent' : 'ring-1 ring-line'

  return (
    <div className={`flex min-w-28 items-center gap-2 rounded-xl px-3 py-2 ${style}`}>
      <Mark player={player} className="h-6 w-6" />
      <div className="text-left leading-tight">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="text-xs text-ink-muted">{active ? cue : '\u00A0'}</p>
      </div>
    </div>
  )
}

export function StatusBar({ status, currentPlayer, round, starter, mode }: StatusBarProps) {
  const names = getPlayerNames(mode)
  const cueFor = (player: Player) =>
    mode !== 'two-player' && player === 'O' ? 'Thinking\u2026' : 'Your turn'

  return (
    <section className="flex flex-col items-center gap-3">
      <p aria-live="polite" className="text-xl font-bold text-ink">
        {status}
      </p>
      <div className="flex gap-3">
        {(['X', 'O'] as const).map((player) => (
          <TurnChip
            key={player}
            player={player}
            name={names[player]}
            cue={cueFor(player)}
            active={currentPlayer === player}
          />
        ))}
      </div>
      <p className="text-sm text-ink-muted">
        Round <span className="tabular-nums">{round}</span> · {names[starter]} {starter === 'X' && mode !== 'two-player' ? 'start' : 'starts'}
      </p>
    </section>
  )
}
