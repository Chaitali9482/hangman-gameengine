import styles from './Keyboard.module.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export interface KeyboardProps {
  guessedLetters: string[];
  onGuess: (letter: string) => void;
  word?: string; // Add word to check if guess was correct
}

export function Keyboard({ guessedLetters, onGuess, word }: KeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {ALPHABET.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = isGuessed && word?.toUpperCase().includes(letter);
        const isWrong = isGuessed && !word?.toUpperCase().includes(letter);
        
        const buttonClass = `${styles.key} ${isCorrect ? styles.correct : ''} ${isWrong ? styles.wrong : ''}`;

        return (
          <button
            key={letter}
            className={buttonClass}
            onClick={() => onGuess(letter)}
            disabled={isGuessed}
            aria-label={`Guess letter ${letter}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
