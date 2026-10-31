export type Player = 'X' | 'O'
export type Cell = Player | null
export type Board = readonly Cell[]

export interface WinResult {
  winner: Player
  line: readonly [number, number, number]
}

export interface Scores {
  X: number
  O: number
  draws: number
}

export interface GameState {
  moves: readonly number[]
  scores: Scores
  round: number
}
