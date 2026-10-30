import { calculateWinner, createEmptyBoard, getNextPlayer, getStarter, isDraw } from './game'
import { loadProgress } from './storage'
import type { GameState, Scores } from '../types'

export type GameAction = { type: 'PLAY'; index: number } | { type: 'NEW_GAME' } | { type: 'RESET_SCORES' }

const ZERO_SCORES: Scores = { X: 0, O: 0, draws: 0 }

export function createInitialState(): GameState {
  const progress = loadProgress()
  return {
    board: createEmptyBoard(),
    scores: progress?.scores ?? ZERO_SCORES,
    round: progress?.round ?? 1,
  }
}

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY': {
      const { board, scores, round } = state
      const { index } = action
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= board.length ||
        board[index] !== null ||
        calculateWinner(board) !== null ||
        isDraw(board)
      ) {
        return state
      }
      const player = getNextPlayer(board, getStarter(round))
      const next = board.map((cell, i) => (i === index ? player : cell))
      const win = calculateWinner(next)
      if (win) {
        return { ...state, board: next, scores: { ...scores, [win.winner]: scores[win.winner] + 1 } }
      }
      if (isDraw(next)) {
        return { ...state, board: next, scores: { ...scores, draws: scores.draws + 1 } }
      }
      return { ...state, board: next }
    }
    case 'NEW_GAME':
      return { ...state, board: createEmptyBoard(), round: state.round + 1 }
    case 'RESET_SCORES':
      return { board: createEmptyBoard(), scores: ZERO_SCORES, round: 1 }
  }
}
