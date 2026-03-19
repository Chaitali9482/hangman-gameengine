import styles from './HangmanDrawing.module.css';

export interface HangmanDrawingProps {
  numberOfGuesses: number;
}

const HEAD = (
  <g key="head" className={styles.bodyPart}>
    <circle cx="200" cy="80" r="30" stroke="currentColor" fill="none" strokeWidth="4" />
    <circle cx="190" cy="75" r="2" fill="currentColor" />
    <circle cx="210" cy="75" r="2" fill="currentColor" />
    <path d="M 190 90 Q 200 100 210 90" stroke="currentColor" fill="none" strokeWidth="2" />
  </g>
);

const BODY = (
  <line key="body" x1="200" y1="110" x2="200" y2="210" className={styles.bodyPart} />
);

const RIGHT_ARM = (
  <line key="right-arm" x1="200" y1="130" x2="250" y2="180" className={styles.bodyPart} />
);

const LEFT_ARM = (
  <line key="left-arm" x1="200" y1="130" x2="150" y2="180" className={styles.bodyPart} />
);

const RIGHT_LEG = (
  <line key="right-leg" x1="200" y1="210" x2="250" y2="280" className={styles.bodyPart} />
);

const LEFT_LEG = (
  <line key="left-leg" x1="200" y1="210" x2="150" y2="280" className={styles.bodyPart} />
);

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

export function HangmanDrawing({ numberOfGuesses }: HangmanDrawingProps) {
  return (
    <div className={styles.drawingContainer}>
      <svg height="400" width="300" viewBox="0 0 300 400" className={styles.hangmanSvg}>
        {/* Gallow Structure */}
        <line x1="20" y1="380" x2="280" y2="380" className={styles.gallowBase} />
        <line x1="60" y1="380" x2="60" y2="20" className={styles.gallowBeam} />
        <line x1="60" y1="20" x2="200" y2="20" className={styles.gallowBeam} />
        <line x1="200" y1="20" x2="200" y2="50" className={styles.gallowRope} />

        {/* Dynamic Body Parts */}
        {BODY_PARTS.slice(0, numberOfGuesses)}
      </svg>
    </div>
  );
}
