import { useState, useEffect } from 'react';
import styles from './GameScreen.module.css';
import { Keyboard } from '../Keyboard/Keyboard';
import { HangmanDrawing } from '../HangmanDrawing/HangmanDrawing';
import { Confetti } from '../Confetti/Confetti';

export interface GameScreenProps {
  playerName: string;
  subject: string;
  maskedWord: string;
  guessedLetters: string[];
  wrongGuessesCount: number;
  maxAttempts: number;
  gameStatus: 'playing' | 'won' | 'lost';
  score: number;
  hintsRevealedCount: number;
  currentRound?: number;
  currentPlayerNumber?: 1 | 2;
  currentGame?: number;
  gamesPerRound?: number;
  onGuess: (letter: string) => void;
  onRevealHint: () => void;
  onRestart: () => void;
  onQuit: () => void;
  clue: string;
  hints: string[];
  word: string;
}

export function GameScreen({ 
  playerName, 
  subject, 
  maskedWord, 
  guessedLetters, 
  wrongGuessesCount,
  maxAttempts,
  gameStatus,
  score,
  hintsRevealedCount,
  currentRound,
  currentPlayerNumber,
  currentGame,
  gamesPerRound,
  onGuess, 
  onRevealHint,
  onRestart,
  onQuit,
  clue,
  hints,
  word
}: GameScreenProps) {
  const characters = maskedWord.split('');
  const [isShaking, setIsShaking] = useState(false);
  const attemptsLeft = maxAttempts - wrongGuessesCount;

  const playerTheme = currentPlayerNumber === 1 ? styles.player1 : styles.player2;

  // Trigger shake on wrong guess
  useEffect(() => {
    if (wrongGuessesCount === 0) return;
    setIsShaking(true);
    const timer = setTimeout(() => setIsShaking(false), 400);
    return () => clearTimeout(timer);
  }, [wrongGuessesCount]);

  return (
    <div className={`${styles.container} ${isShaking ? styles.shake : ''} ${playerTheme}`}>
      {/* Quit Button */}
      <button className={styles.quitButton} onClick={onQuit} aria-label="Quit game">
        ✕
      </button>
      {gameStatus === 'won' && <Confetti />}
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerColumn}>
          {currentRound && (
            <div className={styles.roundBadge}>
              {currentGame !== undefined && gamesPerRound ? (
                <>Question {currentGame + 1}/{gamesPerRound}
                  {currentPlayerNumber && (
                    <span className={styles.playerIndicator}> — Player {currentPlayerNumber}</span>
                  )}
                </>
              ) : (
                <>Round {currentRound} — {playerName}'s Turn</>
              )}
            </div>
          )}
          <span className={styles.label}>PLAYER</span>
          <span className={styles.value}>{playerName}</span>
          <span className={styles.subject}>{subject}</span>
        </div>
        <div className={styles.headerColumn}>
          <span className={styles.label}>SCORE</span>
          <span className={styles.score}>{score}</span>
        </div>
      </header>

      {/* Attempts Bar */}
      <section className={styles.attemptsSection}>
        <div className={styles.attemptsLabels}>
          <span className={styles.attemptsTitle}>Attempts used</span>
          <span className={styles.attemptsCount}>{attemptsLeft} left of {maxAttempts}</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progress} 
            style={{ width: `${(attemptsLeft / maxAttempts) * 100}%` }} 
          />
        </div>
      </section>

      <main className={styles.mainArea}>
        {/* Left Column: Gallow */}
        <div className={styles.gallowColumn}>
          <HangmanDrawing numberOfGuesses={wrongGuessesCount} />
        </div>

        {/* Right Column: Game Info */}
        <div className={styles.infoColumn}>
          {clue && (
            <p className={styles.clue}>
              <span className={styles.clueLabel}>Clue:</span> {clue}
            </p>
          )}

          <section className={styles.wordDisplay}>
            {characters.map((char, index) => (
              <div 
                key={`${char}-${index}`} 
                className={char === ' ' ? styles.space : styles.letterSlot}
              >
                <span className={styles.letter}>{char !== '_' ? char : ''}</span>
                {char !== ' ' && <div className={styles.underline} />}
              </div>
            ))}
          </section>
          
          <div className={styles.letterCount}>{word.length} letters</div>

          {/* Hint System */}
          <section className={styles.hintBox}>
            <div className={styles.hintHeader}>
              <div className={styles.hintTitle}>💡 HINTS</div>
              <button 
                className={styles.hintButton} 
                onClick={onRevealHint}
                disabled={gameStatus !== 'playing' || hintsRevealedCount >= hints.length}
              >
                {hintsRevealedCount >= hints.length ? 'All Used' : '-20 pts · Hint'}
              </button>
            </div>
            <div className={styles.hintContent}>
              {hintsRevealedCount > 0 ? (
                <ul className={styles.hintList}>
                  {hints.slice(0, hintsRevealedCount).map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                  {hintsRevealedCount >= hints.length && (
                    <li className={styles.hintsExhausted}>✓ All hints revealed</li>
                  )}
                </ul>
              ) : (
                <p className={styles.noHints}>No hints revealed yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Keyboard Footer */}
      <footer className={styles.footer}>
        <Keyboard 
          guessedLetters={guessedLetters} 
          onGuess={onGuess} 
          word={word}
        />
      </footer>

      {/* Overlays */}
      {gameStatus !== 'playing' && (
        <div className={styles.overlay}>
          <div className={`${styles.modal} ${styles[gameStatus]}`}>
            <h2 className={styles.modalTitle}>
              {gameStatus === 'won' ? '🎉 Victory!' : '💀 Game Over'}
            </h2>
            <p className={styles.modalText}>
              {gameStatus === 'won' 
                ? `Amazing job, ${playerName}! You guessed it.` 
                : 'Better luck next time! The word was ' + word}
            </p>
            <button className={styles.restartButton} onClick={onRestart}>
              Play Again 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
