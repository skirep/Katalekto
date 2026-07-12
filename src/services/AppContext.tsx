import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Profile } from '../models';

interface AppContextValue {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
}

const AppContext = createContext<AppContextValue>({
  currentProfile: null,
  setCurrentProfile: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  return (
    <AppContext.Provider value={{ currentProfile, setCurrentProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
