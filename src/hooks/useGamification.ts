import { useState, useEffect } from 'react';
import { gamificationStorage } from '../storage';
import type { ProfileBadge, Streak, DailyGoal } from '../models';

export function useGamification(profileId: string | null) {
  const [badges, setBadges] = useState<ProfileBadge[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);

  useEffect(() => {
    if (!profileId) return;
    gamificationStorage.getBadges(profileId).then(setBadges);
    gamificationStorage.getStreak(profileId).then(setStreak);
    gamificationStorage.getDailyGoal(profileId).then(setDailyGoal);
  }, [profileId]);

  const refresh = async () => {
    if (!profileId) return;
    const [b, s, g] = await Promise.all([
      gamificationStorage.getBadges(profileId),
      gamificationStorage.getStreak(profileId),
      gamificationStorage.getDailyGoal(profileId),
    ]);
    setBadges(b);
    setStreak(s);
    setDailyGoal(g);
  };

  return { badges, streak, dailyGoal, refresh };
}
