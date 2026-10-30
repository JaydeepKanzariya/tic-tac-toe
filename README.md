# Tic Tac Toe

A two-player (same device) Tic Tac Toe game built with React, TypeScript and Tailwind CSS v4. It has a scoreboard, alternating starting players and full keyboard support.

Live: <to be added after deploy>

## Features
- 3x3 board of real buttons, X starts round 1, turns alternate
- Winner and draw detection; a win on the 9th move counts as a win
- Winning cells highlighted, other cells dimmed; neutral draw state
- Status line (`aria-live`) and turn indicator chips with a text cue
- Rounds: the starter alternates each round; New game keeps scores
- Scoreboard (X wins, O wins, Draws) persisted in `localStorage` with validation
- X and O differ by shape and colour (rose and sky); light and dark mode
- Pop-in animation, disabled under `prefers-reduced-motion`

## Tech stack
React, Vite, TypeScript (strict), Tailwind CSS v4. No other runtime dependencies.

## How to run
```
npm i
npm run dev
npm run build
npm run lint
```

## Project structure
```
src/
  main.tsx                     # StrictMode entry
  App.tsx                      # header, composes the game, footer
  index.css                    # Tailwind import and pop-in keyframes
  types.ts                     # shared types
  lib/game.ts                  # pure game logic
  lib/storage.ts               # safe, validated localStorage access
  hooks/useGame.ts             # reducer, derived values, persistence effect
  hooks/useRovingFocus.ts      # arrow-key navigation across cells
  components/                  # Board, Square, Mark, StatusBar, ScoreBoard, GameControls
```

## How the game logic works
State is one `useReducer` holding `board`, `scores` and `round`. Everything else (starter, current player, winner, draw, status text) is derived on each render. `calculateWinner` checks the 8 `WINNING_LINES` and returns the winner with the winning line, and it is checked before `isDraw`. The pure reducer ignores invalid `PLAY` actions and updates scores in the same transition that ends the game, so a round is counted exactly once, including under StrictMode.

## Keyboard controls
- `Tab` moves focus onto the board (one cell is in the tab order)
- Arrow keys move between cells; `Home` and `End` jump to the first and last cell
- `Enter` or `Space` places a mark
- `Tab` to the buttons, then `Enter` or `Space` to use them

## Decisions
- After New game, focus stays on the button (simpler, and focus is never lost).
- Reset scores uses `aria-disabled` instead of `disabled`, so focus is not lost when it becomes inactive after a click.
- On reload, scores and round persist; the board starts empty.
- Arrow keys do not wrap around the board edges.
- The Vite scaffold uses `oxlint` for linting, so I kept it instead of adding ESLint.
- Optional extras (tests, undo, computer player) were not added.

## Deploy on Vercel
| Setting | Value |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | `./` (repo root) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js version | latest LTS |

No environment variables are needed.
