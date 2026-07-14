import { useState, useEffect } from 'react';
import { AppProvider, useAppContext, AuthProvider, useAuth } from './services';
import { ProfilesPage } from './pages/ProfilesPage';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ExercisesPage } from './pages/ExercisesPage';
import { StatsPage } from './pages/StatsPage';
import { BadgesPage } from './pages/BadgesPage';
import { SettingsPage } from './pages/SettingsPage';
import { BottomNav } from './components/layout';
import { DatabaseReadIndicator, LoadingSpinner } from './components/common';
import { useSettings, useProfiles } from './hooks';
import type { Profile } from './models';
import styles from './App.module.css';

type Page = 'home' | 'exercises' | 'stats' | 'badges' | 'settings';
const POKEMON_SKIN_ART = {
  mew: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
  mewtwo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
} as const;

function AppSettings({ profileId }: { profileId: string }) {
  const { settings } = useSettings(profileId);

  useEffect(() => {
    document.documentElement.dataset.scheme = settings.colorScheme;
    document.documentElement.dataset.skin = settings.skin;
    document.documentElement.dataset.dyslexia = String(settings.dyslexiaMode);
    document.documentElement.dataset.fontSize = settings.fontSize;
  }, [settings]);

  if (settings.skin !== 'pokemon') return null;

  return (
    <>
      <img className={`${styles.skinArt} ${styles.skinArtLeft}`} src={POKEMON_SKIN_ART.mew} alt="" aria-hidden="true" />
      <img className={`${styles.skinArt} ${styles.skinArtRight}`} src={POKEMON_SKIN_ART.mewtwo} alt="" aria-hidden="true" />
    </>
  );
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { currentProfile, setCurrentProfile } = useAppContext();
  const {
    profiles,
    loading: profilesLoading,
    createProfile,
    updateProfile,
    databaseReadStatus,
    databaseReadError,
    loadedUserId,
  } = useProfiles(user?.id);
  const [page, setPage] = useState<Page>('home');
  const [autoHandling, setAutoHandling] = useState(false);
  const waitingForDatabaseRead = Boolean(user && loadedUserId !== user.id);

  useEffect(() => {
    if (!user) {
      setCurrentProfile(null);
    }
  }, [user, setCurrentProfile]);

  useEffect(() => {
    if (!user || profilesLoading || currentProfile || autoHandling || loadedUserId !== user.id) return;

    if (profiles.length === 0 && databaseReadStatus === 'success') {
      setAutoHandling(true);
      const rawName = user.email?.split('@')[0] ?? 'Jugador';
      const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      createProfile(name, 'cat').then((p) => {
        setCurrentProfile(p);
        setAutoHandling(false);
      });
    }
  }, [profiles, profilesLoading, user, currentProfile, autoHandling, createProfile, setCurrentProfile, databaseReadStatus, loadedUserId]);

  if (authLoading || (user && (profilesLoading || waitingForDatabaseRead)) || autoHandling) return <LoadingSpinner />;

  if (!user) return <AuthPage />;

  const databaseIndicator = databaseReadStatus !== 'idle' ? (
    <div className={styles.statusIndicator}>
      <DatabaseReadIndicator status={databaseReadStatus} errorMessage={databaseReadError} />
    </div>
  ) : null;

  if (!currentProfile) {
    return (
      <>
        {databaseIndicator}
        <ProfilesPage onSelect={(p: Profile) => {
          setCurrentProfile(p);
          setPage('home');
        }} />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage profile={currentProfile} onNavigate={(p) => setPage(p as Page)} onSwitchProfile={() => setCurrentProfile(null)} />;
      case 'exercises': return <ExercisesPage profile={currentProfile} />;
      case 'stats': return <StatsPage profile={currentProfile} />;
      case 'badges': return <BadgesPage profile={currentProfile} />;
      case 'settings': return <SettingsPage profile={currentProfile} onUpdateProfile={async (p) => { await updateProfile(p); setCurrentProfile(p); }} />;
    }
  };

  return (
    <>
      <AppSettings profileId={currentProfile.id} />
      {databaseIndicator}
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <BottomNav currentPage={page} onNavigate={(p) => setPage(p as Page)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
