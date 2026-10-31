import { useEffect, useState } from 'react'
import { nextTheme } from '../lib/theme'
import { loadTheme, saveTheme } from '../lib/storage'
import type { Theme } from '../lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(loadTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    saveTheme(theme)
  }, [theme])

  return { theme, cycleTheme: () => setTheme(nextTheme) }
}
