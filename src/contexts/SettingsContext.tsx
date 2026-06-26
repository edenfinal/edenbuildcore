import { createContext, useContext, type ReactNode } from 'react';
import { useSiteSettings } from '../hooks/useData';
import type { SiteSettings } from '../lib/supabase';

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  updateSetting: (key: string, value: any) => Promise<boolean>;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { settings, loading, updateSettings } = useSiteSettings();

  const refresh = async () => {
    window.location.reload();
  };

  const updateSetting = async (key: string, value: any): Promise<boolean> => {
    return updateSettings({ [key]: value } as Partial<SiteSettings>);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, loading, refresh, updateSetting, updateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
