import { nextTheme } from '../lib/theme'
import type { Theme } from '../lib/theme'

interface ThemeToggleProps {
  theme: Theme
  onCycle: () => void
}

const LABELS: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' }

function ThemeIcon({ theme }: { theme: Theme }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="h-5 w-5"
    >
      {theme === 'light' && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      )}
      {theme === 'dark' && <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
      {theme === 'system' && (
        <>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </>
      )}
    </svg>
  )
}

export function ThemeToggle({ theme, onCycle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`Theme: ${LABELS[theme]}. Switch to ${LABELS[nextTheme(theme)]}`}
      title={`Theme: ${LABELS[theme]}`}
      className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-xl text-ink-muted outline-none hover:bg-subtle hover:text-ink focus-visible:ring-2 focus-visible:ring-focus"
    >
      <ThemeIcon theme={theme} />
    </button>
  )
}
