import styles from './app.module.css';
import { StartScreen, GameScreen } from '@hangman/ui-components';
import { useGame } from '@hangman/game-logic';
import gameData from '../assets/data.json';

export function App() {
  const {
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
  } = useGame(gameData);

  return (
    <div className={styles.app}>
      {!gameStarted || !currentLevel ? (
        <StartScreen onStart={startGame} />
      ) : (
        <GameScreen 
          playerName={playerName}
          subject={gameData.subject}
          maskedWord={maskedWord}
          guessedLetters={guessedLetters}
          wrongGuessesCount={wrongGuesses.length}
          gameStatus={gameStatus}
          score={score}
          hintsRevealedCount={hintsRevealedCount}
          onGuess={guessLetter}
          onRevealHint={revealHint}
          onRestart={restartGame}
          clue={currentLevel.clue}
          hints={currentLevel.hints}
          word={currentLevel.word}
        />
      )}
    </div>
  );
}

export default App;
