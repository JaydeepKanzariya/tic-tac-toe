import { isTheme } from './theme'
import type { Theme } from './theme'
import { isMode } from './game'
import type { Mode, Scores } from '../types'

const STORAGE_KEY = 'tic-tac-toe:progress'
export const THEME_KEY = 'tic-tac-toe:theme'

export interface Progress {
  scores: Scores
  round: number
  mode: Mode
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
    const mode = parsed.mode === undefined ? 'two-player' : parsed.mode
    if (isCount(X) && isCount(O) && isCount(draws) && isCount(round) && round >= 1 && isMode(mode)) {
      return { scores: { X, O, draws }, round, mode }
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

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    return isTheme(raw) ? raw : 'system'
  } catch {
    return 'system'
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage may be unavailable; the theme still applies for this session.
  }
}
