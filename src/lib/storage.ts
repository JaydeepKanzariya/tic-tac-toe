import type { Scores } from '../types'

const STORAGE_KEY = 'tic-tac-toe:progress'

export interface Progress {
  scores: Scores
  round: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || !isRecord(parsed.scores)) {
      return null
    }
    const { X, O, draws } = parsed.scores
    const { round } = parsed
    if (isCount(X) && isCount(O) && isCount(draws) && isCount(round) && round >= 1) {
      return { scores: { X, O, draws }, round }
    }
    return null
  } catch {
    return null
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage may be unavailable or full; the game keeps working in memory.
  }
}
