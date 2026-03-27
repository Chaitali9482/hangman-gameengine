import styles from './WinnerScreen.module.css';

export interface PlayerResult {
  name: string;
  scores: number[];
  totalScore: number;
  times?: number[];  // Times per round (for multiplayer)
  mistakes?: number[];  // Mistakes per question
}

export interface WinnerScreenProps {
  player1: PlayerResult;
  player2: PlayerResult;
  onPlayAgain: () => void;
  gameMode?: 'single' | 'multi';
  sessionTotalTime?: number;
}

function getWinner(p1: PlayerResult, p2: PlayerResult): 'player1' | 'player2' | 'tie' {
  if (p1.totalScore !== p2.totalScore) return p1.totalScore > p2.totalScore ? 'player1' : 'player2';
  return 'tie';
}

export function WinnerScreen({ player1, player2, onPlayAgain, gameMode, sessionTotalTime }: WinnerScreenProps) {
  const winner = getWinner(player1, player2);
  const isSinglePlayer = gameMode === 'single';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.trophy}>🏆</div>
        
        {isSinglePlayer ? (
          <h1 className={styles.title}>
            {player1.totalScore > 0 ? '🎉 You Won!' : '❌ Game Over'}
          </h1>
        ) : (
          <h1 className={styles.title}>
            {winner === 'tie'
              ? "It's a Tie!"
              : `${winner === 'player1' ? player1.name : player2.name} Wins!`}
          </h1>
        )}
        
        <div className={`${styles.playerCards} ${isSinglePlayer ? styles.singlePlayer : ''}`}>
          {isSinglePlayer ? (
            <div 
              className={`${styles.playerCard} ${styles.winnerCard}`}
            >
              <div className={styles.playerName}>{player1.name}</div>
              <div className={styles.totalScore}>{player1.totalScore}</div>
              <div className={styles.scoreLabel}>total points</div>
              
              <div className={styles.roundBreakdown}>
                {player1.scores.map((s, i) => (
                  <div key={i} className={styles.roundScore} title={s === 0 ? 'Lost' : 'Won'}>
                    <div>Question {i+1}: {s} pts</div>
                    {player1.mistakes && player1.mistakes[i] !== undefined && (
                      <div className={styles.mistakeCount}>❌ {player1.mistakes[i]}</div>
                    )}
                  </div>
                ))}
              </div>
              
              {player1.mistakes && (
                <div className={styles.totalMistakes}>
                  Total Mistakes: <strong>{player1.mistakes.reduce((a, b) => a + b, 0)}</strong>
                </div>
              )}
            </div>
          ) : (
            [player1, player2].map((player, idx) => {
              const isWinner = 
                (idx === 0 && winner === 'player1') || 
                (idx === 1 && winner === 'player2');
              return (
                <div 
                  key={player.name} 
                  className={`${styles.playerCard} ${isWinner ? styles.winnerCard : ''}`}
                >
                  {isWinner && <div className={styles.crown}>👑</div>}
                  <div className={styles.playerName}>{player.name}</div>
                  <div className={styles.totalScore}>{player.totalScore}</div>
                  <div className={styles.scoreLabel}>total points</div>
                  
                  <div className={styles.roundBreakdown}>
                    {player.scores.map((s, i) => (
                      <div key={i} className={styles.roundScore} title={s === 0 ? 'Lost' : 'Won'}>
                        <div className={styles.scoreRow}>
                          <div>Q{i+1}: {s} pts</div>
                          {player.times && player.times[i] !== undefined && (
                            <div className={styles.roundTime}>⏱️ {player.times[i]}s</div>
                          )}
                        </div>
                        {player.mistakes && player.mistakes[i] !== undefined && (
                          <div className={styles.mistakeCount}>❌ {player.mistakes[i]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {player.mistakes && (
                    <div className={styles.totalMistakes}>
                      Mistakes: <strong>{player.mistakes.reduce((a, b) => a + b, 0)}</strong>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Display session timer */}
        {sessionTotalTime !== undefined && (
          <div className={styles.sessionInfo}>
            <div className={styles.timerInfo}>
              ⏱️ Total Time: <strong>{sessionTotalTime}s</strong>
            </div>
          </div>
        )}

        <button className={styles.playAgainBtn} onClick={onPlayAgain}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
