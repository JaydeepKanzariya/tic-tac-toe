import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

export function useRovingFocus(count: number, columns: number) {
  const [activeIndex, setActiveIndex] = useState(0)
  const items = useRef<(HTMLButtonElement | null)[]>([])

  const register = (index: number) => (element: HTMLButtonElement | null) => {
    items.current[index] = element
  }

  const getTarget = (key: string): number | null => {
    const column = activeIndex % columns
    switch (key) {
      case 'ArrowRight':
        return column < columns - 1 ? activeIndex + 1 : null
      case 'ArrowLeft':
        return column > 0 ? activeIndex - 1 : null
      case 'ArrowDown':
        return activeIndex + columns < count ? activeIndex + columns : null
      case 'ArrowUp':
        return activeIndex - columns >= 0 ? activeIndex - columns : null
      case 'Home':
        return 0
      case 'End':
        return count - 1
      default:
        return null
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const target = getTarget(event.key)
    if (target === null) {
      return
    }
    event.preventDefault()
    setActiveIndex(target)
    items.current[target]?.focus()
  }

  return { activeIndex, setActiveIndex, register, onKeyDown }
}
