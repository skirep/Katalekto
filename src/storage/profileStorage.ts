import { db } from './database';
import type { Profile, ProfileStats } from '../models';
import { getLevelFromXp } from '../models';

export const profileStorage = {
  async getAll(): Promise<Profile[]> {
    return db.profiles.orderBy('name').toArray();
  },

  async getById(id: string): Promise<Profile | undefined> {
    return db.profiles.get(id);
  },

  async create(profile: Profile): Promise<void> {
    await db.profiles.add(profile);
    const stats: ProfileStats = {
      profileId: profile.id,
      totalExercises: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      totalTimeMs: 0,
      consecutiveDays: 0,
      lastSessionDate: 0,
      experience: 0,
      level: 1,
      errorFrequency: {},
    };
    await db.profileStats.add(stats);
  },

  async update(profile: Profile): Promise<void> {
    await db.profiles.put(profile);
  },

  async delete(id: string): Promise<void> {
    await db.transaction('rw', [db.profiles, db.profileStats, db.sessions, db.badges, db.dailyGoals, db.streaks, db.settings], async () => {
      await db.profiles.delete(id);
      await db.profileStats.delete(id);
      await db.sessions.where('profileId').equals(id).delete();
      await db.badges.where('profileId').equals(id).delete();
      await db.dailyGoals.where('profileId').equals(id).delete();
      await db.streaks.delete(id);
      await db.settings.delete(id);
    });
  },

  async getStats(profileId: string): Promise<ProfileStats | undefined> {
    return db.profileStats.get(profileId);
  },

  async addExperience(profileId: string, xp: number): Promise<ProfileStats> {
    const stats = await db.profileStats.get(profileId);
    if (!stats) throw new Error('Profile stats not found');
    const newXp = stats.experience + xp;
    const updated: ProfileStats = {
      ...stats,
      experience: newXp,
      level: getLevelFromXp(newXp),
    };
    await db.profileStats.put(updated);
    return updated;
  },

  async updateStats(stats: ProfileStats): Promise<void> {
    await db.profileStats.put(stats);
  },
};
