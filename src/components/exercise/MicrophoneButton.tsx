import styles from './MicrophoneButton.module.css';

interface MicrophoneButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function MicrophoneButton({ isListening, isSupported, onStart, onStop, disabled }: MicrophoneButtonProps) {
  if (!isSupported) {
    return (
      <div className={styles.unsupported}>
        🎤 Micròfon no disponible en aquest navegador
      </div>
    );
  }

  return (
    <button
      className={`${styles.btn} ${isListening ? styles.listening : ''}`}
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      aria-label={isListening ? 'Atura la gravació' : 'Inicia la gravació'}
    >
      <span className={styles.icon}>{isListening ? '⏹️' : '🎤'}</span>
      <span className={styles.label}>
        {isListening ? 'Escoltant...' : 'Llegeix!'}
      </span>
      {isListening && <span className={styles.pulse} />}
    </button>
  );
}
