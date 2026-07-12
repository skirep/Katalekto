import { useState, useEffect } from 'react';
import { settingsStorage } from '../storage';
import type { AppSettings } from '../models';
import { DEFAULT_SETTINGS } from '../models';

export function useSettings(profileId: string | null) {
  const [settings, setSettings] = useState<AppSettings>({ ...DEFAULT_SETTINGS, profileId: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) { setLoading(false); return; }
    settingsStorage.get(profileId).then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, [profileId]);

  const update = async (partial: Partial<Omit<AppSettings, 'profileId'>>) => {
    if (!profileId) return;
    const updated = await settingsStorage.update(profileId, partial);
    setSettings(updated);
  };

  return { settings, loading, update };
}
