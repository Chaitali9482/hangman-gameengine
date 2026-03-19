import { useState } from 'react';
import styles from './StartScreen.module.css';
import capIcon from './assets/graduation-cap.png';

export interface StartScreenProps {
  onStart: (playerName: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    if (playerName.trim() !== '') {
      onStart(playerName.trim());
    }
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
        
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your name..."
            value={playerName}
            onChange={(e) => setPlayerName((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            autoFocus
          />
        </div>
        
        <button
          className={styles.button}
          disabled={playerName.trim() === ''}
          onClick={handleStart}
        >
          Start Game 🚀
        </button>
      </div>
    </div>
  );
}
