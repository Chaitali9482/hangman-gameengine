import styles from './Confetti.module.css';

export function Confetti() {
  const pieces = Array.from({ length: 50 });

  return (
    <div className={styles.confettiContainer}>
      {pieces.map((_, i) => (
        <div 
          key={i} 
          className={styles.confettiPiece} 
          style={{ 
            '--delay': `${Math.random() * 3}s`,
            '--left': `${Math.random() * 100}%`,
            '--color': `hsl(${Math.random() * 360}, 70%, 60%)`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
