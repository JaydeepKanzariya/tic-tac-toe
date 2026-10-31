import { afterEach, describe, expect, it, vi } from 'vitest'
import { THEME_KEY, loadProgress, loadTheme, saveProgress, saveTheme } from './storage'

const KEY = 'tic-tac-toe:progress'

function stubStorage(initial: string | null) {
  const store = new Map<string, string>()
  if (initial !== null) {
    store.set(KEY, initial)
  }
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  })
  return store
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadProgress', () => {
  it('returns saved progress', () => {
    stubStorage(JSON.stringify({ scores: { X: 2, O: 1, draws: 3 }, round: 7 }))
    expect(loadProgress()).toEqual({ scores: { X: 2, O: 1, draws: 3 }, round: 7, mode: 'two-player' })
  })

  it('returns a saved mode', () => {
    stubStorage(JSON.stringify({ scores: { X: 0, O: 0, draws: 0 }, round: 1, mode: 'hard' }))
    expect(loadProgress()?.mode).toBe('hard')
  })

  it.each([
    ['missing', null],
    ['invalid JSON', 'not json'],
    ['negative score', JSON.stringify({ scores: { X: -1, O: 0, draws: 0 }, round: 1 })],
    ['fractional score', JSON.stringify({ scores: { X: 1.5, O: 0, draws: 0 }, round: 1 })],
    ['round below 1', JSON.stringify({ scores: { X: 0, O: 0, draws: 0 }, round: 0 })],
    ['unknown mode', JSON.stringify({ scores: { X: 0, O: 0, draws: 0 }, round: 1, mode: 'impossible' })],
    ['wrong shape', JSON.stringify({ X: 1 })],
  ])('returns null for %s', (_name, raw) => {
    stubStorage(raw)
    expect(loadProgress()).toBeNull()
  })

  it('returns null when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
    })
    expect(loadProgress()).toBeNull()
  })
})

describe('saveProgress', () => {
  it('writes JSON', () => {
    const store = stubStorage(null)
    saveProgress({ scores: { X: 1, O: 0, draws: 0 }, round: 2, mode: 'easy' })
    expect(JSON.parse(store.get(KEY) ?? 'null')).toEqual({
      scores: { X: 1, O: 0, draws: 0 },
      round: 2,
      mode: 'easy',
    })
  })

  it('does not throw when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('full')
      },
    })
    expect(() => saveProgress({ scores: { X: 0, O: 0, draws: 0 }, round: 1, mode: 'two-player' })).not.toThrow()
  })
})

describe('theme storage', () => {
  it('returns a saved theme and falls back to system', () => {
    const store = new Map<string, string>([[THEME_KEY, 'dark']])
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    })
    expect(loadTheme()).toBe('dark')
    store.set(THEME_KEY, 'sepia')
    expect(loadTheme()).toBe('system')
    saveTheme('light')
    expect(store.get(THEME_KEY)).toBe('light')
  })

  it('does not throw when storage is unavailable', () => {
    const blocked = () => {
      throw new Error('blocked')
    }
    vi.stubGlobal('localStorage', { getItem: blocked, setItem: blocked })
    expect(loadTheme()).toBe('system')
    expect(() => saveTheme('dark')).not.toThrow()
  })
})
