import { describe, expect, it } from 'vitest'
import { createEmptyBoard } from './game'
import { reducer } from './gameReducer'
import type { GameState } from '../types'

const fresh: GameState = { board: createEmptyBoard(), scores: { X: 0, O: 0, draws: 0 }, round: 1 }

function play(state: GameState, ...moves: number[]): GameState {
  return moves.reduce((next, index) => reducer(next, { type: 'PLAY', index }), state)
}

describe('reducer PLAY', () => {
  it('places X first in round 1 and alternates', () => {
    const state = play(fresh, 0, 1)
    expect(state.board[0]).toBe('X')
    expect(state.board[1]).toBe('O')
  })

  it('starts with O in round 2', () => {
    expect(play({ ...fresh, round: 2 }, 4).board[4]).toBe('O')
  })

  it('ignores occupied cells and invalid indexes', () => {
    const once = play(fresh, 0)
    expect(reducer(once, { type: 'PLAY', index: 0 })).toBe(once)
    expect(reducer(once, { type: 'PLAY', index: 9 })).toBe(once)
    expect(reducer(once, { type: 'PLAY', index: -1 })).toBe(once)
    expect(reducer(once, { type: 'PLAY', index: 1.5 })).toBe(once)
  })

  it('does not mutate the previous board', () => {
    const before = fresh.board
    play(fresh, 0)
    expect(before.every((cell) => cell === null)).toBe(true)
  })

  it('counts a win once and locks the board', () => {
    const won = play(fresh, 0, 3, 1, 4, 2)
    expect(won.scores).toEqual({ X: 1, O: 0, draws: 0 })
    expect(reducer(won, { type: 'PLAY', index: 8 })).toBe(won)
  })

  it('counts a draw once', () => {
    const drawn = play(fresh, 0, 1, 2, 4, 3, 5, 7, 6, 8)
    expect(drawn.scores).toEqual({ X: 0, O: 0, draws: 1 })
  })

  it('counts a win on move 9 as a win', () => {
    const won = play(fresh, 0, 1, 2, 3, 4, 5, 7, 6, 8)
    expect(won.scores).toEqual({ X: 1, O: 0, draws: 0 })
  })
})

describe('reducer NEW_GAME and RESET_SCORES', () => {
  it('clears the board, keeps scores and advances the round', () => {
    const next = reducer(play(fresh, 0, 3, 1, 4, 2), { type: 'NEW_GAME' })
    expect(next.board.every((cell) => cell === null)).toBe(true)
    expect(next.scores.X).toBe(1)
    expect(next.round).toBe(2)
  })

  it('advances the round even mid-round without scoring it', () => {
    const next = reducer(play(fresh, 0), { type: 'NEW_GAME' })
    expect(next.scores).toEqual({ X: 0, O: 0, draws: 0 })
    expect(next.round).toBe(2)
  })

  it('resets scores and the round', () => {
    const next = reducer(play({ ...fresh, round: 4 }, 0), { type: 'RESET_SCORES' })
    expect(next).toEqual(fresh)
  })
})
