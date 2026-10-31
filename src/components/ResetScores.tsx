import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from './buttonStyles'

interface ResetScoresProps {
  canReset: boolean
  onReset: () => void
}

export function ResetScores({ canReset, onReset }: ResetScoresProps) {
  const [confirming, setConfirming] = useState(false)
  const openRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)

  useEffect(() => {
    if (confirming) {
      cancelRef.current?.focus()
    } else if (restoreFocus.current) {
      restoreFocus.current = false
      openRef.current?.focus()
    }
  }, [confirming])

  const close = () => {
    restoreFocus.current = true
    setConfirming(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      close()
    }
  }

  if (confirming) {
    return (
      <div
        role="group"
        aria-label="Confirm reset scores"
        onKeyDown={onKeyDown}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-sm text-ink">Reset all scores and start over?</p>
        <div className="flex gap-3">
          <button ref={cancelRef} type="button" onClick={close} className={BUTTON_SECONDARY}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onReset()
              close()
            }}
            className={BUTTON_PRIMARY}
          >
            Yes, reset
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <button
        ref={openRef}
        type="button"
        aria-disabled={!canReset}
        onClick={() => {
          if (canReset) {
            setConfirming(true)
          }
        }}
        className={`min-h-11 rounded-xl px-4 text-sm font-semibold underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-focus ${canReset ? 'text-ink-muted hover:text-ink' : 'cursor-not-allowed text-ink-muted opacity-50'}`}
      >
        Reset scores
      </button>
    </div>
  )
}
