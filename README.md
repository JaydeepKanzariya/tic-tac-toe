# Tic Tac Toe

A two-player (same device) Tic Tac Toe game built with React, TypeScript and Tailwind CSS v4. It has a scoreboard, alternating starting players and full keyboard support.

Live: https://tic-tac-toe-psi-nine-94.vercel.app/

## Screenshots
| Light | Dark |
|---|---|
| ![Desktop, light mode, mid-game](docs/game-light.png) | ![Desktop, dark mode, X wins](docs/game-dark.png) |

| Mobile (360 px), light | Mobile (360 px), dark |
|---|---|
| ![Mobile, light mode, X wins](docs/mobile-light.png) | ![Mobile, dark mode, mid-game](docs/mobile-dark.png) |

## Features
- 3x3 board of real buttons, X starts round 1, turns alternate
- Winner and draw detection; a win on the 9th move counts as a win
- Winning cells highlighted, other cells dimmed; neutral draw state
- Status line (`aria-live`) and turn indicator chips with a text cue
- Rounds: the starter alternates each round; New game keeps scores
- Scoreboard (X wins, O wins, Draws) persisted in `localStorage` with validation
- X and O differ by shape and colour (rose and sky)
- Light and dark mode follow the system setting, built on semantic design tokens
- Pop-in animation, disabled under `prefers-reduced-motion`

## Tech stack
React, Vite, TypeScript (strict), Tailwind CSS v4, Vitest for tests, oxlint for linting. No other runtime dependencies.

## How to run
```
npm i
npm run dev
npm run build
npm run lint
npm test
```

## Project structure
```
src/
  main.tsx                     # StrictMode entry
  App.tsx                      # header, composes the game, footer
  index.css                    # design tokens (light and dark), Tailwind theme, pop-in keyframes
  types.ts                     # shared types
  lib/game.ts                  # pure game logic
  lib/gameReducer.ts           # pure reducer and initial state
  lib/storage.ts               # safe, validated localStorage access
  lib/*.test.ts                # Vitest unit tests
  hooks/useGame.ts             # reducer, derived values, persistence effect
  hooks/useRovingFocus.ts      # arrow-key navigation across cells
  components/                  # Board, Square, Mark, StatusBar, ScoreBoard, GameControls
```

## Theming
Colours are semantic design tokens declared once in `src/index.css`: CSS variables on `:root` for light, overridden inside `@media (prefers-color-scheme: dark)`, and exposed to Tailwind through `@theme inline` (for example `bg-card`, `text-ink`, `text-ink-muted`, `border-grid`, `bg-accent`, `text-mark-x`). Components never use palette colours or `dark:` variants, so a theme or the accent colour is changed in that one file.

| Token | Used for |
|---|---|
| `page`, `card`, `cell`, `subtle` | page background, card, board cells, score tiles |
| `line`, `grid` | card and chip borders, board grid lines |
| `ink`, `ink-muted` | primary and secondary text |
| `accent`, `accent-hover`, `on-accent`, `accent-soft`, `accent-ink` | buttons, winning cells, active turn chip, title |
| `mark-x`, `mark-o`, `focus` | X and O marks, focus ring |

## How the game logic works
State is one `useReducer` holding `board`, `scores` and `round`. Everything else (starter, current player, winner, draw, status text) is derived on each render. `calculateWinner` checks the 8 `WINNING_LINES` and returns the winner with the winning line, and it is checked before `isDraw`. The pure reducer ignores invalid `PLAY` actions and updates scores in the same transition that ends the game, so a round is counted exactly once, including under StrictMode.

## Testing
`npm test` runs 44 Vitest unit tests for the pure logic: all 8 winning lines for X and O, draw and win-on-move-9, starter alternation, reducer rules (occupied cells, game over, scoring once, New game, Reset scores) and `localStorage` validation (corrupt JSON, negative values, unavailable storage). GitHub Actions (`.github/workflows/ci.yml`) runs lint, tests and build on every push and pull request.

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
- The board is capped at `max-w-sm` so the whole card fits on a typical laptop screen.
- Dark mode follows the system setting only, with no manual toggle.
- Undo and a computer player were not added.

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
