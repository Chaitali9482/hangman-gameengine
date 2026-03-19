# 🔄 Application Flow — Gamified Hangman Game

---

## High-Level Flow

```
[ Start Screen ]
      |
      | (player enters name + clicks Start)
      ▼
[ Load data.json ]
      |
      | (pick random level)
      ▼
[ Game Board ]
      |
      |-------- Player clicks a letter --------→ [ Guess Letter ]
      |                                                  |
      |                              ┌───────────────────┴───────────────────┐
      |                              ▼ (correct)                             ▼ (wrong)
      |                      [ Reveal letters ]                   [ Decrement attempts ]
      |                      [ No score change ]                  [ Deduct 20 pts ]
      |                              |                                       |
      |                      [ Check: all letters                   [ Update Hangman SVG ]
      |                         revealed? ]                                  |
      |                              |                             [ Check: attempts == 6? ]
      |                         YES  |  NO                                   |
      |                    ┌─────────┘                            YES  |  NO │
      |                    ▼                                    ┌──────┘      |
      |             [ WIN condition ]                           ▼             |
      |                    |                            [ LOSE condition]    Loop
      |                    └─────────────────┐                 |
      |                                      ▼                 |
      |                              [ Result Modal ]◄─────────┘
      |                                      |
      |-------- Player clicks Hint ─────→ [ Show next hint ]
      |                                      | (deduct 20 pts)
      |                                      ▼
      |                              [ Update HintBox ]
      |
      └─────────────────── Play Again ──────────────────→ [ Reload + new level ]
```

---

## Detailed Screen-by-Screen Flow

### Screen 1: Start Screen
**Component:** `StartScreen`

| Step | Action | Result |
|------|--------|--------|
| 1 | User opens app | StartScreen renders |
| 2 | User types name | Input value updates (controlled) |
| 3 | Name is empty | Start button disabled |
| 4 | Name is entered | Start button enabled |
| 5 | User clicks Start | `playerName` stored in state; transition to GameBoard |

---

### Screen 2: Game Board (Active Gameplay)
**Components:** `GameBoard`, `HangmanCanvas`, `WordDisplay`, `Keyboard`, `HintBox`, `ScoreBoard`

| Step | Action | Result |
|------|--------|--------|
| 1 | GameBoard mounts | Load `data.json`, pick random level, initialise `useGame` hook |
| 2 | Initial render | Word shown as `_ _ _ _ …`, score = baseScore, attempts = maxAttempts |
| 3 | User clicks letter | `guessLetter(letter)` called in `useGame` |
| 4a | Correct guess | Letter revealed in WordDisplay; button disabled; check win |
| 4b | Wrong guess | Attempt count −1; score −20; next Hangman body part drawn |
| 5 | User clicks Hint | `showHint()` called; next hint displayed; score −20 |
| 6 | All hints used | Hint button disabled |
| 7a | All letters guessed | `result = 'win'`; ResultModal shown |
| 7b | Attempts reach 0 | `result = 'lose'`; ResultModal shown |

---

### Screen 3: Result Modal
**Component:** `ResultModal`

| Step | Action | Result |
|------|--------|--------|
| 1 | Win detected | Modal shows 🎉 "You Won!", final score, correct word |
| 2 | Lose detected | Modal shows ❌ "Game Over!", final score, reveals word |
| 3 | User clicks "Play Again" | `restart()` called; new random level loaded; GameBoard re-initialised |

---

## State Transitions (`useGame` hook)

```
INITIAL
  wordDisplay:   ['_', '_', '_', ...]
  guesses:       Set<string> = {}
  attempts:      maxAttempts (6)
  score:         baseScore (500)
  hintIndex:     0
  result:        null

ON guessLetter(letter):
  → Add letter to guesses
  → IF letter in word:
      → Reveal positions in wordDisplay
      → IF no '_' left in wordDisplay → result = 'win'
  → ELSE:
      → attempts -= 1
      → score = max(0, score - 20)
      → IF attempts === 0 → result = 'lose'

ON showHint():
  → IF hintIndex < hints.length:
      → hintIndex += 1
      → score = max(0, score - 20)

ON restart():
  → Pick new random level
  → Reset ALL state to INITIAL values for new level
```

---

## Component Dependency Map

```
App.tsx
 ├── StartScreen
 │     └── (onStart callback → App sets playerName)
 │
 └── GameBoard  (receives playerName + levelData)
       ├── HangmanCanvas   (receives: wrongAttempts)
       ├── WordDisplay     (receives: wordDisplay[])
       ├── ScoreBoard      (receives: score, attempts, maxAttempts, playerName)
       ├── HintBox         (receives: hints[], hintIndex, onShowHint)
       ├── Keyboard        (receives: guesses Set, onGuessLetter)
       └── ResultModal     (receives: result, word, score, onRestart)
```

---

## Data Flow

```
data.json
    ↓ (loaded in App.tsx or GameBoard)
GameLevel (random pick)
    ↓
useGame(level) hook
    ↓ (exposes state + functions)
GameBoard renders child components
    ↓
User interaction → hook functions → state update → re-render
```
