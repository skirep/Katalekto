import styles from './StreakDisplay.module.css';
import type { Streak } from '../../models';

interface StreakDisplayProps {
  streak: Streak;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className={styles.container}>
      <span className={styles.fire}>🔥</span>
      <div className={styles.info}>
        <span className={styles.current}>{streak.current}</span>
        <span className={styles.label}>dies de ratxa</span>
      </div>
      <div className={styles.best}>
        Millor: {streak.longest} dies
      </div>
    </div>
  );
}
