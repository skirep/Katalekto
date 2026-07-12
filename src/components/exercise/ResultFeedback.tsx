import styles from './ResultFeedback.module.css';
import type { ReadingResult } from '../../models';

interface ResultFeedbackProps {
  result: ReadingResult;
  expected: string;
  recognized: string;
  similarity: number;
}

const CONFIG = {
  correct: { emoji: '🎉', label: 'Molt bé!', color: '#10b981' },
  almost: { emoji: '👍', label: 'Gairebé!', color: '#f59e0b' },
  incorrect: { emoji: '💪', label: 'Intenta-ho de nou', color: '#ef4444' },
};

export function ResultFeedback({ result, expected, recognized, similarity }: ResultFeedbackProps) {
  const cfg = CONFIG[result];

  return (
    <div className={`${styles.container} animate-fade-in`} style={{ borderColor: cfg.color }}>
      <span className={styles.emoji}>{cfg.emoji}</span>
      <span className={styles.label} style={{ color: cfg.color }}>{cfg.label}</span>
      <div className={styles.comparison}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Esperat:</span>
          <span className={styles.rowValue}>{expected}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Llegit:</span>
          <span className={styles.rowValue} style={{ color: cfg.color }}>{recognized || '—'}</span>
        </div>
      </div>
      <div className={styles.similarity}>
        {Math.round(similarity * 100)}% de semblança
      </div>
    </div>
  );
}
