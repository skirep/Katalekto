import { useState } from 'react';
import styles from './ProfilesPage.module.css';
import { ProfileCard, ProfileForm } from '../components/profile';
import { Button, LoadingSpinner } from '../components/common';
import { useProfiles, useProfileStats } from '../hooks';
import type { Profile } from '../models';

interface ProfilesPageProps {
  onSelect: (profile: Profile) => void;
}

function ProfileWithStats({ profile, onSelect }: { profile: Profile; onSelect: (p: Profile) => void }) {
  const stats = useProfileStats(profile.id);
  return <ProfileCard profile={profile} stats={stats ?? undefined} onClick={() => onSelect(profile)} />;
}

export function ProfilesPage({ onSelect }: ProfilesPageProps) {
  const { profiles, loading, createProfile } = useProfiles();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.logo}>📖</span>
        <h1 className={styles.title}>Lletrix</h1>
        <p className={styles.subtitle}>Qui llegeix avui?</p>
      </div>

      {showForm ? (
        <ProfileForm
          onSave={async (p) => {
            await createProfile(p);
            setShowForm(false);
            onSelect(p);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <div className={styles.list}>
            {profiles.map((p) => (
              <ProfileWithStats key={p.id} profile={p} onSelect={onSelect} />
            ))}
          </div>

          {profiles.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>👋</span>
              <p>Benvingut a Lletrix!</p>
              <p className="text-muted">Crea el teu perfil per començar</p>
            </div>
          )}

          <Button
            className={styles.addBtn}
            variant="primary"
            size="lg"
            icon="+"
            onClick={() => setShowForm(true)}
          >
            Nou perfil
          </Button>
        </>
      )}
    </div>
  );
}
