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
