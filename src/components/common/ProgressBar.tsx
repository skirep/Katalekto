import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({ value, max, color, label, showPercent }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: color ?? 'var(--color-primary)' }}
        />
      </div>
      {showPercent && <span className={styles.pct}>{Math.round(pct)}%</span>}
    </div>
  );
}
