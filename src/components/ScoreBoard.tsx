import type { Scores } from '../types'

interface ScoreBoardProps {
  scores: Scores
}

interface ScoreItemProps {
  label: string
  value: number
}

function ScoreItem({ label, value }: ScoreItemProps) {
  return (
    <div className="rounded-xl bg-slate-100 px-3 py-2 text-center dark:bg-slate-800">
      <dt className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</dt>
      <dd className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{value}</dd>
    </div>
  )
}

export function ScoreBoard({ scores }: ScoreBoardProps) {
  return (
    <dl aria-label="Scoreboard" className="grid grid-cols-3 gap-3">
      <ScoreItem label="X wins" value={scores.X} />
      <ScoreItem label="O wins" value={scores.O} />
      <ScoreItem label="Draws" value={scores.draws} />
    </dl>
  )
}
