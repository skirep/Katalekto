import { db } from './database';
import type { AppSettings } from '../models';
import { DEFAULT_SETTINGS } from '../models';

export const settingsStorage = {
  async get(profileId: string): Promise<AppSettings> {
    const settings = await db.settings.get(profileId);
    if (!settings) {
      const defaults: AppSettings = { ...DEFAULT_SETTINGS, profileId };
      await db.settings.add(defaults);
      return defaults;
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
