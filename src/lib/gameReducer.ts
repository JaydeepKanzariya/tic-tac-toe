import {
  calculateWinner,
  getBoard,
  getStarter,
  getUndoMoves,
  isDraw,
} from './game'
import { loadProgress } from './storage'
import type { GameState, Scores } from '../types'

export type GameAction =
  | { type: 'PLAY'; index: number }
  | { type: 'NEW_GAME' }
  | { type: 'UNDO' }
  | { type: 'RESET_SCORES' }

const ZERO_SCORES: Scores = { X: 0, O: 0, draws: 0 }

export function createInitialState(): GameState {
  const progress = loadProgress()
  return {
    moves: [],
    scores: progress?.scores ?? ZERO_SCORES,
    round: progress?.round ?? 1,
  }
}

export function reducer(state: GameState, action: GameAction): GameState {
  const { moves, scores, round } = state
  const starter = getStarter(round)
  const board = getBoard(moves, starter)
  const finished = calculateWinner(board) !== null || isDraw(board)

  switch (action.type) {
    case 'PLAY': {
      const { index } = action
      if (!Number.isInteger(index) || index < 0 || index >= board.length || board[index] !== null || finished) {
        return state
      }
      const nextMoves = [...moves, index]
      const nextBoard = getBoard(nextMoves, starter)
      const win = calculateWinner(nextBoard)
      if (win) {
        return { ...state, moves: nextMoves, scores: { ...scores, [win.winner]: scores[win.winner] + 1 } }
      }
      if (isDraw(nextBoard)) {
        return { ...state, moves: nextMoves, scores: { ...scores, draws: scores.draws + 1 } }
      }
      return { ...state, moves: nextMoves }
    }
    case 'UNDO': {
      const undone = finished ? null : getUndoMoves(moves)
      return undone === null ? state : { ...state, moves: undone }
    }
    case 'NEW_GAME':
      return { ...state, moves: [], round: round + 1 }
    case 'RESET_SCORES':
      return { moves: [], scores: ZERO_SCORES, round: 1 }
  }
}
