import { db } from './database';
import type { AppSettings } from '../models';
import { DEFAULT_SETTINGS } from '../models';

const ALLOWED_SPEEDS = [1, 2, 4, 6];

function normalizeSpeed(speed: number): number {
  if (ALLOWED_SPEEDS.includes(speed)) return speed;
  if (speed >= 6) return 6;
  if (speed >= 4) return 4;
  if (speed >= 2) return 2;
  return 1;
}

export const settingsStorage = {
  async get(profileId: string): Promise<AppSettings> {
    const settings = await db.settings.get(profileId);
    if (!settings) {
      const defaults: AppSettings = { ...DEFAULT_SETTINGS, profileId };
      await db.settings.add(defaults);
      return defaults;
    }
    const normalizedSpeed = normalizeSpeed(settings.speed);
    if (normalizedSpeed !== settings.speed) {
      const updated = { ...settings, speed: normalizedSpeed };
      await db.settings.put(updated);
      return updated;
    }
    return settings;
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
