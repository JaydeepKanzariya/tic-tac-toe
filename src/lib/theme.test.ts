import { describe, expect, it } from 'vitest'
import { isTheme, nextTheme } from './theme'

describe('theme helpers', () => {
  it('cycles system, light, dark and back', () => {
    expect(nextTheme('system')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('dark')).toBe('system')
  })

  it('recognises valid themes only', () => {
    expect(isTheme('dark')).toBe(true)
    expect(isTheme('sepia')).toBe(false)
    expect(isTheme(null)).toBe(false)
  })
})
