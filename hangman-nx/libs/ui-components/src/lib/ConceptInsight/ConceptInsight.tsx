import styles from './ConceptInsight.module.css';

export interface ConceptInsightProps {
  explanation: string;
}

export function ConceptInsight({ explanation }: ConceptInsightProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>💡</div>
          <h3 className={styles.title}>Concept Insight</h3>
        </div>
        <p className={styles.explanation}>{explanation}</p>
      </div>
    </div>
  );
}
