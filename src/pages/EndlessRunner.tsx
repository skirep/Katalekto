import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './EndlessRunner.module.css';
import { ExerciseText, ResultFeedback } from '../components/exercise';
import { Button } from '../components/common';
import { useSettings, useSpeechRecognition } from '../hooks';
import { calculateSimilarity, classifyResult } from '../scoring';
import { shuffleItems } from '../exercises';
import type { ExerciseItem, Profile, ReadingResult } from '../models';

interface EndlessRunnerProps {
  profile: Profile;
  itemPool: ExerciseItem[];
  label: string;
  onFinish: () => void;
}

const CORRECT_DISPLAY_MS = 600;
const ERROR_DISPLAY_MS = 1500;

export function EndlessRunner({ profile, itemPool, onFinish }: EndlessRunnerProps) {
  const { settings } = useSettings(profile.id);
  const { transcript, isListening, error, isSupported, start, stop, setTranscript } = useSpeechRecognition();

  const shuffledPoolRef = useRef(shuffleItems(itemPool));
  const poolIndexRef = useRef(0);

  const firstItem = shuffledPoolRef.current[0] ?? itemPool[0];
  const [currentItem, setCurrentItem] = useState<ExerciseItem>(firstItem);
  const currentItemRef = useRef<ExerciseItem>(firstItem);

  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);

  const [phase, setPhase] = useState<'ready' | 'listening' | 'result' | 'done'>('ready');
  const phaseRef = useRef<'ready' | 'listening' | 'result' | 'done'>('ready');

  const [lastResult, setLastResult] = useState<{ result: ReadingResult; recognized: string; similarity: number } | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(0);

  const transcriptRef = useRef('');
  const startTimeRef = useRef(0);
  const itemDeadlineRef = useRef(0);
  const readTimeoutRef = useRef<number | null>(null);
  const nextTimeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback((timer: { current: number | null }) => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const getNextItem = useCallback(() => {
    poolIndexRef.current++;
    if (poolIndexRef.current >= shuffledPoolRef.current.length) {
      shuffledPoolRef.current = shuffleItems(itemPool);
      poolIndexRef.current = 0;
    }
    const item = shuffledPoolRef.current[poolIndexRef.current];
    currentItemRef.current = item;
    setCurrentItem(item);
    return item;
  }, [itemPool]);

  const evaluateCurrentAttempt = useCallback((recognizedText: string) => {
    if (phaseRef.current !== 'listening') return;
    clearTimer(readTimeoutRef);
    const similarity = calculateSimilarity(currentItemRef.current.text, recognizedText);
    const result = classifyResult(similarity);
    setLastResult({ result, recognized: recognizedText, similarity });
    if (result === 'correct') {
      streakRef.current++;
      setStreak(streakRef.current);
    }
    setPhase('result');
  }, [clearTimer]);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  // ready → listening
  useEffect(() => {
    if (phase !== 'ready') return;
    setTranscript('');
    transcriptRef.current = '';
    setLastResult(null);
    const durationMs = Math.max(1000, Math.round(settings.speed * 1000));
    startTimeRef.current = Date.now();
    itemDeadlineRef.current = startTimeRef.current + durationMs;
    setTimeLeftMs(durationMs);
    setPhase('listening');
    start();
    readTimeoutRef.current = window.setTimeout(() => {
      stop();
      setTimeLeftMs(0);
      if (!transcriptRef.current.trim()) {
        // Time's up with nothing said → game over
        phaseRef.current = 'done';
        setPhase('done');
      } else {
        evaluateCurrentAttempt(transcriptRef.current);
      }
    }, durationMs);
    return () => { clearTimer(readTimeoutRef); };
  }, [phase, settings.speed, start, stop, setTranscript, clearTimer, evaluateCurrentAttempt]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'listening') return;
    const intervalId = window.setInterval(() => {
      setTimeLeftMs(Math.max(0, itemDeadlineRef.current - Date.now()));
    }, 100);
    return () => window.clearInterval(intervalId);
  }, [phase]);

  // When recognition ends naturally
  useEffect(() => {
    if (!isListening && phase === 'listening') {
      evaluateCurrentAttempt(transcriptRef.current);
    }
  }, [isListening, phase, evaluateCurrentAttempt]);

  // result → next or done
  useEffect(() => {
    if (phase !== 'result' || !lastResult) return;
    const delay = lastResult.result === 'correct' ? CORRECT_DISPLAY_MS : ERROR_DISPLAY_MS;
    nextTimeoutRef.current = window.setTimeout(() => {
      if (lastResult.result === 'correct') {
        getNextItem();
        setPhase('ready');
      } else {
        setPhase('done');
      }
    }, delay);
    return () => { clearTimer(nextTimeoutRef); };
  }, [phase, lastResult, getNextItem, clearTimer]);

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimer(readTimeoutRef);
    clearTimer(nextTimeoutRef);
    stop();
  }, [clearTimer, stop]);

  const handlePlayAgain = useCallback(() => {
    shuffledPoolRef.current = shuffleItems(itemPool);
    poolIndexRef.current = 0;
    const item = shuffledPoolRef.current[0];
    currentItemRef.current = item;
    setCurrentItem(item);
    streakRef.current = 0;
    setStreak(0);
    setLastResult(null);
    setPhase('ready');
  }, [itemPool]);

  if (phase === 'done') {
    const s = streakRef.current;
    const emoji = s >= 20 ? '🏆' : s >= 10 ? '🎉' : s >= 5 ? '👍' : '💪';
    return (
      <div className={`page ${styles.done}`}>
        <span className={styles.doneEmoji}>{emoji}</span>
        <h1 className={styles.doneTitle}>Fi del joc!</h1>
        <div className={`card ${styles.streakCard}`}>
          <div className={styles.streakValue}>{s}</div>
          <div className="text-muted">{s === 1 ? 'encert seguit' : 'encerts seguits'}</div>
          {lastResult && lastResult.result !== 'correct' && (
            <div className={styles.lastAttempt}>
              <div>Esperada: <strong>{currentItem.text}</strong></div>
              {lastResult.recognized && (
                <div>Reconegut: <em>{lastResult.recognized}</em></div>
              )}
            </div>
          )}
          {!lastResult && (
            <div className={styles.lastAttempt}>Temps esgotat!</div>
          )}
        </div>
        <Button size="lg" variant="primary" onClick={handlePlayAgain}>
          🔄 Tornar a jugar
        </Button>
        <Button size="lg" onClick={onFinish}>
          🏠 Tornar a l&apos;inici
        </Button>
      </div>
    );
  }

  return (
    <div className={`page ${styles.runner}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.streak}>🔥 {streak}</span>
        <button className={styles.closeBtn} onClick={onFinish} aria-label="Sortir">✕</button>
      </div>

      <ExerciseText text={currentItem.text} />

      {error && <p className="text-error text-center">{error}</p>}
      {!isSupported && <p className="text-error text-center">🎤 Micròfon no disponible en aquest navegador</p>}

      {lastResult && (
        <ResultFeedback
          result={lastResult.result}
          expected={currentItem.text}
          recognized={lastResult.recognized}
          similarity={lastResult.similarity}
        />
      )}

      <div className={styles.controls}>
        {phase === 'listening' && (
          <p className="text-muted">⏱️ {Math.ceil(timeLeftMs / 1000)}s</p>
        )}
        {phase === 'result' && lastResult?.result === 'correct' && (
          <p className="text-muted">Preparant el següent...</p>
        )}
      </div>
    </div>
  );
}
