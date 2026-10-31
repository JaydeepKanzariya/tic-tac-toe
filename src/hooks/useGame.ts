import { useEffect, useReducer } from 'react'
import { calculateWinner, getBoard, getNextPlayer, getStarter, getStatusText, getUndoMoves, isDraw } from '../lib/game'
import { createInitialState, reducer } from '../lib/gameReducer'
import { saveProgress } from '../lib/storage'

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const { moves, scores, round } = state

  useEffect(() => {
    saveProgress({ scores, round })
  }, [scores, round])

  const starter = getStarter(round)
  const board = getBoard(moves, starter)
  const winResult = calculateWinner(board)
  const draw = isDraw(board)
  const gameOver = winResult !== null || draw
  const currentPlayer = gameOver ? null : getNextPlayer(board, starter)
  const isPristine =
    round === 1 && scores.X === 0 && scores.O === 0 && scores.draws === 0 && moves.length === 0

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
    canUndo: !gameOver && getUndoMoves(moves) !== null,
    play: (index: number) => dispatch({ type: 'PLAY', index }),
    newGame: () => dispatch({ type: 'NEW_GAME' }),
    undo: () => dispatch({ type: 'UNDO' }),
    resetScores: () => dispatch({ type: 'RESET_SCORES' }),
  }
}
