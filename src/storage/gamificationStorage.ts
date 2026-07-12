import { db } from './database';
import type { ProfileBadge, BadgeId, DailyGoal, Streak } from '../models';
import { DAILY_GOAL_TARGET } from '../models';

const todayStr = () => new Date().toISOString().slice(0, 10);

export const gamificationStorage = {
  async getBadges(profileId: string): Promise<ProfileBadge[]> {
    return db.badges.where('profileId').equals(profileId).toArray();
  },

  async awardBadge(profileId: string, badgeId: BadgeId): Promise<boolean> {
    const existing = await db.badges.get([profileId, badgeId]);
    if (existing) return false;
    await db.badges.add({ profileId, badgeId, earnedAt: Date.now() });
    return true;
  },

  async getStreak(profileId: string): Promise<Streak> {
    const streak = await db.streaks.get(profileId);
    if (!streak) {
      const initial: Streak = { profileId, current: 0, longest: 0, lastDate: '' };
      await db.streaks.add(initial);
      return initial;
    }
    return streak;
  },

  async updateStreak(profileId: string): Promise<Streak> {
    const streak = await this.getStreak(profileId);
    const today = todayStr();
    if (streak.lastDate === today) return streak;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newCurrent = streak.lastDate === yesterday ? streak.current + 1 : 1;
    const newLongest = Math.max(newCurrent, streak.longest);
    const updated: Streak = {
      ...streak,
      current: newCurrent,
      longest: newLongest,
      lastDate: today,
    };
    await db.streaks.put(updated);
    return updated;
  },

  async getDailyGoal(profileId: string): Promise<DailyGoal> {
    const today = todayStr();
    let goal = await db.dailyGoals.get([profileId, today]);
    if (!goal) {
      goal = {
        profileId,
        date: today,
        targetExercises: DAILY_GOAL_TARGET,
        completedExercises: 0,
        completed: false,
      };
      await db.dailyGoals.add(goal);
    }
    return goal;
  },

  async incrementDailyGoal(profileId: string): Promise<DailyGoal> {
    const goal = await this.getDailyGoal(profileId);
    const updated: DailyGoal = {
      ...goal,
      completedExercises: goal.completedExercises + 1,
      completed: goal.completedExercises + 1 >= goal.targetExercises,
    };
    await db.dailyGoals.put(updated);
    return updated;
  },
};
