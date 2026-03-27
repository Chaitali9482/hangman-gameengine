import { useState } from 'react';
import styles from './StartScreen.module.css';
import capIcon from './assets/graduation-cap.png';
import type { GameMode } from '@hangman/game-logic';

export interface StartScreenProps {
  onStart: (player1Name: string, gameMode: GameMode, player2Name?: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('single');

  const canStart = player1Name.trim() !== '' && 
    (gameMode === 'single' || player2Name.trim() !== '');

  const handleStart = () => {
    if (!canStart) return;
    onStart(
      player1Name.trim(), 
      gameMode, 
      gameMode === 'multi' ? player2Name.trim() : undefined
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <img src={capIcon} alt="Graduation Cap" className={styles.icon} />
        </div>
        
        <h1 className={styles.title}>Hangman</h1>
        <h2 className={styles.subtitle}>SCIENCE — CLASS 10</h2>
        <p className={styles.description}>
          Guess the word letter by letter before you run out of attempts!
        </p>

        {/* Mode Selector */}
        <div className={styles.modeSelector}>
          <button
            className={`${styles.modeCard} ${gameMode === 'single' ? styles.activeCard : ''}`}
            onClick={() => setGameMode('single')}
            type="button"
          >
            <div className={styles.modeIcon}>📱</div>
            <div className={styles.modeInfo}>
              <div className={styles.modeTitle}>Single Player</div>
              <div className={styles.modeDesc}>Challenge yourself</div>
            </div>
          </button>

          <button
            className={`${styles.modeCard} ${gameMode === 'multi' ? styles.activeCard : ''}`}
            onClick={() => setGameMode('multi')}
            type="button"
          >
            <div className={styles.modeIcon}>👥</div>
            <div className={styles.modeInfo}>
              <div className={styles.modeTitle}>Two Players</div>
              <div className={styles.modeDesc}>Battle a friend</div>
            </div>
          </button>
        </div>

        {/* Player 1 */}
        <div className={styles.inputWrapper}>
          <label className={styles.inputLabel}>
            {gameMode === 'multi' ? 'Player 1' : 'Your Name'}
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter name..."
            value={player1Name}
            onChange={(e) => setPlayer1Name((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            autoFocus
          />
        </div>

        {/* Player 2 (only in multi mode) */}
        {gameMode === 'multi' && (
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Player 2</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter name..."
              value={player2Name}
              onChange={(e) => setPlayer2Name((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>
        )}
        
        <button
          className={styles.button}
          disabled={!canStart}
          onClick={handleStart}
        >
          {gameMode === 'multi' ? '⚔️ Start Battle!' : 'Start Game 🚀'}
        </button>
      </div>
    </div>
  );
}
