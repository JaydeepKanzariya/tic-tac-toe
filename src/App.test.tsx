// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UserEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  cleanup()
})

function cell(row: number, column: number, state = 'empty') {
  return screen.getByRole('button', { name: new RegExp(`^Row ${row}, column ${column}, ${state}`) })
}

function button(name: string) {
  return screen.getByRole('button', { name })
}

function status() {
  return document.querySelector('[aria-live]')?.textContent
}

function round() {
  return screen.getByText(/^Round\b/).textContent
}

function score(label: string) {
  return screen.getByText(label).nextElementSibling?.textContent
}

async function playAll(user: UserEvent, moves: readonly (readonly [number, number])[]) {
  for (const [row, column] of moves) {
    await user.click(cell(row, column))
  }
}

const X_WINS_TOP_ROW = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
  [1, 3],
] as const

const DRAW = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 2],
  [2, 1],
  [2, 3],
  [3, 2],
  [3, 1],
  [3, 3],
] as const

describe('board and turns', () => {
  it('starts with an empty 3x3 board and X to move', () => {
    render(<App />)
    expect(screen.getAllByRole('button', { name: /^Row \d, column \d, empty$/ })).toHaveLength(9)
    expect(status()).toBe("Player X's turn")
  })

  it('alternates turns and ignores clicks on filled cells', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(cell(2, 2))
    expect(cell(2, 2, 'X')).toBeTruthy()
    expect(status()).toBe("Player O's turn")
    await user.click(cell(2, 2, 'X'))
    expect(status()).toBe("Player O's turn")
    await user.click(cell(1, 1))
    expect(cell(1, 1, 'O')).toBeTruthy()
  })

  it('detects a win, flags the winning cells and counts it once', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playAll(user, X_WINS_TOP_ROW)
    expect(status()).toBe('Player X wins!')
    expect(screen.getAllByRole('button', { name: /, X, winning cell$/ })).toHaveLength(3)
    expect(score('X wins')).toBe('1')
    await user.click(cell(3, 3))
    expect(cell(3, 3, 'empty')).toBeTruthy()
    expect(score('X wins')).toBe('1')
  })

  it('detects a draw', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playAll(user, DRAW)
    expect(status()).toBe("It's a draw!")
    expect(score('Draws')).toBe('1')
  })
})

describe('keyboard', () => {
  it('moves focus with the arrow keys, Home and End', async () => {
    const user = userEvent.setup()
    render(<App />)
    act(() => cell(1, 1).focus())
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(cell(1, 2))
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(cell(2, 2))
    await user.keyboard('{End}')
    expect(document.activeElement).toBe(cell(3, 3))
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(cell(3, 3))
    await user.keyboard('{Home}')
    expect(document.activeElement).toBe(cell(1, 1))
  })

  it('places a mark with Enter', async () => {
    const user = userEvent.setup()
    render(<App />)
    act(() => cell(2, 2).focus())
    await user.keyboard('{Enter}')
    expect(cell(2, 2, 'X')).toBeTruthy()
  })
})

describe('rounds, undo and reset', () => {
  it('starts a new round with the other player and keeps the scores', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playAll(user, X_WINS_TOP_ROW)
    await user.click(button('New game'))
    expect(round()).toBe('Round 2 · Player O starts')
    expect(status()).toBe("Player O's turn")
    expect(score('X wins')).toBe('1')
  })

  it('undoes the last move, and is unavailable when there is none', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(button('Undo').getAttribute('aria-disabled')).toBe('true')
    await user.click(cell(1, 1))
    await user.click(cell(2, 2))
    expect(button('Undo').getAttribute('aria-disabled')).toBe('false')
    await user.click(button('Undo'))
    expect(cell(2, 2, 'empty')).toBeTruthy()
    expect(cell(1, 1, 'X')).toBeTruthy()
    expect(status()).toBe("Player O's turn")
  })

  it('asks before resetting scores and returns focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playAll(user, X_WINS_TOP_ROW)

    await user.click(button('Reset scores'))
    expect(screen.getByRole('group', { name: 'Confirm reset scores' })).toBeTruthy()
    expect(document.activeElement).toBe(button('Cancel'))

    await user.click(button('Cancel'))
    expect(score('X wins')).toBe('1')
    expect(document.activeElement).toBe(button('Reset scores'))

    await user.click(button('Reset scores'))
    await user.click(button('Yes, reset'))
    expect(score('X wins')).toBe('0')
    expect(round()).toBe('Round 1 · Player X starts')
  })

  it('cancels the reset prompt with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(cell(1, 1))
    await user.click(button('Reset scores'))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('group', { name: 'Confirm reset scores' })).toBeNull()
  })
})

describe('computer opponent', () => {
  async function setup() {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText('Opponent'), 'easy')
    return user
  }

  async function waitForPlayerTurn() {
    await waitFor(() => expect(status()).toBe('Your turn'), { timeout: 3000 })
  }

  it('replies after the human move and blocks clicks while it thinks', async () => {
    const user = await setup()
    await user.click(cell(2, 2))
    expect(status()).toBe("Computer's turn")
    await user.click(cell(1, 1))
    expect(cell(1, 1, 'empty')).toBeTruthy()
    await waitForPlayerTurn()
    expect(screen.getAllByRole('button', { name: /, O$/ })).toHaveLength(1)
  })

  it('moves first in round 2', async () => {
    const user = await setup()
    await user.click(button('New game'))
    expect(status()).toBe("Computer's turn")
    await waitForPlayerTurn()
    expect(screen.getAllByRole('button', { name: /, O$/ })).toHaveLength(1)
  })

  it('undo takes back both the move and the reply', async () => {
    const user = await setup()
    await user.click(cell(2, 2))
    await waitForPlayerTurn()
    await user.click(button('Undo'))
    expect(screen.getAllByRole('button', { name: /^Row \d, column \d, empty$/ })).toHaveLength(9)
  })

  it('switching opponent starts a fresh scoreboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playAll(user, X_WINS_TOP_ROW)
    await user.selectOptions(screen.getByLabelText('Opponent'), 'hard')
    expect(score('X wins')).toBe('0')
    expect(round()).toBe('Round 1 · You starts')
  })
})

describe('theme toggle', () => {
  it('cycles light, dark and system, and stores the choice', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = () => screen.getByRole('button', { name: /^Theme:/ })

    await user.click(toggle())
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('tic-tac-toe:theme')).toBe('light')

    await user.click(toggle())
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    await user.click(toggle())
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    expect(localStorage.getItem('tic-tac-toe:theme')).toBe('system')
  })
})

describe('persistence', () => {
  it('restores scores, round and opponent after a reload', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await user.selectOptions(screen.getByLabelText('Opponent'), 'two-player')
    await playAll(user, X_WINS_TOP_ROW)
    await user.click(button('New game'))
    first.unmount()

    render(<App />)
    expect(score('X wins')).toBe('1')
    expect(round()).toBe('Round 2 · Player O starts')
    expect(cell(1, 1, 'empty')).toBeTruthy()
  })

  it('remembers the opponent', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await user.selectOptions(screen.getByLabelText('Opponent'), 'hard')
    first.unmount()

    render(<App />)
    const select = screen.getByLabelText('Opponent')
    expect(select instanceof HTMLSelectElement && select.value).toBe('hard')
  })
})
