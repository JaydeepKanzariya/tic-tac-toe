import { useEffect, useReducer } from 'react'
import { getComputerMove } from '../lib/ai'
import {
  calculateWinner,
  getBoard,
  getNextPlayer,
  getStarter,
  getStatusText,
  getUndoMoves,
  isDraw,
} from '../lib/game'
import { createInitialState, reducer } from '../lib/gameReducer'
import { saveProgress } from '../lib/storage'
import type { Mode } from '../types'

const COMPUTER_DELAY_MS = 450

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const { moves, scores, round, mode } = state

  useEffect(() => {
    saveProgress({ scores, round, mode })
  }, [scores, round, mode])

  const starter = getStarter(round)
  const board = getBoard(moves, starter)
  const winResult = calculateWinner(board)
  const draw = isDraw(board)
  const gameOver = winResult !== null || draw
  const currentPlayer = gameOver ? null : getNextPlayer(board, starter)
  const computerTurn = mode !== 'two-player' && currentPlayer === 'O'
  const isPristine =
    round === 1 && scores.X === 0 && scores.O === 0 && scores.draws === 0 && moves.length === 0

  useEffect(() => {
    if (!computerTurn) {
      return undefined
    }
    const timer = setTimeout(() => {
      const index = getComputerMove(getBoard(moves, starter), mode, 'O')
      if (index !== null) {
        dispatch({ type: 'PLAY', index })
      }
    }, COMPUTER_DELAY_MS)
    return () => clearTimeout(timer)
  }, [computerTurn, mode, moves, starter])

  return {
    board,
    scores,
    round,
    starter,
    mode,
    winResult,
    draw,
    gameOver,
    currentPlayer,
    locked: computerTurn,
    status: getStatusText(winResult, draw, currentPlayer, mode),
    canResetScores: !isPristine,
    canUndo: !gameOver && !computerTurn && getUndoMoves(moves, starter, mode) !== null,
    play: (index: number) => {
      if (!computerTurn) {
        dispatch({ type: 'PLAY', index })
      }
    },
    newGame: () => dispatch({ type: 'NEW_GAME' }),
    undo: () => dispatch({ type: 'UNDO' }),
    resetScores: () => dispatch({ type: 'RESET_SCORES' }),
    setMode: (next: Mode) => dispatch({ type: 'SET_MODE', mode: next }),
  }
}
