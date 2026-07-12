import { useState, useEffect } from 'react';
import styles from './StatsPage.module.css';
import { sessionStorage } from '../storage';
import { formatDate, formatTime, percentageStr } from '../utils';
import type { Profile, ExerciseSession } from '../models';

interface StatsPageProps {
  profile: Profile;
}

export function StatsPage({ profile }: StatsPageProps) {
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionStorage.getRecentByProfile(profile.id, 30).then((s) => {
      setSessions(s.filter((x) => x.completedAt !== undefined).sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)));
      setLoading(false);
    });
  }, [profile.id]);

  if (loading) {
    return <div className="page"><p className="text-muted text-center">Carregant...</p></div>;
  }

  if (sessions.length === 0) {
    return (
      <div className={`page ${styles.empty}`}>
        <span className={styles.emptyIcon}>📊</span>
        <h1>Estadístiques</h1>
        <p className="text-muted">Encara no tens cap exercici completat. Practica per veure les estadístiques!</p>
      </div>
    );
  }

  const totalExercises = sessions.length;
  const avgScore = Math.round(sessions.reduce((s, x) => s + x.score, 0) / sessions.length);
  const totalTime = sessions.reduce((s, x) => s + ((x.completedAt ?? 0) - x.startedAt), 0);
  const bestScore = Math.max(...sessions.map((s) => s.score));

  // Error frequency from all attempts
  const errorMap: Record<string, number> = {};
  for (const session of sessions) {
    for (const attempt of session.attempts) {
      for (const err of attempt.errorTypes) {
        errorMap[err] = (errorMap[err] ?? 0) + 1;
      }
    }
  }
  const topErrors = Object.entries(errorMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const ERROR_LABELS: Record<string, string> = {
    b_d_confusion: 'Confusió b/d',
    p_q_confusion: 'Confusió p/q',
    omission: 'Omissió de lletres',
    inversion: 'Inversió',
    repetition: 'Repetició',
    substitution: 'Substitució',
    addition: 'Addició de síl·labes',
  };

  return (
    <div className={`page ${styles.page}`}>
      <h1 className="page-title">Estadístiques</h1>

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{totalExercises}</span>
          <span className={styles.statLabel}>Exercicis</span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{avgScore}%</span>
          <span className={styles.statLabel}>Mitjana</span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{bestScore}%</span>
          <span className={styles.statLabel}>Millor</span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{formatTime(Math.round(totalTime / 60000))}m</span>
          <span className={styles.statLabel}>Temps total</span>
        </div>
      </div>

      {/* Top errors */}
      {topErrors.length > 0 && (
        <section className={`card ${styles.errorSection}`}>
          <h2 className={styles.sectionTitle}>Errors més freqüents</h2>
          <div className={styles.errorList}>
            {topErrors.map(([err, count]) => (
              <div key={err} className={styles.errorRow}>
                <span className={styles.errorName}>{ERROR_LABELS[err] ?? err}</span>
                <span className={styles.errorCount}>{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent sessions */}
      <section className={styles.sessionSection}>
        <h2 className={styles.sectionTitle}>Sessions recents</h2>
        <div className={styles.sessionList}>
          {sessions.slice(0, 15).map((session) => (
            <div key={session.id} className={`card ${styles.sessionCard}`}>
              <div className={styles.sessionScore} style={{
                color: session.score >= 80 ? 'var(--color-success)' : session.score >= 50 ? 'var(--color-warning)' : 'var(--color-error)'
              }}>
                {session.score}%
              </div>
              <div className={styles.sessionInfo}>
                <div className={styles.sessionType}>{session.type}</div>
                <div className={styles.sessionMeta}>
                  {percentageStr(session.correctItems, session.totalItems)} correctes
                  · {formatTime(Math.round(session.averageTimeMs))} per element
                </div>
              </div>
              <div className={styles.sessionDate}>
                {formatDate(session.completedAt ?? session.startedAt)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
