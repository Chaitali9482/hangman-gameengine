export interface Level {
  id: number;
  word: string;
  clue: string;
  hints?: string[]; // Optional hints array
}

export interface GameData {
  subject: string;
  levels: Level[];
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
  hintsRevealedCount: number;
  startGame: (name: string) => void;
  guessLetter: (letter: string) => void;
  revealHint: () => void;
  restartGame: () => void;
}
