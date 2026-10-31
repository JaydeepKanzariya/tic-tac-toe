import { getLineSegment } from '../lib/game'

interface WinLineProps {
  line: readonly [number, number, number]
}

export function WinLine({ line }: WinLineProps) {
  const { x1, y1, x2, y2 } = getLineSegment(line)

  return (
    <svg
      viewBox="0 0 3 3"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full text-ink"
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={0.05}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        className="animate-draw-line motion-reduce:animate-none"
      />
    </svg>
  )
}
