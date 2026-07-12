import styles from './ExerciseText.module.css';

interface ExerciseTextProps {
  text: string;
  size?: 'normal' | 'large';
}

export function ExerciseText({ text, size = 'normal' }: ExerciseTextProps) {
  return (
    <div className={`${styles.container} ${size === 'large' ? styles.large : ''}`}>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
