import { db } from './database';
import type { ExerciseSession } from '../models';

export const sessionStorage = {
  async save(session: ExerciseSession): Promise<void> {
    await db.sessions.put(session);
  },

  async getByProfile(profileId: string, limit = 50): Promise<ExerciseSession[]> {
    return db.sessions
      .where('profileId')
      .equals(profileId)
      .reverse()
      .limit(limit)
      .toArray();
  },

  async getRecentByProfile(profileId: string, days = 30): Promise<ExerciseSession[]> {
    const since = Date.now() - days * 24 * 60 * 60 * 1000;
    return db.sessions
      .where('profileId')
      .equals(profileId)
      .and((s) => (s.completedAt ?? 0) >= since)
      .toArray();
  },

  async countByType(profileId: string, type: string): Promise<number> {
    return db.sessions
      .where('profileId')
      .equals(profileId)
      .and((s) => s.type === type && s.completedAt !== undefined)
      .count();
  },
};
