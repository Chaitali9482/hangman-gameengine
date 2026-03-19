import { useState, useMemo, useEffect, useCallback } from 'react';
import { Level, GameData, UseGameReturn } from './types';
import { getRandomLevel, getMaskedWord } from './game-manager';

export function useGame(gameData: GameData): UseGameReturn {
  const [playerName, setPlayerName] = useState<string>('');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(500);
  const [hintsRevealedCount, setHintsRevealedCount] = useState<number>(0);

  // Calculate derived state
  const wrongGuesses = useMemo(() => {
    if (!currentLevel) return [];
    return guessedLetters.filter(
      (letter) => !currentLevel.word.toUpperCase().includes(letter.toUpperCase())
    );
  }, [guessedLetters, currentLevel]);

  const maskedWord = useMemo(() => {
    if (!currentLevel) return '';
    return getMaskedWord(currentLevel.word, guessedLetters);
  }, [currentLevel, guessedLetters]);

  const gameStatus = useMemo(() => {
    if (!gameStarted || !currentLevel) return 'playing';
    
    const isWon = !maskedWord.includes('_');
    const isLost = wrongGuesses.length >= 6;
    
    if (isWon) return 'won';
    if (isLost) return 'lost';
    return 'playing';
  }, [gameStarted, currentLevel, maskedWord, wrongGuesses]);

  // Actions
  const startGame = useCallback((name: string) => {
    const level = getRandomLevel(gameData);
    setPlayerName(name);
    setCurrentLevel(level);
    setGuessedLetters([]);
    setScore(500);
    setHintsRevealedCount(0);
    setGameStarted(true);
  }, [gameData]);

  const guessLetter = useCallback((letter: string) => {
    if (gameStatus !== 'playing') return;
    
    const upperLetter = letter.toUpperCase();
    if (!guessedLetters.includes(upperLetter)) {
      setGuessedLetters((prev) => [...prev, upperLetter]);
      
      // Deduct points for wrong guess
      if (!currentLevel?.word.toUpperCase().includes(upperLetter)) {
        setScore((prev) => Math.max(0, prev - 20));
      }
    }
  }, [gameStatus, guessedLetters, currentLevel]);

  const revealHint = useCallback(() => {
    if (gameStatus !== 'playing' || !currentLevel?.hints) return;
    if (hintsRevealedCount >= currentLevel.hints.length) return;
    
    setHintsRevealedCount((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 20));
  }, [gameStatus, currentLevel, hintsRevealedCount]);

  const restartGame = useCallback(() => {
    const level = getRandomLevel(gameData);
    setCurrentLevel(level);
    setGuessedLetters([]);
    setScore(500);
    setHintsRevealedCount(0);
    setGameStarted(true);
  }, [gameData]);

  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || !currentLevel || gameStatus !== 'playing') return;
      
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        guessLetter(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, currentLevel, gameStatus, guessLetter]);

  return {
    playerName,
    gameStarted,
    currentLevel,
    guessedLetters,
    wrongGuesses,
    maskedWord,
    gameStatus,
    score,
    hintsRevealedCount,
    startGame,
    guessLetter,
    revealHint,
    restartGame,
  };
}
