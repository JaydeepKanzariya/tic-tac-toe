import type { Board, Player, WinResult } from '../types'

export const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => null)
}

export function calculateWinner(board: Board): WinResult | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line
    const mark = board[a]
    if (mark && mark === board[b] && mark === board[c]) {
      return { winner: mark, line }
    }
  }
  return null
}

export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && calculateWinner(board) === null
}

export function getStarter(round: number): Player {
  return round % 2 === 1 ? 'X' : 'O'
}

export function getNextPlayer(board: Board, starter: Player): Player {
  const marks = board.filter((cell) => cell !== null).length
  if (marks % 2 === 0) {
    return starter
  }
  return starter === 'X' ? 'O' : 'X'
}

export function getStatusText(
  winResult: WinResult | null,
  draw: boolean,
  currentPlayer: Player | null,
): string {
  if (winResult) {
    return `Player ${winResult.winner} wins!`
  }
  if (draw || currentPlayer === null) {
    return "It's a draw!"
  }
  return `Player ${currentPlayer}'s turn`
}

export interface LineSegment {
  x1: number
  y1: number
  x2: number
  y2: number
}

const LINE_OVERSHOOT = 0.3

function getCellCenter(index: number): [number, number] {
  return [(index % 3) + 0.5, Math.floor(index / 3) + 0.5]
}

/** Segment through a winning line in a 3x3 unit grid, extended slightly past the end cells. */
export function getLineSegment(line: readonly [number, number, number]): LineSegment {
  const [x1, y1] = getCellCenter(line[0])
  const [x2, y2] = getCellCenter(line[2])
  const length = Math.hypot(x2 - x1, y2 - y1)
  const dx = ((x2 - x1) / length) * LINE_OVERSHOOT
  const dy = ((y2 - y1) / length) * LINE_OVERSHOOT
  return { x1: x1 - dx, y1: y1 - dy, x2: x2 + dx, y2: y2 + dy }
}
