import { describe, expect, it } from 'vitest'
import {
  WINNING_LINES,
  calculateWinner,
  createEmptyBoard,
  getNextPlayer,
  getStarter,
  getLineSegment,
  getStatusText,
  isDraw,
} from './game'
import type { Board, Cell, Player } from '../types'

function boardWith(marks: Record<number, Player>): Board {
  return createEmptyBoard().map((_, index): Cell => marks[index] ?? null)
}

describe('calculateWinner', () => {
  it('has the 8 winning lines', () => {
    expect(WINNING_LINES).toHaveLength(8)
  })

  for (const player of ['X', 'O'] as const) {
    for (const line of WINNING_LINES) {
      it(`detects ${player} on line ${line.join('-')}`, () => {
        const board = boardWith(Object.fromEntries(line.map((i) => [i, player])))
        expect(calculateWinner(board)).toEqual({ winner: player, line })
      })
    }
  }

  it('returns null for an empty board and an unfinished game', () => {
    expect(calculateWinner(createEmptyBoard())).toBeNull()
    expect(calculateWinner(boardWith({ 0: 'X', 1: 'O', 4: 'X' }))).toBeNull()
  })
})

describe('isDraw', () => {
  const drawn = boardWith({ 0: 'X', 1: 'O', 2: 'X', 3: 'X', 4: 'O', 5: 'O', 6: 'O', 7: 'X', 8: 'X' })

  it('is true for a full board with no winner', () => {
    expect(calculateWinner(drawn)).toBeNull()
    expect(isDraw(drawn)).toBe(true)
  })

  it('is false while cells are empty', () => {
    expect(isDraw(createEmptyBoard())).toBe(false)
  })

  it('is false for a full board that has a winner (win on move 9)', () => {
    const win = boardWith({ 0: 'X', 1: 'O', 2: 'X', 3: 'O', 4: 'X', 5: 'O', 6: 'O', 7: 'X', 8: 'X' })
    expect(calculateWinner(win)?.winner).toBe('X')
    expect(isDraw(win)).toBe(false)
  })
})

describe('turn helpers', () => {
  it('alternates the starter each round', () => {
    expect([1, 2, 3, 4].map(getStarter)).toEqual(['X', 'O', 'X', 'O'])
  })

  it('derives the next player from the mark count and starter', () => {
    expect(getNextPlayer(createEmptyBoard(), 'X')).toBe('X')
    expect(getNextPlayer(boardWith({ 0: 'X' }), 'X')).toBe('O')
    expect(getNextPlayer(createEmptyBoard(), 'O')).toBe('O')
    expect(getNextPlayer(boardWith({ 4: 'O' }), 'O')).toBe('X')
  })
})

describe('getStatusText', () => {
  it('describes turn, win and draw', () => {
    expect(getStatusText(null, false, 'X')).toBe("Player X's turn")
    expect(getStatusText(null, false, 'O')).toBe("Player O's turn")
    expect(getStatusText({ winner: 'O', line: [0, 1, 2] }, false, null)).toBe('Player O wins!')
    expect(getStatusText(null, true, null)).toBe("It's a draw!")
  })
})

describe('getLineSegment', () => {
  it('runs through the end cells of a row, column and diagonal', () => {
    expect(getLineSegment([0, 1, 2])).toEqual({ x1: 0.2, y1: 0.5, x2: 2.8, y2: 0.5 })
    const column = getLineSegment([1, 4, 7])
    expect(column.x1).toBeCloseTo(1.5)
    expect(column.y1).toBeCloseTo(0.2)
    expect(column.y2).toBeCloseTo(2.8)
    const diagonal = getLineSegment([2, 4, 6])
    expect(diagonal.x1).toBeGreaterThan(2.5)
    expect(diagonal.x2).toBeLessThan(0.5)
  })

  it('stays inside the board for every winning line', () => {
    for (const line of WINNING_LINES) {
      const { x1, y1, x2, y2 } = getLineSegment(line)
      for (const value of [x1, y1, x2, y2]) {
        expect(value).toBeGreaterThan(0)
        expect(value).toBeLessThan(3)
      }
    }
  })
})
