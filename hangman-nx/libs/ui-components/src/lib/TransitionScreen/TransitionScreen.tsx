import styles from './TransitionScreen.module.css';
import { ConceptInsight } from '../ConceptInsight/ConceptInsight';

export interface TransitionScreenProps {
  currentRound: number;
  nextPlayerName: string;
  nextPlayerNumber: 1 | 2;
  lastPlayerName?: string;
  lastPlayerScore?: number;
  lastLevelExplanation?: string;
  lastLevelWord?: string;
  lastGameWon?: boolean;
  onStartNextTurn: () => void;
  gameMode?: 'single' | 'multi';
  currentGame?: number;
  gamesPerRound?: number;
}

export function TransitionScreen({
  currentRound,
  nextPlayerName,
  nextPlayerNumber,
  lastPlayerName,
  lastPlayerScore,
  lastLevelExplanation,
  lastLevelWord,
  lastGameWon,
  onStartNextTurn,
  gameMode,
  currentGame,
  gamesPerRound,
}: TransitionScreenProps) {
  const themeClass = nextPlayerNumber === 1 ? styles.player1Theme : styles.player2Theme;
  
  // For multiplayer: only show "View Results" when Player 2 finishes the last question (nextPlayerNumber will be 1)
  // For single player: show "View Results" when the last question is done
  const isFinalTransition = gameMode === 'multi' 
    ? (currentGame !== undefined && gamesPerRound !== undefined && currentGame >= gamesPerRound - 1 && nextPlayerNumber === 1)
    : (currentGame !== undefined && gamesPerRound !== undefined && currentGame >= gamesPerRound - 1);

  return (
    <div className={`${styles.container} ${themeClass}`}>
      <div className={styles.card}>
        <div className={styles.roundInfo}>
          Round {currentRound}
          {currentGame !== undefined && gamesPerRound ? ` — Game ${currentGame + 1}/${gamesPerRound}` : ''}
        </div>
        
        <h1 className={styles.title}>
          {gameMode === 'single' ? `Round ${currentRound}` : `${nextPlayerName}, Get Ready!`}
        </h1>
        
        {lastPlayerName !== undefined && (
          <div className={styles.lastResult}>
            <p>{lastPlayerName} scored <strong>{lastPlayerScore}</strong> last turn</p>
            {!lastGameWon && lastLevelWord && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#58a6ff' }}>
                The answer was: <strong>{lastLevelWord}</strong>
              </p>
            )}
          </div>
        )}

        {lastLevelExplanation && (
          <div className={styles.conceptInsightContainer}>
            <ConceptInsight explanation={lastLevelExplanation} />
          </div>
        )}

        {!isFinalTransition && (
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.vs}>NEXT UP</span>
            <div className={styles.dividerLine} />
          </div>
        )}

        <div className={styles.nextCallout}>
          <div className={styles.playerIcon}>{gameMode === 'multi' ? (nextPlayerNumber === 1 ? '🎮' : '⚡') : (isFinalTransition ? '🏁' : '✍️')}</div>
          <div className={styles.nextPlayerName}>
            {isFinalTransition 
              ? 'Ready for Results?' 
              : gameMode === 'multi' 
              ? `${nextPlayerName}'s Turn` 
              : `Question ${currentGame !== undefined ? currentGame + 2 : 1}`}
          </div>
        </div>

        <button className={styles.startBtn} onClick={onStartNextTurn}>
          {isFinalTransition ? '📊 View Results' : 'Next Question ▶'}
        </button>
      </div>
    </div>
  );
}
