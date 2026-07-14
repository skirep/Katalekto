import { db } from './database';
import type { AppSettings } from '../models';
import { DEFAULT_SETTINGS } from '../models';

const ALLOWED_SPEEDS = [1, 2, 4, 6];
const ALLOWED_SKINS = ['original', 'pokemon', 'pikachu-ash', 'team-rocket'] as const;

function normalizeSpeed(speed: number): number {
  if (ALLOWED_SPEEDS.includes(speed)) return speed;
  if (speed >= 6) return 6;
  if (speed >= 4) return 4;
  if (speed >= 2) return 2;
  return 1;
}

function normalizeSkin(skin: AppSettings['skin'] | undefined): AppSettings['skin'] {
  return ALLOWED_SKINS.includes(skin ?? 'original') ? (skin ?? 'original') : 'original';
}

export const settingsStorage = {
  async get(profileId: string): Promise<AppSettings> {
    const settings = await db.settings.get(profileId);
    if (!settings) {
      const defaults: AppSettings = { ...DEFAULT_SETTINGS, profileId };
      await db.settings.add(defaults);
      return defaults;
    }

    const updated: AppSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
      profileId,
      speed: normalizeSpeed(settings.speed),
      skin: normalizeSkin(settings.skin),
    };

    if (JSON.stringify(updated) !== JSON.stringify(settings)) {
      await db.settings.put(updated);
      return updated;
    }

    return updated;
  },

  async save(settings: AppSettings): Promise<void> {
    await db.settings.put(settings);
  },

  async update(profileId: string, partial: Partial<Omit<AppSettings, 'profileId'>>): Promise<AppSettings> {
    const current = await this.get(profileId);
    const updated = { ...current, ...partial };
    await db.settings.put(updated);
    return updated;
  },
};
