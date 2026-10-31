import { describe, expect, it } from 'vitest'
import { getComputerMove } from './ai'
import { calculateWinner, createEmptyBoard } from './game'
import type { Cell, Player } from '../types'

function boardWith(marks: Record<number, Player>): Cell[] {
  return createEmptyBoard().map((_, index): Cell => marks[index] ?? null)
}

function humanNeverWins(board: Cell[], turn: Player): boolean {
  const win = calculateWinner(board)
  if (win) {
    return win.winner !== 'X'
  }
  const empty = board.flatMap((cell, index) => (cell === null ? [index] : []))
  if (empty.length === 0) {
    return true
  }
  if (turn === 'X') {
    return empty.every((index) => {
      const next = [...board]
      next[index] = 'X'
      return humanNeverWins(next, 'O')
    })
  }
  const move = getComputerMove(board, 'hard', 'O', () => 0)
  if (move === null) {
    return true
  }
  const next = [...board]
  next[move] = 'O'
  return humanNeverWins(next, 'X')
}

describe('getComputerMove', () => {
  it('returns null on a full board', () => {
    const full = boardWith({ 0: 'X', 1: 'O', 2: 'X', 3: 'X', 4: 'O', 5: 'O', 6: 'O', 7: 'X', 8: 'X' })
    expect(getComputerMove(full, 'easy', 'O')).toBeNull()
    expect(getComputerMove(full, 'hard', 'O')).toBeNull()
  })

  it('easy only picks empty cells', () => {
    const board = boardWith({ 0: 'X', 4: 'O', 8: 'X' })
    for (const random of [0, 0.2, 0.5, 0.99]) {
      const move = getComputerMove(board, 'easy', 'O', () => random)
      expect(move).not.toBeNull()
      expect(board[move ?? 0]).toBeNull()
    }
  })

  it('hard takes an immediate win', () => {
    expect(getComputerMove(boardWith({ 0: 'O', 1: 'O', 3: 'X', 4: 'X' }), 'hard', 'O')).toBe(2)
  })

  it('hard blocks the opponent', () => {
    expect(getComputerMove(boardWith({ 0: 'X', 1: 'X', 4: 'O' }), 'hard', 'O')).toBe(2)
  })

  it('hard opens on a corner or the centre', () => {
    expect([0, 2, 4, 6, 8]).toContain(getComputerMove(createEmptyBoard(), 'hard', 'O', () => 0.5))
  })

  it('hard is unbeatable when the human starts', () => {
    expect(humanNeverWins([...createEmptyBoard()], 'X')).toBe(true)
  })

  it('hard is unbeatable when the computer starts', () => {
    expect(humanNeverWins([...createEmptyBoard()], 'O')).toBe(true)
  })
})
