import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Level, GameData, UseGameReturn } from './types';
import { getRandomLevel, getMaskedWord } from './game-manager';

export function useGame(gameData: GameData): UseGameReturn {
  const [playerName, setPlayerName] = useState<string>('');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(500);
  const [hintsRevealedCount, setHintsRevealedCount] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  // Structured round/question/attempt tracking
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [attemptInQuestion, setAttemptInQuestion] = useState<number>(1);
  const [roundScores, setRoundScores] = useState<number[][]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionTotalTime, setSessionTotalTime] = useState<number>(0);

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
    const isLost = wrongGuesses.length >= currentLevel.maxAttempts;
    
    if (isWon) return 'won';
    if (isLost) return 'lost';
    return 'playing';
  }, [gameStarted, currentLevel, maskedWord, wrongGuesses]);

  // Stop timer when game ends
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      setTimeTaken(Date.now() - startTimeRef.current);
    }
  }, [gameStatus]);

  // Actions
  const startGame = useCallback((name: string) => {
    const level = getRandomLevel(gameData);
    setPlayerName(name);
    setCurrentLevel(level);
    setGuessedLetters([]);
    setScore(level.baseScore);
    setHintsRevealedCount(0);
    setTimeTaken(0);
    startTimeRef.current = Date.now();
    
    // Initialize round structure
    setCurrentRound(1);
    setCurrentQuestion(0);
    setAttemptInQuestion(1);
    setRoundScores([]);
    setTotalScore(0);
    setSessionStartTime(Date.now());
    setSessionTotalTime(0);
    
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
    setScore(level.baseScore);
    setHintsRevealedCount(0);
    setTimeTaken(0);
    startTimeRef.current = Date.now();
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
    maxAttempts: currentLevel?.maxAttempts ?? 6,
    hintsRevealedCount,
    timeTaken,
    // Round/question/timer info
    currentRound,
    currentQuestion,
    attemptInQuestion,
    roundScores,
    totalScore,
    sessionStartTime,
    sessionTotalTime,
    startGame,
    guessLetter,
    revealHint,
    restartGame,
  };
}
