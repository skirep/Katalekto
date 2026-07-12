import styles from './BadgesPage.module.css';
import { BadgeDisplay } from '../components/gamification';
import { useGamification } from '../hooks';
import type { Profile } from '../models';

interface BadgesPageProps {
  profile: Profile;
}

export function BadgesPage({ profile }: BadgesPageProps) {
  const { badges, streak } = useGamification(profile.id);

  return (
    <div className={`page ${styles.page}`}>
      <h1 className="page-title">Medalles</h1>

      {streak && (
        <div className={`card ${styles.streakCard}`}>
          <span className={styles.streakFire}>🔥</span>
          <div>
            <div className={styles.streakNum}>{streak.current} dies</div>
            <div className="text-muted">Ratxa actual</div>
          </div>
          <div className={styles.streakBest}>
            Millor ratxa: {streak.longest} dies
          </div>
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Medalles guanyades ({badges.length})
        </h2>
        <BadgeDisplay earned={badges} showAll={false} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Totes les medalles</h2>
        <BadgeDisplay earned={badges} showAll />
      </section>
    </div>
  );
}
