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
  gameStatus: 'playing' | 'won' | 'lost';
  score: number;
  hintsRevealedCount: number;
  onGuess: (letter: string) => void;
  onRevealHint: () => void;
  onRestart: () => void;
  clue?: string;
  hints?: string[];
  word: string;
}

export function GameScreen({ 
  playerName, 
  subject, 
  maskedWord, 
  guessedLetters, 
  wrongGuessesCount,
  gameStatus,
  score,
  hintsRevealedCount,
  onGuess, 
  onRevealHint,
  onRestart,
  clue,
  hints,
  word
}: GameScreenProps) {
  const characters = maskedWord.split('');
  const [isShaking, setIsShaking] = useState(false);
  const maxAttempts = 6;
  const attemptsLeft = maxAttempts - wrongGuessesCount;

  // Trigger shake on wrong guess
  useEffect(() => {
    if (wrongGuessesCount === 0) return;
    setIsShaking(true);
    const timer = setTimeout(() => setIsShaking(false), 400);
    return () => clearTimeout(timer);
  }, [wrongGuessesCount]);

  return (
    <div className={`${styles.container} ${isShaking ? styles.shake : ''}`}>
      {gameStatus === 'won' && <Confetti />}
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerColumn}>
          <span className={styles.label}>PLAYER</span>
          <span className={styles.value}>{playerName}</span>
        </div>
        <div className={styles.headerColumn}>
          <span className={styles.label}>SUBJECT</span>
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
                disabled={gameStatus !== 'playing' || !hints || hintsRevealedCount >= hints.length}
              >
                -20 pts · Hint
              </button>
            </div>
            <div className={styles.hintContent}>
              {hints && hintsRevealedCount > 0 ? (
                <ul className={styles.hintList}>
                  {hints.slice(0, hintsRevealedCount).map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
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
