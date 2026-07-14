import { db } from './database';
import type { ProfileBadge, BadgeId, DailyGoal, Streak } from '../models';
import { DAILY_GOAL_TARGET } from '../models';
import { supabase } from '../lib/supabase';

const todayStr = () => new Date().toISOString().slice(0, 10);

async function syncBadgeToSupabase(badge: ProfileBadge): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('profile_badges').upsert({
    profile_id: badge.profileId,
    badge_id: badge.badgeId,
    earned_at: badge.earnedAt,
  }, { onConflict: 'profile_id,badge_id' });
  if (error) {
    console.error('Failed to sync badge to Supabase:', error.message);
  }
}

async function syncStreakToSupabase(streak: Streak): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('streaks').upsert({
    profile_id: streak.profileId,
    current: streak.current,
    longest: streak.longest,
    last_date: streak.lastDate,
  }, { onConflict: 'profile_id' });
  if (error) {
    console.error('Failed to sync streak to Supabase:', error.message);
  }
}

async function syncDailyGoalToSupabase(goal: DailyGoal): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('daily_goals').upsert({
    profile_id: goal.profileId,
    date: goal.date,
    target_exercises: goal.targetExercises,
    completed_exercises: goal.completedExercises,
    completed: goal.completed,
  }, { onConflict: 'profile_id,date' });
  if (error) {
    console.error('Failed to sync daily goal to Supabase:', error.message);
  }
}

export async function loadGamificationFromSupabase(profileId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const [badgesRes, streakRes, goalRes] = await Promise.all([
    supabase.from('profile_badges').select('*').eq('profile_id', profileId),
    supabase.from('streaks').select('*').eq('profile_id', profileId).maybeSingle(),
    supabase.from('daily_goals').select('*').eq('profile_id', profileId).eq('date', todayStr()).maybeSingle(),
  ]);

  if (badgesRes.data && badgesRes.data.length > 0) {
    const cloudBadges: ProfileBadge[] = badgesRes.data.map((r) => ({
      profileId: r.profile_id as string,
      badgeId: r.badge_id as BadgeId,
      earnedAt: r.earned_at as number,
    }));
    for (const badge of cloudBadges) {
      const existing = await db.badges.get([badge.profileId, badge.badgeId]);
      if (!existing) {
        await db.badges.add(badge);
      }
    }
  }

  if (streakRes.data) {
    const cloudStreak: Streak = {
      profileId: streakRes.data.profile_id as string,
      current: streakRes.data.current as number,
      longest: streakRes.data.longest as number,
      lastDate: streakRes.data.last_date as string,
    };
    const localStreak = await db.streaks.get(profileId);
    if (!localStreak || cloudStreak.longest > localStreak.longest ||
      (cloudStreak.longest === localStreak.longest && cloudStreak.current > localStreak.current)) {
      await db.streaks.put(cloudStreak);
    }
  }

  if (goalRes.data) {
    const cloudGoal: DailyGoal = {
      profileId: goalRes.data.profile_id as string,
      date: goalRes.data.date as string,
      targetExercises: goalRes.data.target_exercises as number,
      completedExercises: goalRes.data.completed_exercises as number,
      completed: goalRes.data.completed as boolean,
    };
    const localGoal = await db.dailyGoals.get([profileId, cloudGoal.date]);
    if (!localGoal || cloudGoal.completedExercises > localGoal.completedExercises) {
      await db.dailyGoals.put(cloudGoal);
    }
  }
}

export const gamificationStorage = {
  async getBadges(profileId: string): Promise<ProfileBadge[]> {
    return db.badges.where('profileId').equals(profileId).toArray();
  },

  async awardBadge(profileId: string, badgeId: BadgeId): Promise<boolean> {
    const existing = await db.badges.get([profileId, badgeId]);
    if (existing) return false;
    const badge: ProfileBadge = { profileId, badgeId, earnedAt: Date.now() };
    await db.badges.add(badge);
    void syncBadgeToSupabase(badge);
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
    void syncStreakToSupabase(updated);
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
    void syncDailyGoalToSupabase(updated);
    return updated;
  },
};
