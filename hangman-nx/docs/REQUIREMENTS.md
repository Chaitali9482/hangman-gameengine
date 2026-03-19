# 📋 Requirements Document — Gamified Hangman Game

**Project:** Hangman Educational Module  
**Subject:** Science – Class 10  
**Version:** 1.0  
**Type:** Single-player, client-side, gamified word game  

---

## 1. Functional Requirements

### 1.1 Start Screen
- FR-01: The game MUST display an input field for the player to enter their name.
- FR-02: The game MUST NOT proceed without a non-empty player name.
- FR-03: A "Start Game" button MUST be visible and enabled only when a name is entered.
- FR-04: On start, the system MUST load game data from `data.json` and randomly select a level.

### 1.2 Game Board
- FR-05: The board MUST display the player's name prominently.
- FR-06: The board MUST display the current clue for the active word.
- FR-07: The board MUST display the word as blank dashes (one per letter), with spaces preserved.
- FR-08: The board MUST display the current score.
- FR-09: The board MUST display the number of remaining attempts.

### 1.3 Guess Mechanics
- FR-10: The keyboard MUST display all 26 letters (A–Z).
- FR-11: Each letter button MUST be pressable exactly once per game round.
- FR-12: A correct guess MUST reveal all matching letters in the word display.
- FR-13: A wrong guess MUST decrement remaining attempts by 1.
- FR-14: A wrong guess MUST deduct 20 points from the score.
- FR-15: Used letter buttons MUST be visually disabled and non-interactive.

### 1.4 Hangman Animation
- FR-16: The hangman structure (base, pole, beam, rope) MUST always be visible.
- FR-17: Body parts MUST appear progressively with each wrong guess (max 6 parts).
- FR-18: Body part order: Head → Body → Left Arm → Right Arm → Left Leg → Right Leg.
- FR-19: Each body part MUST appear with a smooth animation (fade-in or draw-on transition).
- FR-20: Animation MUST be implemented using SVG — no image files or external libraries.

### 1.5 Hint System
- FR-21: A "Show Hint" button MUST be displayed on the game board.
- FR-22: Hints MUST be revealed one at a time, sequentially.
- FR-23: Each hint used MUST deduct 20 points from the score.
- FR-24: The hint button MUST be disabled after all hints for the level are exhausted.

### 1.6 Win / Lose Conditions
- FR-25: The game MUST detect a WIN when all letters in the word are correctly guessed.
- FR-26: The game MUST detect a LOSS when wrong attempts reach `maxAttempts` (6).
- FR-27: A Result Modal MUST appear on Win or Lose.
- FR-28: The Result Modal MUST display: outcome (Win 🎉 / Lose ❌), the correct word, and final score.
- FR-29: A "Play Again" button MUST restart the game (reload a new random level).

### 1.7 Scoring
- FR-30: Base score per level = 500 points (as defined in JSON).
- FR-31: Score MUST decrease by 20 per wrong guess.
- FR-32: Score MUST decrease by 20 per hint used.
- FR-33: Score MUST NOT go below 0.
- FR-34: Score MUST update visually in real-time on the board.

---

## 2. Non-Functional Requirements

### 2.1 Performance
- NFR-01: Initial load time MUST be under 2 seconds on average hardware.
- NFR-02: Letter guess response (UI update) MUST be immediate (< 100ms).

### 2.2 Usability
- NFR-03: The game MUST be playable on desktop screen widths of 1024px and above.
- NFR-04: All interactive elements MUST have visible hover/focus states.
- NFR-05: Disabled letters MUST be clearly distinguishable from available letters.

### 2.3 Code Quality
- NFR-06: All code MUST be written in TypeScript with strict mode enabled.
- NFR-07: No use of `any` type is permitted anywhere in the codebase.
- NFR-08: Components MUST be functional (no class components).
- NFR-09: Business logic MUST be separated into the `game-logic` library.
- NFR-10: UI components MUST be separated into the `ui-components` library.

### 2.4 Constraints
- NFR-11: No backend, server, or API calls of any kind.
- NFR-12: No external UI component libraries (e.g., MUI, Ant Design).
- NFR-13: No external animation libraries (e.g., Framer Motion, GSAP).
- NFR-14: No multiplayer functionality.
- NFR-15: Data schema in `data.json` MUST NOT be modified.

---

## 3. Data Requirements

- DR-01: Game data MUST be stored in a local `data.json` file.
- DR-02: Data MUST conform to the `GameData` TypeScript interface.
- DR-03: The game MUST support multiple levels (selects one randomly per session).
- DR-04: Each level MUST contain: `id`, `word`, `clue`, `hints[]`, `maxAttempts`, `baseScore`.

---

## 4. Architecture Requirements

- AR-01: Project MUST use an NX Monorepo structure.
- AR-02: The React application MUST live in `apps/hangman-app`.
- AR-03: UI components MUST live in `libs/ui-components`.
- AR-04: Game logic (hook + types) MUST live in `libs/game-logic`.
- AR-05: Cross-library imports MUST use NX path aliases defined in `tsconfig.base.json`.
