import styles from './LoadingSpinner.module.css';

export function LoadingSpinner({ text = 'Carregant...' }: { text?: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <span>{text}</span>
    </div>
  );
}
