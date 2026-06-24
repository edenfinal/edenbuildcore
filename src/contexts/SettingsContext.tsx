import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  footer_text: string;
  copyright_text: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  google_maps_embed: string;
  business_hours: Record<string, string>;
  social_links: Record<string, string>;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  seo_enabled: boolean;
  google_analytics_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  heading_font: string;
  body_font: string;
  bg_color: string;
  text_color: string;
  [key: string]: any;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  updateSetting: (key: string, value: any) => Promise<void>;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: SiteSettings = {
  site_name: 'Eden Buildcore',
  site_tagline: 'Building Excellence Since 2008',
  site_description: 'Leading construction company in Pakistan',
  logo_url: '',
  favicon_url: '',
  footer_text: '',
  copyright_text: '2024 Eden Buildcore. All rights reserved.',
  address: 'Plot 45, Industrial Area, Karachi, Pakistan',
  phone: '+92 300 1234567',
  email: 'info@edenbuildcore.com',
  whatsapp: '+92 300 1234567',
  google_maps_embed: '',
  business_hours: {},
  social_links: {},
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  seo_enabled: true,
  google_analytics_id: '',
  primary_color: '#c49028',
  secondary_color: '#030810',
  accent_color: '#c49028',
  heading_font: 'Inter',
  body_font: 'Inter',
  bg_color: '#030810',
  text_color: '#ffffff',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.warn('Settings fetch error:', error);
        setSettings(defaultSettings);
        return;
      }

      if (data) {
        const merged = { ...defaultSettings, ...data };
        setSettings(merged);
        // Apply CSS variables
        applyThemeColors(merged);
      } else {
        setSettings(defaultSettings);
      }
    } catch (e) {
      console.error('Settings error:', e);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refresh = async () => {
    setLoading(true);
    await fetchSettings();
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .single();

      if (error) throw error;

      setSettings((prev) => prev ? { ...prev, [key]: value } : null);
    } catch (e) {
      console.error('Update setting error:', e);
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .single();

      if (error) throw error;

      setSettings((prev) => prev ? { ...prev, ...updates } : null);
      applyThemeColors({ ...settings, ...updates } as SiteSettings);
    } catch (e) {
      console.error('Update settings error:', e);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh, updateSetting, updateSettings }}>
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

function applyThemeColors(settings: SiteSettings) {
  const root = document.documentElement;
  if (settings.primary_color) root.style.setProperty('--primary-color', settings.primary_color);
  if (settings.secondary_color) root.style.setProperty('--secondary-color', settings.secondary_color);
  if (settings.accent_color) root.style.setProperty('--accent-color', settings.accent_color);
  if (settings.heading_font) root.style.setProperty('--heading-font', settings.heading_font);
  if (settings.body_font) root.style.setProperty('--body-font', settings.body_font);
}
