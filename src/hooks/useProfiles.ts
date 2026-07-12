import { useState, useEffect } from 'react';
import { profileStorage } from '../storage';
import type { Profile, ProfileStats } from '../models';

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await profileStorage.getAll();
    setProfiles(data);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const createProfile = async (profile: Profile) => {
    await profileStorage.create(profile);
    await load();
  };

  const updateProfile = async (profile: Profile) => {
    await profileStorage.update(profile);
    await load();
  };

  const deleteProfile = async (id: string) => {
    await profileStorage.delete(id);
    await load();
  };

  return { profiles, loading, createProfile, updateProfile, deleteProfile, refresh: load };
}

export function useProfileStats(profileId: string | null) {
  const [stats, setStats] = useState<ProfileStats | null>(null);

  useEffect(() => {
    if (!profileId) { setStats(null); return; }
    profileStorage.getStats(profileId).then((s) => setStats(s ?? null));
  }, [profileId]);

  return stats;
}
