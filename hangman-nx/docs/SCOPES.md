# SCOPES.md — Gamified Hangman Game
**Project:** Hangman Educational Module
**Stack:** React + TypeScript (strict) + NX Monorepo
**Total Phases:** 4 | **Total Sprints:** 12

---

## Table of Contents

- [Phase 1 — Foundation & Scaffolding](#phase-1--foundation--scaffolding)
  - [Sprint 1 — NX Workspace Setup](#sprint-1--nx-workspace-setup)
  - [Sprint 2 — Start Screen](#sprint-2--start-screen)
- [Phase 2 — Data, Types & UI Shell](#phase-2--data-types--ui-shell)
  - [Sprint 3 — Data Integration](#sprint-3--data-integration)
  - [Sprint 4 — TypeScript Types](#sprint-4--typescript-types)
  - [Sprint 5 — Game UI Shell](#sprint-5--game-ui-shell)
- [Phase 3 — Core Logic & Feature Build](#phase-3--core-logic--feature-build)
  - [Sprint 6 — useGame Hook (State Init)](#sprint-6--usegame-hook-state-init)
  - [Sprint 7 — Guess Logic](#sprint-7--guess-logic)
  - [Sprint 8 — Hangman SVG Animation](#sprint-8--hangman-svg-animation)
  - [Sprint 9 — Keyboard Component](#sprint-9--keyboard-component)
  - [Sprint 10 — Hint System](#sprint-10--hint-system)
  - [Sprint 11 — Result Modal](#sprint-11--result-modal)
- [Phase 4 — UI Polish & Gamification](#phase-4--ui-polish--gamification)
  - [Sprint 12 — UI Polish & Dark Theme](#sprint-12--ui-polish--dark-theme)
- [Master File Tree](#master-file-tree)
- [Sprint Completion Checklist](#sprint-completion-checklist)

---

---

## Phase 1 — Foundation & Scaffolding

**Sprints:** 1–2
**Goal:** Runnable NX workspace with a working Start Screen
**Deliverables:** `nx serve hangman-app` runs clean, player name captured in state

---

### Sprint 1 — NX Workspace Setup

**Phase:** 1 of 4
**Goal:** Bootstrap the full monorepo so the team can start from a clean, typed, structured base.

#### ⚠️ Rules

- Do NOT create any components
- Do NOT add any logic
- Do NOT add any styling
- Only infrastructure and configuration

#### Tasks

1. Install NX CLI globally
   ```bash
   npm install -g nx
   ```

2. Create NX workspace
   ```bash
   npx create-nx-workspace@latest hangman-nx \
     --preset=react-ts \
     --appName=hangman-app \
     --style=css \
     --nxCloud=false
   ```

3. Generate `ui-components` library
   ```bash
   cd hangman-nx
   nx generate @nx/react:library ui-components \
     --directory=libs/ui-components \
     --unitTestRunner=none \
     --bundler=none
   ```

4. Generate `game-logic` library
   ```bash
   nx generate @nx/react:library game-logic \
     --directory=libs/game-logic \
     --unitTestRunner=none \
     --bundler=none
   ```

5. Configure NX path aliases in `tsconfig.base.json`
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@hangman/ui-components": ["libs/ui-components/src/index.ts"],
         "@hangman/game-logic":    ["libs/game-logic/src/index.ts"]
       }
     }
   }
   ```

6. Enable strict TypeScript across all `tsconfig.json` files
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

7. Verify app serves
   ```bash
   nx serve hangman-app
   ```

#### Files Created

| File | Location | Description |
|------|----------|-------------|
| `nx.json` | `root` | NX workspace configuration |
| `package.json` | `root` | Dependencies and scripts |
| `tsconfig.base.json` | `root` | Path aliases for @hangman/* |
| `project.json` | `apps/hangman-app` | App project definition |
| `project.json` | `libs/ui-components` | Library project definition |
| `project.json` | `libs/game-logic` | Library project definition |
| `index.ts` | `libs/ui-components/src` | Barrel — empty for now |
| `index.ts` | `libs/game-logic/src` | Barrel — empty for now |

#### Acceptance Criteria

- [ ] `nx serve hangman-app` runs without errors
- [ ] `nx graph` shows 3 projects (app + 2 libs)
- [ ] `@hangman/ui-components` and `@hangman/game-logic` path aliases resolve
- [ ] TypeScript strict mode enabled in all tsconfigs
- [ ] Default NX welcome screen renders in browser

> ⛔ **STOP** — Do not proceed to Sprint 2 until `nx serve` runs cleanly with zero errors.

---

### Sprint 2 — Start Screen

**Phase:** 1 of 4
**Goal:** Build the entry screen where the player enters their name before the game begins.

#### ⚠️ Rules

- Do NOT implement game logic
- Do NOT add JSON data
- Do NOT create extra components
- Do NOT style heavily — basic layout only

#### Tasks

1. Create `StartScreen.tsx` in `libs/ui-components/src/StartScreen/`
   - Controlled input: `playerName` local state, placeholder `"Enter your name..."`
   - Start button: disabled when `playerName.trim() === ''`
   - On click: call `props.onStart(playerName.trim())`

2. Create `StartScreen.module.css`
   - Full-viewport centered layout
   - Dark background `#0f0f1a`
   - Rounded card container
   - Input: large, readable, focus ring
   - Button: accent color, disabled state greyed out

3. Export from `libs/ui-components/src/index.ts`
   ```typescript
   export { StartScreen } from './StartScreen/StartScreen';
   ```

4. Define inline props interface (temporary — moved to `game-logic` in Sprint 4)
   ```typescript
   interface StartScreenProps {
     onStart: (name: string) => void;
   }
   ```

5. Update `App.tsx`
   - Add `playerName` state: `useState<string>('')`
   - Add `gameStarted` state: `useState<boolean>(false)`
   - Render `<StartScreen onStart={...} />` when `!gameStarted`
   - Render placeholder `<div>Game coming soon</div>` when `gameStarted`

#### Files Created

| File | Location | Description |
|------|----------|-------------|
| `StartScreen.tsx` | `libs/ui-components/src/StartScreen` | Controlled input + start button |
| `StartScreen.module.css` | `libs/ui-components/src/StartScreen` | Centered card, dark background |
| `index.ts` (updated) | `libs/ui-components/src` | `export { StartScreen }` |
| `App.tsx` (updated) | `apps/hangman-app/src/app` | `playerName` + `gameStarted` state |

#### Acceptance Criteria

- [ ] Start Screen renders at app launch
- [ ] Start button is disabled when name input is empty
- [ ] Clicking Start fires `onStart(name)` and stores name in `App` state
- [ ] `App.tsx` transitions to placeholder view after start
- [ ] Zero TypeScript errors

> ⛔ **STOP** — Phase 1 complete. App scaffolded, Start Screen functional.

---

---

## Phase 2 — Data, Types & UI Shell

**Sprints:** 3–5
**Goal:** Game board renders with real level data (static, no interactivity yet)
**Deliverables:** `data.json` loaded, all TypeScript types defined, full UI layout visible

---

### Sprint 3 — Data Integration

**Phase:** 2 of 4
**Goal:** Load game data from a local JSON file and randomly select a level on game start.

#### ⚠️ Rules

- Do NOT implement any game logic
- Do NOT modify the data schema
- Do NOT fetch from any API
- Use static import only

#### Tasks

1. Create `apps/hangman-app/src/assets/data.json` with 5+ Science Class 10 levels
   ```json
   {
     "subject": "Science - Class 10",
     "levels": [
       {
         "id": 1,
         "word": "PHOTOSYNTHESIS",
         "clue": "Process by which plants make food using sunlight",
         "hints": [
           "Occurs in leaves",
           "Uses carbon dioxide and water",
           "Produces oxygen"
         ],
         "maxAttempts": 6,
         "baseScore": 500
       }
     ]
   }
   ```
   > ⚠️ Schema is LOCKED — do not rename or add any fields.

2. Enable JSON imports in `apps/hangman-app/tsconfig.json`
   ```json
   {
     "compilerOptions": {
       "resolveJsonModule": true,
       "esModuleInterop": true
     }
   }
   ```

3. Create `apps/hangman-app/src/utils/loadLevel.ts`
   ```typescript
   import gameData from '../assets/data.json';

   export function getRandomLevel() {
     const { levels } = gameData;
     return levels[Math.floor(Math.random() * levels.length)];
   }
   ```

4. Update `App.tsx`
   - Import `getRandomLevel`
   - Add `selectedLevel` state
   - On `onStart` callback: call `getRandomLevel()`, store result in state
   - `console.log(selectedLevel)` to verify

#### Files Created

| File | Location | Description |
|------|----------|-------------|
| `data.json` | `apps/hangman-app/src/assets` | 5+ Science levels, locked schema |
| `loadLevel.ts` | `apps/hangman-app/src/utils` | `getRandomLevel()` random picker |
| `App.tsx` (updated) | `apps/hangman-app/src/app` | `selectedLevel` state added |

#### Acceptance Criteria

- [ ] `data.json` exists with 5+ levels following the exact schema
- [ ] `getRandomLevel()` returns a different level on repeated calls
- [ ] Selected level logged to console on game start
- [ ] `resolveJsonModule` works — no TypeScript errors

> ⛔ **STOP** — Do not add types (Sprint 4) or render the game board (Sprint 5) yet.

---

### Sprint 4 — TypeScript Types

**Phase:** 2 of 4
**Goal:** Define all TypeScript interfaces and types in the `game-logic` library. Types only — no UI, no logic.

#### ⚠️ Rules

- Use strict TypeScript throughout — no `any`
- Do NOT implement any UI
- Do NOT implement any logic
- Types must exactly mirror the `data.json` schema

#### Tasks

1. Create `libs/game-logic/src/types/game.types.ts`

   ```typescript
   // ── Data types (mirror data.json exactly) ─────────────
   export interface GameLevel {
     id: number;
     word: string;
     clue: string;
     hints: string[];
     maxAttempts: number;
     baseScore: number;
   }

   export interface GameData {
     subject: string;
     levels: GameLevel[];
   }

   // ── Game state types ───────────────────────────────────
   export type GameResult = 'win' | 'lose' | null;

   export interface GameState {
     wordDisplay: string[];
     attempts: number;
     maxAttempts: number;
     score: number;
     guesses: Set<string>;
     hintIndex: number;
     result: GameResult;
     revealedHints: string[];
   }

   // ── Hook return type ───────────────────────────────────
   export interface UseGameReturn extends GameState {
     level: GameLevel;
     guessLetter: (letter: string) => void;
     showHint: () => void;
     restart: () => void;
   }

   // ── Component prop types ───────────────────────────────
   export interface StartScreenProps {
     onStart: (playerName: string) => void;
   }

   export interface GameBoardProps {
     playerName: string;
     levelData: GameLevel;
     onRestart: () => void;
   }

   export interface HangmanCanvasProps {
     wrongAttempts: number;
     maxAttempts: number;
   }

   export interface WordDisplayProps {
     wordDisplay: string[];
   }

   export interface KeyboardProps {
     guesses: Set<string>;
     onGuess: (letter: string) => void;
     disabled: boolean;
   }

   export interface HintBoxProps {
     hints: string[];
     revealedHints: string[];
     onShowHint: () => void;
     disabled: boolean;
   }

   export interface ScoreBoardProps {
     playerName: string;
     score: number;
     attempts: number;
     maxAttempts: number;
   }

   export interface ResultModalProps {
     result: GameResult;
     word: string;
     score: number;
     onRestart: () => void;
   }
   ```

2. Create `libs/game-logic/src/constants/game.constants.ts`
   ```typescript
   export const SCORE_DEDUCTION_WRONG = 20;
   export const SCORE_DEDUCTION_HINT  = 20;
   export const MIN_SCORE             = 0;
   export const MAX_ATTEMPTS          = 6;
   export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as string[];
   ```

3. Update `libs/game-logic/src/index.ts` — export everything
   ```typescript
   export type {
     GameLevel, GameData, GameState, GameResult, UseGameReturn,
     StartScreenProps, GameBoardProps, HangmanCanvasProps,
     WordDisplayProps, KeyboardProps, HintBoxProps,
     ScoreBoardProps, ResultModalProps
   } from './types/game.types';

   export {
     SCORE_DEDUCTION_WRONG, SCORE_DEDUCTION_HINT,
     MIN_SCORE, MAX_ATTEMPTS, ALPHABET
   } from './constants/game.constants';
   ```

4. Update `StartScreen.tsx` — replace inline interface with imported type
   ```typescript
   import type { StartScreenProps } from '@hangman/game-logic';
   ```

5. Update `loadLevel.ts` — add return type annotation
   ```typescript
   import type { GameLevel } from '@hangman/game-logic';
   export function getRandomLevel(): GameLevel { ... }
   ```

#### Files Created

| File | Location | Description |
|------|----------|-------------|
| `game.types.ts` | `libs/game-logic/src/types` | All interfaces + 8 prop types |
| `game.constants.ts` | `libs/game-logic/src/constants` | SCORE_DEDUCTION, ALPHABET, etc. |
| `index.ts` (updated) | `libs/game-logic/src` | Full type + constant exports |
| `StartScreen.tsx` (updated) | `libs/ui-components/src/StartScreen` | Uses imported `StartScreenProps` |
| `loadLevel.ts` (updated) | `apps/hangman-app/src/utils` | Return type `GameLevel` |

#### Acceptance Criteria

- [ ] All 8 prop interfaces defined with correct field types
- [ ] `GameLevel` exactly matches `data.json` schema
- [ ] `game-logic` barrel exports all types and constants
- [ ] `StartScreen.tsx` and `loadLevel.ts` use imported types
- [ ] Zero TypeScript errors, zero `any` usage anywhere

> ⛔ **STOP** — No hook, no UI, no logic yet.

---

### Sprint 5 — Game UI Shell

**Phase:** 2 of 4
**Goal:** Render a fully laid-out but non-interactive game board with static/placeholder values.

#### ⚠️ Rules

- Do NOT implement logic
- Do NOT add event handlers (except the placeholder pass-through)
- Only UI rendering with props
- No state inside any component

#### Tasks

1. Create `ScoreBoard.tsx`
   - Displays: player name, score, attempts remaining
   - Includes: static attempts progress bar (width = attempts/maxAttempts %)
   - Props: `ScoreBoardProps`

2. Create `WordDisplay.tsx`
   - Maps over `wordDisplay[]` array
   - Each char rendered as large letter or styled underscore `_`
   - Letters spaced generously with bottom border as underline

3. Create `HangmanCanvas.tsx`
   - Static SVG: gallows only (base, pole, beam, rope)
   - Dynamic body part `<g>` elements stubbed empty (filled in Sprint 8)
   - `viewBox="0 0 200 250"`, `width="100%"`

4. Create `HintBox.tsx`
   - `"💡 Show Hint"` button (disabled for now)
   - Empty hint display area
   - Label: `"Hints used: 0 / 3"`

5. Create `Keyboard.tsx`
   - 26 A–Z buttons in a 4-row grid
   - All enabled (interactivity wired in Sprint 9)

6. Create `GameBoard.tsx` — assemble all components
   ```
   ┌──────────────────────────────────┐
   │         ScoreBoard               │
   ├──────────────┬───────────────────┤
   │ HangmanCanvas│   WordDisplay     │
   │              │   Clue text       │
   │              │   HintBox         │
   ├──────────────┴───────────────────┤
   │              Keyboard            │
   └──────────────────────────────────┘
   ```
   - Receives `GameBoardProps`
   - Passes static values to children (live state from `useGame` in Sprint 6)

7. Export all 6 new components from `libs/ui-components/src/index.ts`

8. Wire `GameBoard` into `App.tsx`
   - Render `<GameBoard>` when `gameStarted === true`
   - Pass `playerName` and `selectedLevel` as props

#### Files Created

| File | Location | Description |
|------|----------|-------------|
| `ScoreBoard.tsx` + `.module.css` | `libs/ui-components/src/ScoreBoard` | Name, score, static progress bar |
| `WordDisplay.tsx` + `.module.css` | `libs/ui-components/src/WordDisplay` | Blank dashes per letter |
| `HangmanCanvas.tsx` | `libs/ui-components/src/HangmanCanvas` | Gallows SVG only |
| `HintBox.tsx` + `.module.css` | `libs/ui-components/src/HintBox` | Disabled button + hint area |
| `Keyboard.tsx` + `.module.css` | `libs/ui-components/src/Keyboard` | 26 A–Z buttons |
| `GameBoard.tsx` + `.module.css` | `libs/ui-components/src/GameBoard` | Layout grid, assembles all |
| `index.ts` (updated) | `libs/ui-components/src` | All 6 components exported |
| `App.tsx` (updated) | `apps/hangman-app/src/app` | GameBoard rendered on start |

#### Acceptance Criteria

- [ ] GameBoard renders after Start Screen
- [ ] Word shows correct number of blanks (one per letter in level word)
- [ ] Clue text from level data displays correctly
- [ ] All 5 sub-components visible in layout
- [ ] No event handlers, no component-level state
- [ ] Zero TypeScript errors

> ⛔ **STOP** — Phase 2 complete. UI shell visible, data flowing, types solid.

---

---

## Phase 3 — Core Logic & Feature Build

**Sprints:** 6–11
**Goal:** Build every game feature until the game is fully playable end-to-end
**Deliverables:** `useGame` hook, guess/hint/win/lose logic, SVG animation, keyboard, result modal

---

### Sprint 6 — useGame Hook (State Init)

**Phase:** 3 of 4
**Goal:** Create the central game hook that owns all state and exposes all actions.

#### ⚠️ Rules

- Do NOT modify any UI component
- Do NOT connect components yet
- State initialisation only — action functions are stubs

#### Tasks

1. Create `libs/game-logic/src/hooks/useGame.ts`
   ```typescript
   export function useGame(level: GameLevel): UseGameReturn {
     const [wordDisplay, setWordDisplay] = useState<string[]>(
       level.word.split('').map(() => '_')
     );
     const [attempts,  setAttempts]  = useState<number>(level.maxAttempts);
     const [score,     setScore]     = useState<number>(level.baseScore);
     const [guesses,   setGuesses]   = useState<Set<string>>(new Set());
     const [hintIndex, setHintIndex] = useState<number>(0);
     const [result,    setResult]    = useState<GameResult>(null);

     const revealedHints = level.hints.slice(0, hintIndex);
     const maxAttempts   = level.maxAttempts;

     const guessLetter = (_letter: string) => {};  // Sprint 7
     const showHint    = () => {};                 // Sprint 10
     const restart     = () => {};                 // Sprint 7

     return { wordDisplay, attempts, maxAttempts, score, guesses,
              hintIndex, result, revealedHints, level,
              guessLetter, showHint, restart };
   }
   ```

2. Export `useGame` from `game-logic` barrel
   ```typescript
   export { useGame } from './hooks/useGame';
   ```

3. Connect `useGame` inside `GameBoard.tsx`
   ```typescript
   const game = useGame(props.levelData);
   ```
   Replace all hardcoded/static values with live `game.*` props passed to children.

#### Files Created

| File | Location | Description |
|------|----------|-------------|
| `useGame.ts` | `libs/game-logic/src/hooks` | All state, stub action functions |
| `index.ts` (updated) | `libs/game-logic/src` | `export { useGame }` |
| `GameBoard.tsx` (updated) | `libs/ui-components/src/GameBoard` | Calls `useGame`, passes live state |

#### Acceptance Criteria

- [ ] `useGame` initialises `wordDisplay` as correct-length array of `'_'`
- [ ] `score` starts at `level.baseScore` (500)
- [ ] `attempts` starts at `level.maxAttempts` (6)
- [ ] `GameBoard` passes live hook state to all children
- [ ] Zero TypeScript errors, zero `any`

> ⛔ **STOP** — Hook wired and state flowing. Actions come next sprint.

---

### Sprint 7 — Guess Logic

**Phase:** 3 of 4
**Goal:** Make letter guessing fully functional — reveal correct letters, penalise wrong guesses, detect win/lose.

#### ⚠️ Rules

- Modify ONLY `useGame.ts`
- Do NOT change any UI component
- Do NOT move state anywhere else

#### Tasks

1. Implement `guessLetter(letter: string)` in `useGame.ts`

   Guard conditions first:
   ```typescript
   if (guesses.has(letter)) return;
   if (result !== null) return;
   ```

   Correct guess path:
   ```typescript
   const newGuesses = new Set(guesses).add(letter);
   setGuesses(newGuesses);
   const newDisplay = wordDisplay.map((ch, i) =>
     level.word[i] === letter ? letter : ch
   );
   setWordDisplay(newDisplay);
   if (!newDisplay.includes('_')) setResult('win');
   ```

   Wrong guess path:
   ```typescript
   setGuesses(new Set(guesses).add(letter));
   setAttempts(prev => prev - 1);
   setScore(prev => Math.max(MIN_SCORE, prev - SCORE_DEDUCTION_WRONG));
   if (attempts - 1 === 0) setResult('lose');
   ```

2. Implement `restart()` in `useGame.ts`
   ```typescript
   const restart = () => {
     setWordDisplay(level.word.split('').map(() => '_'));
     setAttempts(level.maxAttempts);
     setScore(level.baseScore);
     setGuesses(new Set());
     setHintIndex(0);
     setResult(null);
   };
   ```

3. Pass `game.guessLetter` into `Keyboard` via `GameBoard` props chain

#### Files Updated

| File | Location | Changes |
|------|----------|---------|
| `useGame.ts` (updated) | `libs/game-logic/src/hooks` | `guessLetter()` + `restart()` implemented |

#### Acceptance Criteria

- [ ] Clicking a correct letter reveals it in `WordDisplay`
- [ ] Clicking a wrong letter decrements attempts and deducts 20 from score
- [ ] Score never goes below 0
- [ ] Guessing all letters sets `result = 'win'`
- [ ] Exhausting all attempts sets `result = 'lose'`
- [ ] Already-guessed letters are ignored
- [ ] `restart()` resets all state to initial values

> ⛔ **STOP** — Core gameplay loop is complete.

---

### Sprint 8 — Hangman SVG Animation

**Phase:** 3 of 4
**Goal:** Implement the animated SVG hangman that draws body parts progressively with each wrong guess.

#### ⚠️ Rules

- SVG only — no images
- No external animation libraries
- CSS animations only (`@keyframes`)
- Minimal, friendly design — not scary

#### Tasks

1. Complete `HangmanCanvas.tsx` with full SVG

   Static structure (always visible):
   ```svg
   <!-- Base  --> <line x1="20"  y1="230" x2="180" y2="230"/>
   <!-- Pole  --> <line x1="60"  y1="230" x2="60"  y2="20" />
   <!-- Beam  --> <line x1="60"  y1="20"  x2="140" y2="20" />
   <!-- Rope  --> <line x1="140" y1="20"  x2="140" y2="50" />
   ```

   Dynamic body parts — shown when `wrongAttempts >= N`:

   | N | Part | SVG Element |
   |---|------|-------------|
   | 1 | Head | `<circle cx="140" cy="70" r="20"/>` |
   | 2 | Body | `<line x1="140" y1="90" x2="140" y2="150"/>` |
   | 3 | Left arm | `<line x1="140" y1="110" x2="110" y2="140"/>` |
   | 4 | Right arm | `<line x1="140" y1="110" x2="170" y2="140"/>` |
   | 5 | Left leg | `<line x1="140" y1="150" x2="110" y2="190"/>` |
   | 6 | Right leg | `<line x1="140" y1="150" x2="170" y2="190"/>` |

2. Calculate `wrongAttempts` from props
   ```typescript
   const wrongAttempts = props.maxAttempts - props.attempts;
   ```

3. Add CSS fade-in animation (no external libs)
   ```css
   @keyframes fadeIn {
     from { opacity: 0; transform: scale(0.8); }
     to   { opacity: 1; transform: scale(1); }
   }
   .bodyPart {
     animation: fadeIn 0.4s ease-out forwards;
     stroke-linecap: round;
     stroke-linejoin: round;
     stroke: #e0e0e0;
     stroke-width: 4;
     fill: none;
   }
   ```

4. SVG setup
   - `viewBox="0 0 200 250"`, `width="100%"`
   - All strokes: `stroke-linecap="round"` `stroke-linejoin="round"`

#### Files Updated

| File | Location | Changes |
|------|----------|---------|
| `HangmanCanvas.tsx` (completed) | `libs/ui-components/src/HangmanCanvas` | Full SVG with 6 animated body parts |

#### Acceptance Criteria

- [ ] All 4 static gallows parts always visible
- [ ] Each wrong guess draws exactly one new body part in order
- [ ] Body parts appear with smooth fade-in (CSS only)
- [ ] `stroke-linecap: round` on all lines
- [ ] Friendly appearance — no gore
- [ ] Responsive inside container

> ⛔ **STOP** — Hangman animation complete.

---

### Sprint 9 — Keyboard Component

**Phase:** 3 of 4
**Goal:** Make the A–Z keyboard fully interactive with correct visual states for every letter.

#### ⚠️ Rules

- No logic inside the UI component
- Use props only
- CSS transitions only — no external libs

#### Tasks

1. Complete `Keyboard.tsx`

   Layout — 4-row alphabetical grid:
   ```
   Row 1: A B C D E F G
   Row 2: H I J K L M N
   Row 3: O P Q R S T U
   Row 4: V W X Y Z
   ```

2. Button state classifier
   ```typescript
   const getButtonState = (letter: string): 'default' | 'correct' | 'wrong' => {
     if (!props.guesses.has(letter)) return 'default';
     return props.level.word.includes(letter) ? 'correct' : 'wrong';
   };
   ```

3. Visual states

   | State | Style |
   |-------|-------|
   | Default | Dark card, white text, hover glow |
   | Correct | Green background `#22c55e` |
   | Wrong | Red/dimmed background |
   | Game over | All greyed, `pointer-events: none` |

4. CSS hover and press effects
   ```css
   .key:hover:not(:disabled) {
     transform: translateY(-2px);
     box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4);
     transition: all 0.15s ease;
   }
   .key:active:not(:disabled) {
     transform: scale(0.96);
   }
   ```

5. Disable logic
   - Individual: `disabled={props.guesses.has(letter)}`
   - All: `disabled={props.disabled}` (game over)

#### Files Updated

| File | Location | Changes |
|------|----------|---------|
| `Keyboard.tsx` (completed) | `libs/ui-components/src/Keyboard` | Full interactive A–Z |
| `Keyboard.module.css` (completed) | `libs/ui-components/src/Keyboard` | 3 states + hover/press effects |

#### Acceptance Criteria

- [ ] All 26 letters in clean grid
- [ ] Correct guesses turn green
- [ ] Wrong guesses turn red/dimmed
- [ ] Each letter clickable only once per game
- [ ] All keys disabled when game is over
- [ ] Hover and press animations working

> ⛔ **STOP** — Keyboard fully wired.

---

### Sprint 10 — Hint System

**Phase:** 3 of 4
**Goal:** Implement sequential hint reveal with score deduction per hint used.

#### ⚠️ Rules

- Modify hook + add HintBox UI
- Do NOT break any existing logic
- Score deduction uses same floor guard as wrong guesses

#### Tasks

1. Implement `showHint()` in `useGame.ts`
   ```typescript
   const showHint = () => {
     if (hintIndex >= level.hints.length) return;
     if (result !== null) return;
     setHintIndex(prev => prev + 1);
     setScore(prev => Math.max(MIN_SCORE, prev - SCORE_DEDUCTION_HINT));
   };
   ```

2. Complete `HintBox.tsx`
   - `"💡 Show Hint"` button
   - Render `revealedHints` as a stacked list (one per line)
   - Counter: `"Hints: {revealedHints.length} / {hints.length}"`
   - Button `disabled` when `hintIndex === hints.length` or `props.disabled`

3. Add hint reveal animation (CSS only)
   ```css
   @keyframes slideDown {
     from { opacity: 0; transform: translateY(-8px); }
     to   { opacity: 1; transform: translateY(0); }
   }
   .hint { animation: slideDown 0.3s ease-out; }
   ```

4. Add score flash animation to `ScoreBoard.module.css`
   ```css
   @keyframes scoreFlash {
     0%   { color: #f59e0b; transform: scale(1.15); }
     100% { color: var(--text-primary); transform: scale(1); }
   }
   ```

#### Files Updated

| File | Location | Changes |
|------|----------|---------|
| `useGame.ts` (updated) | `libs/game-logic/src/hooks` | `showHint()` implemented |
| `HintBox.tsx` (completed) | `libs/ui-components/src/HintBox` | Sequential hints + counter |
| `HintBox.module.css` (completed) | `libs/ui-components/src/HintBox` | `slideDown` animation |
| `ScoreBoard.module.css` (updated) | `libs/ui-components/src/ScoreBoard` | Score flash on change |

#### Acceptance Criteria

- [ ] Each click reveals exactly one new hint in order
- [ ] Each hint deducts 20 points (floor 0)
- [ ] Button disabled after all hints shown or game over
- [ ] Hint reveal has slide-in animation
- [ ] Score visibly updates in ScoreBoard

> ⛔ **STOP** — Hint system complete.

---

### Sprint 11 — Result Modal

**Phase:** 3 of 4
**Goal:** Show the game outcome (win/lose) with final score and a working restart button.

#### ⚠️ Rules

- Do NOT break or modify previous phases' logic
- `onRestart` must fully reset state and load a new random level

#### Tasks

1. Create `ResultModal.tsx`

   Win state:
   ```
   🎉  You Won!
       Word: PHOTOSYNTHESIS
       Final Score: 460
       [ Play Again ]
   ```

   Lose state:
   ```
   ❌  Game Over!
       The word was: PHOTOSYNTHESIS
       Final Score: 80
       [ Try Again ]
   ```

2. Create `ResultModal.module.css`
   ```css
   .overlay {
     position: fixed; inset: 0;
     background: rgba(0, 0, 0, 0.75);
     display: flex; align-items: center; justify-content: center;
     z-index: 100;
     animation: fadeIn 0.3s ease-out;
   }
   @keyframes fadeIn {
     from { opacity: 0; } to { opacity: 1; }
   }
   ```

3. Wire into `GameBoard.tsx`
   ```typescript
   {game.result !== null && (
     <ResultModal
       result={game.result}
       word={props.levelData.word}
       score={game.score}
       onRestart={props.onRestart}
     />
   )}
   ```

4. Implement `handleRestart` in `App.tsx`
   ```typescript
   const handleRestart = () => {
     setSelectedLevel(getRandomLevel());
     // gameStarted stays true — skip name screen on restart
   };
   ```

5. Export `ResultModal` from `ui-components` barrel

#### Files Created

| File | Location | Description |
|------|----------|-------------|
| `ResultModal.tsx` | `libs/ui-components/src/ResultModal` | Win + lose states |
| `ResultModal.module.css` | `libs/ui-components/src/ResultModal` | Overlay + modal card + fade-in |
| `index.ts` (updated) | `libs/ui-components/src` | `export { ResultModal }` |
| `GameBoard.tsx` (updated) | `libs/ui-components/src/GameBoard` | Conditionally renders modal |
| `App.tsx` (updated) | `apps/hangman-app/src/app` | `handleRestart` loads new level |

#### Acceptance Criteria

- [ ] Modal appears immediately on win
- [ ] Modal appears immediately on lose
- [ ] Win shows 🎉 with correct message
- [ ] Lose shows ❌ and reveals the hidden word
- [ ] Final score is accurate
- [ ] "Play Again" loads a new random level and resets all state
- [ ] Modal has fade-in animation

> ⛔ **STOP** — Phase 3 complete. Game is fully playable end-to-end.

---

---

## Phase 4 — UI Polish & Gamification

**Sprints:** 12
**Goal:** Elevate to a polished, production-ready, dark-themed gamified experience
**Deliverables:** Consistent dark theme, animations, `nx build` zero errors

---

### Sprint 12 — UI Polish & Dark Theme

**Phase:** 4 of 4
**Goal:** Apply final visual polish — dark theme, score animations, progress bar, transitions.

#### ⚠️ Rules

- Do NOT change any logic
- Styling only
- CSS variables for all theme values — no hardcoded colors in components

#### Tasks

1. Create `apps/hangman-app/src/styles/global.css`
   ```css
   :root {
     --bg-primary:    #0f0f1a;
     --bg-card:       #1a1a2e;
     --bg-card-hover: #22223b;
     --accent:        #6c63ff;
     --accent-glow:   rgba(108, 99, 255, 0.35);
     --success:       #22c55e;
     --danger:        #ef4444;
     --warning:       #f59e0b;
     --text-primary:  #f0f0f0;
     --text-muted:    #888;
     --border:        rgba(255, 255, 255, 0.08);
     --radius-card:   16px;
     --radius-btn:    10px;
     --shadow-card:   0 8px 32px rgba(0, 0, 0, 0.4);
   }
   * { box-sizing: border-box; margin: 0; padding: 0; }
   body {
     background: var(--bg-primary);
     color: var(--text-primary);
     font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
   }
   ```

2. GameBoard layout — card panels
   - Wrap HangmanCanvas, ScoreBoard, HintBox in `.card` containers
   - Card: `background: var(--bg-card)`, `border-radius: var(--radius-card)`, `box-shadow: var(--shadow-card)`
   - Side-by-side grid at 1024px+, stacked below

3. WordDisplay — large spaced letters
   ```css
   .letter {
     font-size: 2.4rem; font-weight: 700;
     letter-spacing: 0.1em; min-width: 40px;
     border-bottom: 3px solid var(--accent); padding-bottom: 4px;
     transition: color 0.2s ease;
   }
   .letter.revealed { color: var(--success); }
   ```

4. ScoreBoard — animated score counter
   ```css
   @keyframes scoreFlash {
     0%   { color: var(--warning); transform: scale(1.15); }
     100% { color: var(--text-primary); transform: scale(1); }
   }
   ```

5. Attempts progress bar
   ```css
   .progressFill {
     background: linear-gradient(90deg, var(--success), var(--accent));
     transition: width 0.4s ease;
   }
   .progressFill.danger { background: var(--danger); }
   ```
   Apply `.danger` class when `attempts <= 2`

6. Keyboard — enhanced hover/press
   ```css
   .key {
     transition: transform 0.12s ease, box-shadow 0.12s ease;
   }
   .key:hover:not(:disabled) {
     transform: translateY(-3px);
     box-shadow: 0 6px 16px var(--accent-glow);
   }
   .key:active:not(:disabled) {
     transform: scale(0.96);
   }
   ```

7. Screen transition on game start
   ```css
   @keyframes slideUp {
     from { opacity: 0; transform: translateY(20px); }
     to   { opacity: 1; transform: translateY(0); }
   }
   .gameBoard { animation: slideUp 0.4s ease-out; }
   ```

8. Final QA — responsive check at 1024px, 1280px, 1440px

9. Production build
   ```bash
   nx build hangman-app
   ```

#### Files Updated

| File | Location | Changes |
|------|----------|---------|
| `global.css` | `apps/hangman-app/src/styles` | CSS variables + reset |
| `GameBoard.module.css` (final) | `libs/ui-components/src/GameBoard` | Card layout, grid, slide-up |
| `WordDisplay.module.css` (final) | `libs/ui-components/src/WordDisplay` | Large letters, reveal colour |
| `ScoreBoard.module.css` (final) | `libs/ui-components/src/ScoreBoard` | Score flash, danger bar |
| `Keyboard.module.css` (final) | `libs/ui-components/src/Keyboard` | Enhanced hover/press |
| `ResultModal.module.css` (final) | `libs/ui-components/src/ResultModal` | Polished overlay card |
| `StartScreen.module.css` (final) | `libs/ui-components/src/StartScreen` | Final dark theme |

#### Final QA Checklist

- [ ] Dark theme consistent across all screens
- [ ] All 6 hangman body parts animate correctly (0 → 6 wrong)
- [ ] Score flashes on each wrong guess and hint use
- [ ] Progress bar turns red at ≤ 2 attempts remaining
- [ ] Keyboard hover/press effects smooth
- [ ] Correct letters reveal in green in WordDisplay
- [ ] Screen slides up on game start
- [ ] Win modal shows 🎉, lose modal shows ❌ and reveals word
- [ ] "Play Again" fully resets state and loads new level
- [ ] Zero console errors
- [ ] `nx build hangman-app` → zero errors
- [ ] Looks good at 1024px, 1280px, 1440px

> ⛔ **STOP** — Phase 4 complete. Ship it. 🚀

---

---

## Master File Tree

```
hangman-nx/
├── apps/
│   └── hangman-app/
│       └── src/
│           ├── app/
│           │   ├── App.tsx
│           │   └── app.module.css
│           ├── assets/
│           │   └── data.json
│           ├── styles/
│           │   └── global.css
│           ├── utils/
│           │   └── loadLevel.ts
│           └── main.tsx
│
├── libs/
│   ├── ui-components/
│   │   └── src/
│   │       ├── StartScreen/
│   │       │   ├── StartScreen.tsx
│   │       │   └── StartScreen.module.css
│   │       ├── GameBoard/
│   │       │   ├── GameBoard.tsx
│   │       │   └── GameBoard.module.css
│   │       ├── WordDisplay/
│   │       │   ├── WordDisplay.tsx
│   │       │   └── WordDisplay.module.css
│   │       ├── Keyboard/
│   │       │   ├── Keyboard.tsx
│   │       │   └── Keyboard.module.css
│   │       ├── HintBox/
│   │       │   ├── HintBox.tsx
│   │       │   └── HintBox.module.css
│   │       ├── ScoreBoard/
│   │       │   ├── ScoreBoard.tsx
│   │       │   └── ScoreBoard.module.css
│   │       ├── HangmanCanvas/
│   │       │   └── HangmanCanvas.tsx
│   │       ├── ResultModal/
│   │       │   ├── ResultModal.tsx
│   │       │   └── ResultModal.module.css
│   │       └── index.ts
│   │
│   └── game-logic/
│       └── src/
│           ├── hooks/
│           │   └── useGame.ts
│           ├── types/
│           │   └── game.types.ts
│           ├── constants/
│           │   └── game.constants.ts
│           └── index.ts
│
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

## Sprint Completion Checklist

| # | Sprint | Phase | Status |
|---|--------|-------|--------|
| 1 | NX Workspace Setup | 1 — Foundation | ☐ |
| 2 | Start Screen | 1 — Foundation | ☐ |
| 3 | Data Integration | 2 — Data & UI Shell | ☐ |
| 4 | TypeScript Types | 2 — Data & UI Shell | ☐ |
| 5 | Game UI Shell | 2 — Data & UI Shell | ☐ |
| 6 | useGame Hook (State Init) | 3 — Core Logic | ☐ |
| 7 | Guess Logic | 3 — Core Logic | ☐ |
| 8 | Hangman SVG Animation | 3 — Core Logic | ☐ |
| 9 | Keyboard Component | 3 — Core Logic | ☐ |
| 10 | Hint System | 3 — Core Logic | ☐ |
| 11 | Result Modal | 3 — Core Logic | ☐ |
| 12 | UI Polish & Dark Theme | 4 — Polish | ☐ |

---
---

## 🆕 Phase 5 — Competitive Features & Multiplayer

**Sprints:** 13–16  
**Goal:** Introduce competition, performance tracking, and enhanced engagement  
**Deliverables:** Turn-based multiplayer, timer system, leaderboard, result sharing  

---

### Sprint 13 — Turn-Based Multiplayer (Same Device)

**Goal:** Allow two players to play sequentially on the same device.

#### Tasks

- Update StartScreen:
  - Add Player 1 and Player 2 name inputs
- Modify App state:
  - player1Name, player2Name
  - currentPlayerIndex
- Flow:
  - Player 1 plays first
  - Store score and time
  - Transition screen: “Player 2 Turn”
  - Player 2 plays with new level (same difficulty)

#### Acceptance Criteria

- [ ] Player 1 completes game and score is stored
- [ ] Transition screen appears before Player 2
- [ ] Player 2 plays independently
- [ ] Both results stored separately

---

### Sprint 14 — Timer System

**Goal:** Track performance using time taken.

#### Tasks

- Add in useGame hook:
  - startTime
  - endTime
  - timeTaken
- Start timer on game start
- Stop timer on result (win/lose)

#### Acceptance Criteria

- [ ] Timer starts correctly
- [ ] Timer stops on game end
- [ ] Time displayed in UI
- [ ] Time stored for leaderboard

---

### Sprint 15 — Winner Logic

**Goal:** Compare both players and declare winner.

#### Tasks

- Compare:
  - Score (primary)
  - Time (tie-breaker)
- Create winner display screen

#### Acceptance Criteria

- [ ] Correct winner displayed
- [ ] Both scores visible
- [ ] Tie handled using time

---

### Sprint 16 — Leaderboard System

**Goal:** Persist top results locally.

#### Tasks

- Use localStorage:
  key: "leaderboard"
- Store:
  - name
  - score
  - time
  - date
- Sort:
  - score DESC
  - time ASC
- Keep top 5 entries

#### Acceptance Criteria

- [ ] Data saved in localStorage
- [ ] Sorted correctly
- [ ] Only top 5 shown
- [ ] Leaderboard UI displays entries

---

### Sprint 17 — Result Sharing

**Goal:** Allow users to copy and share results.

#### Tasks

- Add "Copy Result" button
- Copy format:

  Name: X  
  Score: Y  
  Time: Z  

#### Acceptance Criteria

- [ ] Clipboard copy works
- [ ] Data formatted correctly

---

## 🆕 Updated Sprint Count

| Phase | Sprints |
|------|--------|
| Phase 1 | 1–2 |
| Phase 2 | 3–5 |
| Phase 3 | 6–11 |
| Phase 4 | 12 |
| Phase 5 | 13–17 |

---

## 🆕 Updated Total

- **Total Phases:** 5  
- **Total Sprints:** 17  

---

## 🆕 Future Scope

- Real-time multiplayer (WebSockets / Firebase)
- Invite link system
- Cross-device sync
- Backend leaderboard storage

---

*SCOPES.md — Gamified Hangman Game v1.0*
*Stack: React 18 + TypeScript (strict) + NX Monorepo*
