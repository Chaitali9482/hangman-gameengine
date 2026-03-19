# 📐 Schema & TypeScript Types — Gamified Hangman Game

---

## 1. Data JSON Schema

### File: `apps/hangman-app/src/assets/data.json`

```json
{
  "subject": "string",
  "levels": [
    {
      "id": "number",
      "word": "string (UPPERCASE)",
      "clue": "string",
      "hints": ["string", "string", "string"],
      "maxAttempts": "number (always 6)",
      "baseScore": "number (always 500)"
    }
  ]
}
```

### Validation Rules

| Field        | Type     | Required | Constraints                          |
|--------------|----------|----------|--------------------------------------|
| subject      | string   | ✅ Yes   | Non-empty                            |
| levels       | array    | ✅ Yes   | Min 1 item                           |
| id           | number   | ✅ Yes   | Unique, positive integer             |
| word         | string   | ✅ Yes   | Uppercase letters only, no spaces    |
| clue         | string   | ✅ Yes   | Non-empty, human-readable            |
| hints        | string[] | ✅ Yes   | Array of 1–3 strings                 |
| maxAttempts  | number   | ✅ Yes   | Must be exactly 6                    |
| baseScore    | number   | ✅ Yes   | Must be exactly 500                  |

> ⚠️ DO NOT modify this schema. It is fixed per project spec.

---

## 2. TypeScript Types

### File: `libs/game-logic/src/types/game.types.ts`

```typescript
// ─────────────────────────────────────────
// DATA TYPES (mirrors data.json exactly)
// ─────────────────────────────────────────

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

// ─────────────────────────────────────────
// GAME STATE TYPES
// ─────────────────────────────────────────

export type GameResult = 'win' | 'lose' | null;

export interface GameState {
  wordDisplay: string[];      // e.g. ['P', '_', '_', 'T', '_', ...]
  attempts: number;           // remaining wrong attempts allowed
  maxAttempts: number;        // always 6
  score: number;              // current score (starts at baseScore)
  guesses: Set<string>;       // letters already guessed (uppercase)
  hintIndex: number;          // how many hints have been revealed
  result: GameResult;         // null = in progress, 'win', or 'lose'
  revealedHints: string[];    // hints shown so far
}

// ─────────────────────────────────────────
// HOOK RETURN TYPE
// ─────────────────────────────────────────

export interface UseGameReturn extends GameState {
  level: GameLevel;
  guessLetter: (letter: string) => void;
  showHint: () => void;
  restart: () => void;
}

// ─────────────────────────────────────────
// COMPONENT PROP TYPES
// ─────────────────────────────────────────

export interface StartScreenProps {
  onStart: (playerName: string) => void;
}

export interface GameBoardProps {
  playerName: string;
  levelData: GameLevel;
  onRestart: () => void;
}

export interface HangmanCanvasProps {
  wrongAttempts: number;   // 0–6, drives which body parts render
  maxAttempts: number;
}

export interface WordDisplayProps {
  wordDisplay: string[];   // array of revealed letters and '_'
}

export interface KeyboardProps {
  guesses: Set<string>;
  onGuess: (letter: string) => void;
  disabled: boolean;       // true when game is over
}

export interface HintBoxProps {
  hints: string[];
  revealedHints: string[];
  onShowHint: () => void;
  disabled: boolean;       // true when all hints used or game over
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

---

## 3. Constants

### File: `libs/game-logic/src/constants/game.constants.ts`

```typescript
export const SCORE_DEDUCTION_WRONG_GUESS = 20;
export const SCORE_DEDUCTION_HINT = 20;
export const MIN_SCORE = 0;
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as string[];
export const HANGMAN_PARTS_COUNT = 6;
```

---

## 4. Hangman SVG Part Map

| Wrong Attempts | Part Drawn    |
|----------------|---------------|
| 1              | Head (circle) |
| 2              | Body (line)   |
| 3              | Left Arm      |
| 4              | Right Arm     |
| 5              | Left Leg      |
| 6              | Right Leg     |

---

## 5. NX Path Aliases

### In `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@hangman/ui-components": ["libs/ui-components/src/index.ts"],
      "@hangman/game-logic":    ["libs/game-logic/src/index.ts"]
    }
  }
}
```

### Library Exports

**`libs/ui-components/src/index.ts`**
```typescript
export { StartScreen }   from './StartScreen/StartScreen';
export { GameBoard }     from './GameBoard/GameBoard';
export { WordDisplay }   from './WordDisplay/WordDisplay';
export { Keyboard }      from './Keyboard/Keyboard';
export { HintBox }       from './HintBox/HintBox';
export { ScoreBoard }    from './ScoreBoard/ScoreBoard';
export { HangmanCanvas } from './HangmanCanvas/HangmanCanvas';
export { ResultModal }   from './ResultModal/ResultModal';
```

**`libs/game-logic/src/index.ts`**
```typescript
export { useGame }                       from './hooks/useGame';
export type { GameLevel, GameData,
              GameState, GameResult,
              UseGameReturn }            from './types/game.types';
export type { StartScreenProps,
              GameBoardProps,
              HangmanCanvasProps,
              WordDisplayProps,
              KeyboardProps, HintBoxProps,
              ScoreBoardProps,
              ResultModalProps }         from './types/game.types';
export * from './constants/game.constants';
```
