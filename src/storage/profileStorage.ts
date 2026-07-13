import { db } from './database';
import type { Profile, ProfileStats } from '../models';
import { getLevelFromXp } from '../models';
import { supabase } from '../lib/supabase';

async function syncToSupabase(profile: Profile): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('profiles').upsert({
    id: profile.id,
    user_id: user.id,
    name: profile.name,
    avatar: profile.avatar,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  });
}

async function deleteFromSupabase(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('profiles').delete().eq('id', id).eq('user_id', user.id);
}

export async function loadProfilesFromSupabase(userId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id as string,
    userId: r.user_id as string,
    name: r.name as string,
    avatar: r.avatar as string,
    createdAt: r.created_at as number,
    updatedAt: r.updated_at as number,
  }));
}

export const profileStorage = {
  async getAll(userId?: string): Promise<Profile[]> {
    if (userId) {
      return db.profiles.where('userId').equals(userId).sortBy('name');
    }
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
    void syncToSupabase(profile);
  },

  async update(profile: Profile): Promise<void> {
    await db.profiles.put(profile);
    void syncToSupabase(profile);
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
    void deleteFromSupabase(id);
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
