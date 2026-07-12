import styles from './BadgeDisplay.module.css';
import { BADGES } from '../../models';
import type { ProfileBadge } from '../../models';

interface BadgeDisplayProps {
  earned: ProfileBadge[];
  showAll?: boolean;
}

export function BadgeDisplay({ earned, showAll = false }: BadgeDisplayProps) {
  const earnedIds = new Set(earned.map((b) => b.badgeId));
  const allBadges = Object.values(BADGES);
  const badges = showAll ? allBadges : allBadges.filter((b) => earnedIds.has(b.id));

  if (badges.length === 0) {
    return <p className="text-muted text-center">Encara no tens cap medalla. Continua llegint!</p>;
  }

  return (
    <div className={styles.grid}>
      {badges.map((badge) => {
        const isEarned = earnedIds.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`${styles.badge} ${isEarned ? styles.earned : styles.locked}`}
            title={badge.description}
          >
            <span className={styles.icon}>{badge.icon}</span>
            <span className={styles.name}>{badge.name}</span>
            {showAll && !isEarned && (
              <span className={styles.condition}>{badge.condition}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
