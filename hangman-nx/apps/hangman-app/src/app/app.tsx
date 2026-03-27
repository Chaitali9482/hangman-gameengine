import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './app.module.css';
import { StartScreen, GameScreen, TransitionScreen, WinnerScreen } from '@hangman/ui-components';
import { useGame, GameMode } from '@hangman/game-logic';
import gameData from '../assets/data.json';

type Phase = 'setup' | 'playing' | 'transition' | 'results';

export function App() {
  const {
    currentLevel,
    guessedLetters,
    wrongGuesses,
    maskedWord,
    gameStatus,
    score,
    maxAttempts,
    hintsRevealedCount,
    startGame,
    guessLetter,
    revealHint,
    restartGame,
  } = useGame(gameData);

  // Multiplayer & Session State
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [phase, setPhase] = useState<Phase>('setup');
  const [totalRounds] = useState(1);  // Final Quiz: 1 round only
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gamesPerRound] = useState(2);  // Final Quiz: 2 questions per round

  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  
  // Dynamically track each played game
  interface PlayedGame {
    questionNum: number;
    playerNum: number;  // 1 or 2
    score: number;
    mistakes: number;
    time?: number;  // seconds
  }
  const [playedGames, setPlayedGames] = useState<PlayedGame[]>([]);
  
  // Educational content
  const [lastLevelExplanation, setLastLevelExplanation] = useState<string>('');
  const [lastLevelWord, setLastLevelWord] = useState<string>('');
  const [lastGameWon, setLastGameWon] = useState<boolean>(true);
  
  // Session timer (single player only)
  const sessionStartRef = useRef<number>(0);
  const [sessionTotalTime, setSessionTotalTime] = useState<number>(0);
  
  // Player-wise timing (multiplayer only)
  const turnStartRef = useRef<number>(0);
  const [player1Times, setPlayer1Times] = useState<number[]>([]);  // times per round
  const [player2Times, setPlayer2Times] = useState<number[]>([]);  // times per round
  
  // Game tracking within round (single player)
  const [currentGame, setCurrentGame] = useState<number>(0);  // 0 or 1

  // Derived
  const activeName = currentPlayer === 1 ? p1Name : p2Name;

  const handleStart = useCallback((p1: string, mode: GameMode, p2?: string) => {
    setGameMode(mode);
    setP1Name(p1);
    if (p2) setP2Name(p2);
    
    // Reset session
    setCurrentRound(1);
    setCurrentPlayer(1);
    setCurrentGame(0);
    
    // Reset played games tracking
    setPlayedGames([]);
    
    // Reset timing arrays
    setPlayer1Times([]);
    setPlayer2Times([]);
    
    // Start session timer (single player)
    const now = Date.now();
    sessionStartRef.current = now;
    setSessionTotalTime(0);
    
    // Start turn timer (multiplayer)
    if (mode === 'multi') {
      turnStartRef.current = now;
    }
    
    startGame(p1);
    setPhase('playing');
  }, [startGame]);

  // Handle Game End Logic - Final Quiz Flow (No Loops)
  useEffect(() => {
    if (gameStatus !== 'playing' && phase === 'playing') {
      const finalScore = gameStatus === 'won' ? score : 0;
      const mistakesCount = wrongGuesses.length;
      
      // Store the current level's explanation and word for educational display
      if (currentLevel?.explanation) {
        setLastLevelExplanation(currentLevel.explanation);
      }
      if (currentLevel?.word) {
        setLastLevelWord(currentLevel.word);
      }
      setLastGameWon(gameStatus === 'won');
      
      // --- MULTIPLAYER LOGIC ---
      if (gameMode === 'multi') {
        // Calculate time taken for this player's turn
        const timeTaken = Math.round((Date.now() - turnStartRef.current) / 1000);
        
        // Track this played game
        setPlayedGames(prev => [...prev, {
          questionNum: currentGame + 1,
          playerNum: currentPlayer,
          score: finalScore,
          mistakes: mistakesCount,
          time: timeTaken
        }]);
        
        if (currentPlayer === 1) {
          setPlayer1Times(prev => [...prev, timeTaken]);
          setCurrentPlayer(2);
          setPhase('transition');
          // Reset timer for player 2
          turnStartRef.current = Date.now();
        } else {
          // Player 2 done
          setPlayer2Times(prev => [...prev, timeTaken]);
          
          // ALWAYS show transition screen to display explanation
          // Then decide if next game or results based on button click
          setCurrentPlayer(1);
          setPhase('transition');
        }
      } 
      // Single player logic
      else {
        // Track this played game
        setPlayedGames(prev => [...prev, {
          questionNum: currentGame + 1,
          playerNum: 1,
          score: finalScore,
          mistakes: mistakesCount
        }]);
        
        // ALWAYS show transition screen to display explanation
        // Then decide if next game or results based on button click
        setPhase('transition');
      }
    }
  }, [gameStatus, phase, gameMode, currentPlayer, score, wrongGuesses.length, currentRound, totalRounds, currentGame, gamesPerRound]);

  const startNextTurn = () => {
    if (gameMode === 'multi') {
      // For multiplayer: 
      // If currentPlayer is 2, just restart (P2 plays)
      // If currentPlayer is 1, both players finished, check if next game exists
      
      if (currentPlayer === 2) {
        // Player 1 finished, now it's Player 2's turn for same game
        turnStartRef.current = Date.now();
        restartGame();
        setPhase('playing');
      } else {
        // Both players finished current game (currentPlayer is 1, which means next is P1 for future game or results)
        const isLastGame = currentGame >= gamesPerRound - 1;
        
        if (isLastGame) {
          // Quiz over - show results
          setPhase('results');
        } else {
          // Move to next game (Player 1 plays first)
          setCurrentGame(prev => prev + 1);
          // Keep currentPlayer as 1 (Player 1 plays next game first)
          turnStartRef.current = Date.now();
          restartGame();
          setPhase('playing');
        }
      }
    } else {
      // Single player logic
      const isLastGame = currentGame >= gamesPerRound - 1;
      
      if (isLastGame) {
        // End game - show results
        const endTime = Date.now();
        setSessionTotalTime(Math.round((endTime - sessionStartRef.current) / 1000));
        setPhase('results');
      } else {
        // Move to next question
        setCurrentGame(prev => prev + 1);
        restartGame();
        setPhase('playing');
      }
    }
  };

  // Manual transition - user clicks button to advance
  // (No auto-advance when there's educational content)
  useEffect(() => {
    // Transition screen now requires manual click only
    return;
  }, [phase]);

  const handleResetSession = () => {
    setPhase('setup');
  };

  // Rendering
  if (phase === 'setup') {
    return (
      <div className={styles.app}>
        <StartScreen onStart={handleStart} />
      </div>
    );
  }

  if (phase === 'transition') {
    return (
      <div className={styles.app}>
        <TransitionScreen 
          currentRound={currentRound}
          nextPlayerName={activeName}
          nextPlayerNumber={currentPlayer}
          lastPlayerName={currentPlayer === 1 ? p2Name : p1Name}
          lastPlayerScore={score}
          lastLevelExplanation={lastLevelExplanation}
          lastLevelWord={lastLevelWord}
          lastGameWon={lastGameWon}
          onStartNextTurn={startNextTurn}
          gameMode={gameMode}
          currentGame={currentGame}
          gamesPerRound={gamesPerRound}
        />
      </div>
    );
  }

  if (phase === 'results') {
    // Build scores and times arrays from played games
    let p1Scores: number[] = [];
    let p1Mistakes: number[] = [];
    let p1Times: number[] = [];
    let p2Scores: number[] = [];
    let p2Mistakes: number[] = [];
    let p2Times: number[] = [];
    
    playedGames.forEach(game => {
      if (game.playerNum === 1) {
        p1Scores.push(game.score);
        p1Mistakes.push(game.mistakes);
        if (game.time !== undefined) p1Times.push(game.time);
      } else {
        p2Scores.push(game.score);
        p2Mistakes.push(game.mistakes);
        if (game.time !== undefined) p2Times.push(game.time);
      }
    });
    
    const p1Total = p1Scores.reduce((a, b) => a + b, 0);
    const p2Total = p2Scores.reduce((a, b) => a + b, 0);
    
    return (
      <div className={styles.app}>
        <WinnerScreen 
          player1={{ 
            name: p1Name, 
            scores: p1Scores, 
            totalScore: p1Total, 
            times: p1Times,
            mistakes: p1Mistakes 
          }}
          player2={{ 
            name: p2Name, 
            scores: p2Scores, 
            totalScore: p2Total, 
            times: p2Times,
            mistakes: p2Mistakes 
          }}
          onPlayAgain={handleResetSession}
          gameMode={gameMode}
          sessionTotalTime={gameMode === 'single' ? sessionTotalTime : undefined}
        />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <GameScreen 
        playerName={activeName}
        subject={gameData.subject}
        maskedWord={maskedWord}
        guessedLetters={guessedLetters}
        wrongGuessesCount={wrongGuesses.length}
        maxAttempts={maxAttempts}
        gameStatus={gameStatus}
        score={score}
        hintsRevealedCount={hintsRevealedCount}
        currentRound={currentRound}
        currentPlayerNumber={gameMode === 'multi' ? currentPlayer : undefined}
        currentGame={gameMode === 'single' ? currentGame : undefined}
        gamesPerRound={gameMode === 'single' ? gamesPerRound : undefined}
        onGuess={guessLetter}
        onRevealHint={revealHint}
        onRestart={restartGame}
        clue={currentLevel?.clue || ''}
        hints={currentLevel?.hints || []}
        word={currentLevel?.word || ''}
      />
    </div>
  );
}

export default App;
