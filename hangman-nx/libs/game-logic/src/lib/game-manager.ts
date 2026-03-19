import { GameData, Level } from './types';

export function getRandomLevel(data: GameData): Level {
  const randomIndex = Math.floor(Math.random() * data.levels.length);
  return data.levels[randomIndex];
}

export function getMaskedWord(word: string, guessedLetters: string[]): string {
  return word
    .split('')
    .map((char) => {
      // Keep spaces as spaces, mask letters not in guessedLetters
      if (char === ' ') return ' ';
      const upperChar = char.toUpperCase();
      return guessedLetters.includes(upperChar) ? upperChar : '_';
    })
    .join('');
}
