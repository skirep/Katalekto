import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './services';
import { ProfilesPage } from './pages/ProfilesPage';
import { HomePage } from './pages/HomePage';
import { ExercisesPage } from './pages/ExercisesPage';
import { StatsPage } from './pages/StatsPage';
import { BadgesPage } from './pages/BadgesPage';
import { SettingsPage } from './pages/SettingsPage';
import { BottomNav } from './components/layout';
import { useSettings } from './hooks';
import type { Profile } from './models';

type Page = 'home' | 'exercises' | 'stats' | 'badges' | 'settings';

function AppSettings({ profileId }: { profileId: string }) {
  const { settings } = useSettings(profileId);

  useEffect(() => {
    document.documentElement.dataset.scheme = settings.colorScheme;
    document.documentElement.dataset.dyslexia = String(settings.dyslexiaMode);
    document.documentElement.dataset.fontSize = settings.fontSize;
  }, [settings]);

  return null;
}

function AppContent() {
  const { currentProfile, setCurrentProfile } = useAppContext();
  const [page, setPage] = useState<Page>('home');

  if (!currentProfile) {
    return (
      <ProfilesPage onSelect={(p: Profile) => {
        setCurrentProfile(p);
        setPage('home');
      }} />
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage profile={currentProfile} onNavigate={(p) => setPage(p as Page)} onSwitchProfile={() => setCurrentProfile(null)} />;
      case 'exercises': return <ExercisesPage profile={currentProfile} />;
      case 'stats': return <StatsPage profile={currentProfile} />;
      case 'badges': return <BadgesPage profile={currentProfile} />;
      case 'settings': return <SettingsPage profile={currentProfile} />;
    }
  };

  return (
    <>
      <AppSettings profileId={currentProfile.id} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <BottomNav currentPage={page} onNavigate={(p) => setPage(p as Page)} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
