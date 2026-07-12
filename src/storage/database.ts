import Dexie, { type EntityTable } from 'dexie';
import type {
  Profile,
  ProfileStats,
  ExerciseSession,
  ProfileBadge,
  DailyGoal,
  Streak,
  AppSettings,
} from '../models';

export class KatalektoDatabase extends Dexie {
  profiles!: EntityTable<Profile, 'id'>;
  profileStats!: EntityTable<ProfileStats, 'profileId'>;
  sessions!: EntityTable<ExerciseSession, 'id'>;
  badges!: EntityTable<ProfileBadge, 'profileId'>;
  dailyGoals!: EntityTable<DailyGoal, 'profileId'>;
  streaks!: EntityTable<Streak, 'profileId'>;
  settings!: EntityTable<AppSettings, 'profileId'>;

  constructor() {
    super('katalekto');
    this.version(1).stores({
      profiles: 'id, name, createdAt',
      profileStats: 'profileId, level, experience',
      sessions: 'id, profileId, type, completedAt, startedAt',
      badges: '[profileId+badgeId], profileId',
      dailyGoals: '[profileId+date], profileId',
      streaks: 'profileId',
      settings: 'profileId',
    });
  }
}

export const db = new KatalektoDatabase();
