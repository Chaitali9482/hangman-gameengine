# 🎮 Gamified Hangman Game — Educational Module

> A single-player, gamified Hangman game built with React + TypeScript in an NX Monorepo.

---

## 📦 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Framework    | React 18 (Functional Components) |
| Language     | TypeScript (strict, no `any`) |
| Monorepo     | NX Workspace                  |
| Styling      | CSS Modules / Inline (no external UI lib) |
| Animation    | SVG + CSS transitions (no external anim lib) |
| State        | Custom Hook (`useGame`)        |
| Data         | Local JSON                    |

---

## 🗂️ Monorepo Structure

```
hangman-nx/
├── apps/
│   └── hangman-app/               # Main React application
│       ├── src/
│       │   ├── app/
│       │   │   ├── App.tsx
│       │   │   └── app.module.css
│       │   ├── assets/
│       │   │   └── data.json      # Game data (levels, words, clues)
│       │   └── main.tsx
│       ├── project.json
│       └── tsconfig.json
│
├── libs/
│   ├── ui-components/             # All UI React components
│   │   └── src/
│   │       ├── StartScreen/
│   │       ├── GameBoard/
│   │       ├── WordDisplay/
│   │       ├── Keyboard/
│   │       ├── HintBox/
│   │       ├── ScoreBoard/
│   │       ├── HangmanCanvas/
│   │       └── ResultModal/
│   │
│   └── game-logic/                # Business logic (hook + types)
│       └── src/
│           ├── hooks/
│           │   └── useGame.ts
│           └── types/
│               └── game.types.ts
│
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

## 🚀 Getting Started

### 1. Install NX CLI
```bash
npm install -g nx
```

### 2. Create NX Workspace
```bash
npx create-nx-workspace@latest hangman-nx --preset=react-ts
```

### 3. Generate Libraries
```bash
nx generate @nx/react:library ui-components --directory=libs/ui-components
nx generate @nx/react:library game-logic --directory=libs/game-logic
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the App
```bash
nx serve hangman-app
```

### 6. Build for Production
```bash
nx build hangman-app
```

---

## 🎮 How to Play

1. Enter your **player name** on the Start Screen.
2. A **random word** is selected from the level data.
3. Read the **clue** and start guessing letters using the A–Z keyboard.
4. Each **correct guess** reveals the letter in the word.
5. Each **wrong guess** adds a body part to the hangman (max 6).
6. Use **hints** to get extra clues (costs −20 points each).
7. **Win** by guessing all letters before 6 wrong attempts.
8. **Lose** if the hangman is fully drawn (6 wrong attempts).

---

## 📊 Scoring

| Action            | Points     |
|-------------------|------------|
| Base Score        | +500       |
| Wrong Guess       | −20        |
| Using a Hint      | −20        |
| Win Bonus         | +100       |

---

## 🏁 Sprint Plan Summary

| Sprint | Task                        |
|--------|-----------------------------|
| 1      | NX Workspace Setup          |
| 2      | Start Screen                |
| 3      | Data Integration (JSON)     |
| 4      | Types Definition             |
| 5      | Game UI Layout              |
| 6      | useGame Hook (core logic)   |
| 7      | Guess Logic                 |
| 8      | Hangman SVG Animation       |
| 9      | A–Z Keyboard Component      |
| 10     | Hint System                 |
| 11     | Result Modal (Win/Lose)     |
| 12     | UI Polish & Dark Theme      |

---

## ✅ Constraints

- ❌ No backend / APIs
- ❌ No external UI libraries
- ❌ No external animation libraries
- ❌ No multiplayer
- ✅ Single player only
- ✅ Fully client-side
- ✅ JSON-driven data

---

## 📄 License

MIT — Educational Use Only

---

## 🚀 New Features (Enhanced Gamification)

- 👥 Turn-based multiplayer (same device)
- ⏱️ Timer-based performance tracking
- 🏆 Leaderboard (Top scores stored locally)
- 🎉 Winner detection based on score and speed
- 📋 Copy result feature for sharing

---