import { calculateWinner, getOpponent } from './game'
import type { Board, Cell, Difficulty, Player } from '../types'

type Random = () => number

function getEmptyCells(board: Board): number[] {
  return board.flatMap((cell, index) => (cell === null ? [index] : []))
}

function pick<T>(items: readonly T[], random: Random): T {
  return items[Math.floor(random() * items.length)]
}

/** Minimax from `me`'s point of view; quicker wins and slower losses score better. */
function minimax(board: Cell[], turn: Player, me: Player, depth: number): number {
  const win = calculateWinner(board)
  if (win) {
    return win.winner === me ? 10 - depth : depth - 10
  }
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    return 0
  }
  const scores = empty.map((index) => {
    board[index] = turn
    const score = minimax(board, getOpponent(turn), me, depth + 1)
    board[index] = null
    return score
  })
  return turn === me ? Math.max(...scores) : Math.min(...scores)
}

/**
 * Picks a cell for `player`. Easy plays a random empty cell; hard plays a random
 * move among the best ones, which makes it unbeatable. Returns null on a full board.
 */
export function getComputerMove(
  board: Board,
  difficulty: Difficulty,
  player: Player,
  random: Random = Math.random,
): number | null {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    return null
  }
  if (difficulty === 'easy') {
    return pick(empty, random)
  }
  if (empty.length === board.length) {
    return pick([0, 2, 4, 6, 8], random)
  }
  const work = [...board]
  const scored = empty.map((index) => {
    work[index] = player
    const score = minimax(work, getOpponent(player), player, 1)
    work[index] = null
    return { index, score }
  })
  const best = Math.max(...scored.map((move) => move.score))
  return pick(
    scored.filter((move) => move.score === best).map((move) => move.index),
    random,
  )
}
