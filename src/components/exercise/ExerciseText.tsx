import styles from './ExerciseText.module.css';

interface ExerciseTextProps {
  text: string;
  size?: 'normal' | 'large';
}

function renderWithColoredLetters(text: string) {
  return text.split('').map((char, i) => {
    if (char === 'b' || char === 'B') {
      return <span key={i} className={styles.letterB}>{char}</span>;
    }
    if (char === 'd' || char === 'D') {
      return <span key={i} className={styles.letterD}>{char}</span>;
    }
    return char;
  });
}

export function ExerciseText({ text, size = 'normal' }: ExerciseTextProps) {
  return (
    <div className={`${styles.container} ${size === 'large' ? styles.large : ''}`}>
      <span className={styles.text}>{renderWithColoredLetters(text)}</span>
    </div>
  );
}
