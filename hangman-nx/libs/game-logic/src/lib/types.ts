export interface Level {
  id: number;
  word: string;
  clue: string;
  hints: string[];       // Required per SCHEMA_AND_TYPES.md
  explanation: string;   // Educational content displayed after question
  maxAttempts: number;   // Always 6 per spec (DR-04)
  baseScore: number;     // Always 500 per spec (DR-04)
}

export interface GameData {
  subject: string;
  levels: Level[];
}

// Multiplayer + Timer types
export type GameMode = 'single' | 'multi';

export interface PlayerResult {
  name: string;
  score: number;
  timeTaken: number; // in milliseconds
}

export interface UseGameReturn {
  playerName: string;
  gameStarted: boolean;
  currentLevel: Level | null;
  guessedLetters: string[];
  wrongGuesses: string[];
  maskedWord: string;
  gameStatus: 'playing' | 'won' | 'lost';
  score: number;
  maxAttempts: number;
  hintsRevealedCount: number;
  timeTaken: number; // ms elapsed since game start
  // Structured round/timer system
  currentRound: number;         // 1-3
  currentQuestion: number;      // 0-1 (within round)
  attemptInQuestion: number;    // 1-2 (single player only)
  roundScores: number[][];      // [round][question]
  totalScore: number;           // sum of all scores
  sessionStartTime: number;     // milliseconds
  sessionTotalTime: number;     // seconds (totalTime / 1000)
  startGame: (name: string) => void;
  guessLetter: (letter: string) => void;
  revealHint: () => void;
  restartGame: () => void;
}
