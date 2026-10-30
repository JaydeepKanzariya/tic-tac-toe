import { useEffect, useReducer } from 'react'
import {
  calculateWinner,
  createEmptyBoard,
  getNextPlayer,
  getStarter,
  isDraw,
} from '../lib/game'
import { loadProgress, saveProgress } from '../lib/storage'
import type { GameState, Player, Scores, WinResult } from '../types'

type Action = { type: 'PLAY'; index: number } | { type: 'NEW_GAME' } | { type: 'RESET_SCORES' }

const ZERO_SCORES: Scores = { X: 0, O: 0, draws: 0 }

function createInitialState(): GameState {
  const progress = loadProgress()
  return {
    board: createEmptyBoard(),
    scores: progress?.scores ?? ZERO_SCORES,
    round: progress?.round ?? 1,
  }
}

function reducer(state: GameState, action: Action): GameState {
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

function getStatusText(winResult: WinResult | null, draw: boolean, currentPlayer: Player | null): string {
  if (winResult) {
    return `Player ${winResult.winner} wins!`
  }
  if (draw || currentPlayer === null) {
    return "It's a draw!"
  }
  return `Player ${currentPlayer}'s turn`
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const { board, scores, round } = state

  useEffect(() => {
    saveProgress({ scores, round })
  }, [scores, round])

  const starter = getStarter(round)
  const winResult = calculateWinner(board)
  const draw = isDraw(board)
  const gameOver = winResult !== null || draw
  const currentPlayer = gameOver ? null : getNextPlayer(board, starter)
  const isPristine =
    round === 1 &&
    scores.X === 0 &&
    scores.O === 0 &&
    scores.draws === 0 &&
    board.every((cell) => cell === null)

  return {
    board,
    scores,
    round,
    starter,
    winResult,
    draw,
    gameOver,
    currentPlayer,
    status: getStatusText(winResult, draw, currentPlayer),
    canResetScores: !isPristine,
    play: (index: number) => dispatch({ type: 'PLAY', index }),
    newGame: () => dispatch({ type: 'NEW_GAME' }),
    resetScores: () => dispatch({ type: 'RESET_SCORES' }),
  }
}
