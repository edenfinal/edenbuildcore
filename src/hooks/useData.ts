import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  SiteSettings,
  HeroSlide,
  Project,
  ProjectCategory,
  Service,
  TeamMember,
  Client,
  Testimonial,
  Certification,
  GalleryItem,
  BlogPost,
  BlogCategory,
  Job,
  ContactInquiry,
  Statistic,
  PageContent,
  PageHero
} from '../lib/supabase';

// Generic data fetcher hook
function createDataHook<T>(tableName: string, orderField: string = 'order_index') {
  return function useData() {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        const { data: result, error } = await supabase
          .from(tableName)
          .select('*')
          .order(orderField);

        if (error) throw error;
        setData(result as T[]);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
  };
}

// Site Settings Hook
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const { data: newData, error: insertError } = await supabase
            .from('site_settings')
            .insert({})
            .select()
            .single();

          if (insertError) throw insertError;
          setSettings(newData);
        } else {
          setSettings(data);
        }
      } catch (e) {
        console.error('Site settings fetch error:', e);
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<SiteSettings>): Promise<boolean> => {
    try {
      if (settings?.id) {
        const { error } = await supabase
          .from('site_settings')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', settings.id);
        if (error) {
          console.error('Update settings error:', error);
          return false;
        }
        setSettings({ ...settings, ...updates } as SiteSettings);
        return true;
      }

      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) return false;
        setSettings({ ...updates } as SiteSettings);
        return true;
      }

      const { data: newData, error } = await supabase
        .from('site_settings')
        .insert({ ...updates })
        .select()
        .maybeSingle();
      if (error) return false;
      setSettings(newData as SiteSettings);
      return true;
    } catch (e) {
      console.error('Update settings exception:', e);
      return false;
    }
  };

  return { settings, loading, error, updateSettings };
}

// Page Content Hook
export function usePageContent(pageId: string) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_id', pageId);

        if (error) throw error;

        const map: Record<string, string> = {};
        (data as PageContent[]).forEach((item) => {
          map[`${item.section_key}.${item.content_key}`] = item.content_value;
        });
        setContent(map);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [pageId]);

  // Supabase content is the source of truth; fallback is only an emergency backup on fetch error.
  const get = (section: string, key: string, fallback: string = ''): string => {
    if (loading) return '';

    const dbKey = `${section}.${key}`;
    if (dbKey in content) {
      return content[dbKey] || '';
    }
    return error ? fallback : '';
  };

  const updateContent = async (section: string, key: string, value: string): Promise<boolean> => {
    const { error } = await supabase
      .from('page_content')
      .update({ content_value: value, updated_at: new Date().toISOString() })
      .eq('page_id', pageId)
      .eq('section_key', section)
      .eq('content_key', key);

    if (!error) {
      setContent((prev) => ({ ...prev, [`${section}.${key}`]: value }));
      return true;
    }
    return false;
  };

  return { content, loading, error, get, updateContent };
}

// All page content for admin editor
export function useAllPageContent() {
  const [content, setContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_id')
        .order('section_key')
        .order('content_key');

      if (error) throw error;
      setContent(data as PageContent[]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateItem = async (id: string, value: string): Promise<boolean> => {
    const { error } = await supabase
      .from('page_content')
      .update({ content_value: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setContent((prev) =>
        prev.map((item) => (item.id === id ? { ...item, content_value: value } : item))
      );
      return true;
    }
    return false;
  };

  return { content, loading, error, refetch: fetchData, updateItem };
}

// Hero Slides Hook
export function useHeroSlides() {
  const [data, setData] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Create CRUD hooks for admin
export function useProjects() {
  return createDataHook<Project>('projects', 'order_index')();
}

export function useProjectCategories() {
  return createDataHook<ProjectCategory>('project_categories', 'order_index')();
}

export function useServices() {
  return createDataHook<Service>('services', 'order_index')();
}

export function useTeamMembers() {
  return createDataHook<TeamMember>('team_members', 'order_index')();
}

export function useClients() {
  return createDataHook<Client>('clients', 'order_index')();
}

export function useTestimonials() {
  return createDataHook<Testimonial>('testimonials', 'order_index')();
}

export function useCertifications() {
  return createDataHook<Certification>('certifications', 'order_index')();
}

export function useGallery() {
  return createDataHook<GalleryItem>('gallery_items', 'order_index')();
}

export function useBlogPosts() {
  return createDataHook<BlogPost>('blog_posts', 'created_at')();
}

export function useBlogCategories() {
  return createDataHook<BlogCategory>('blog_categories', 'order_index')();
}

export function useJobs() {
  return createDataHook<Job>('jobs', 'created_at')();
}

export function useStatistics() {
  return createDataHook<Statistic>('statistics', 'order_index')();
}

export function useContactInquiries() {
  return createDataHook<ContactInquiry>('contact_inquiries', 'created_at')();
}

// Auto counters — experience is always derived from company_start_year in site_settings.
// All other counters come from the statistics table.
export function useAutoCounters() {
  const [counters, setCounters] = useState({
    projects: 0,
    clients: 0,
    team: 0,
    experience: 0,
    labels: {
      experience: '',
      projects: '',
      clients: '',
      team: '',
    },
    suffixes: {
      experience: '+',
      projects: '+',
      clients: '+',
      team: '+',
    },
    prefixes: {
      experience: '',
      projects: '',
      clients: '',
      team: '',
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounters() {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          supabase.from('statistics').select('stat_key, stat_value, stat_prefix, stat_suffix, description').eq('is_active', true),
          supabase.from('site_settings').select('company_start_year').limit(1).maybeSingle(),
        ]);

        const statsMap: Record<string, any> = {};
        (statsRes.data || []).forEach((s: any) => {
          statsMap[s.stat_key] = s;
        });

        const startYear = settingsRes.data?.company_start_year
          ? parseInt(String(settingsRes.data.company_start_year))
          : new Date().getFullYear();
        const experience = Math.max(0, new Date().getFullYear() - startYear);
        const readValue = (key: string) => parseInt(statsMap[key]?.stat_value || '0') || 0;
        const readText = (key: string, field: string) => statsMap[key]?.[field] || '';

        setCounters({
          projects: readValue('projects_completed'),
          clients: readValue('happy_clients'),
          team: readValue('team_members'),
          experience,
          labels: {
            experience: readText('years_experience', 'description'),
            projects: readText('projects_completed', 'description'),
            clients: readText('happy_clients', 'description'),
            team: readText('team_members', 'description'),
          },
          suffixes: {
            experience: readText('years_experience', 'stat_suffix') || '+',
            projects: readText('projects_completed', 'stat_suffix') || '+',
            clients: readText('happy_clients', 'stat_suffix') || '+',
            team: readText('team_members', 'stat_suffix') || '+',
          },
          prefixes: {
            experience: readText('years_experience', 'stat_prefix'),
            projects: readText('projects_completed', 'stat_prefix'),
            clients: readText('happy_clients', 'stat_prefix'),
            team: readText('team_members', 'stat_prefix'),
          },
        });
      } catch (e) {
        console.error('Counter fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCounters();
  }, []);

  return { counters, loading };
}

// Notifications hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n: any) => !n.is_read).length);
    } catch (e) {
      console.error('Notifications error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    fetchNotifications();
  };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch: fetchNotifications };
}

// Page Hero hook
export function usePageHero(pageId: string) {
  const [hero, setHero] = useState<PageHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHero = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_heroes')
        .select('*')
        .eq('page_id', pageId)
        .maybeSingle();

      if (error) throw error;
      setHero(data as PageHero | null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  const updateHero = useCallback(async (updates: Partial<PageHero>) => {
    try {
      const { data, error } = await supabase
        .from('page_heroes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('page_id', pageId)
        .select()
        .single();

      if (error) throw error;
      setHero(data as PageHero);
      return true;
    } catch (e) {
      console.error('Update hero error:', e);
      return false;
    }
  }, [pageId]);

  return { hero, loading, error, refetch: fetchHero, updateHero };
}

// All page heroes hook for admin
export function useAllPageHeroes() {
  const [heroes, setHeroes] = useState<PageHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHeroes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_heroes')
        .select('*')
        .order('page_id');

      if (error) throw error;
      setHeroes(data as PageHero[]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const updateHero = useCallback(async (id: string, updates: Partial<PageHero>) => {
    try {
      const { data, error } = await supabase
        .from('page_heroes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setHeroes((prev) => prev.map((h) => (h.id === id ? (data as PageHero) : h)));
      return true;
    } catch (e) {
      console.error('Update hero error:', e);
      return false;
    }
  }, []);

  const createHero = useCallback(async (heroData: Partial<PageHero>) => {
    try {
      const { data, error } = await supabase
        .from('page_heroes')
        .insert(heroData)
        .select()
        .single();

      if (error) throw error;
      setHeroes((prev) => [...prev, data as PageHero]);
      return data as PageHero;
    } catch (e) {
      console.error('Create hero error:', e);
      return null;
    }
  }, []);

  return { heroes, loading, error, refetch: fetchHeroes, updateHero, createHero };
}

// CRUD Operations
export const crud = {
  async create<T>(table: string, data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    if (error) {
      console.error('Create error:', error);
      return null;
    }
    return result as T;
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(table)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Update error:', error);
      return null;
    }
    return result as T;
  },

  async delete(table: string, id: string): Promise<boolean> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Delete error:', error);
      return false;
    }
    return true;
  },

  async get<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Get error:', error);
      return null;
    }
    return data as T;
  },

  async getAll<T>(table: string, orderField: string = 'created_at'): Promise<T[]> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderField);
    if (error) {
      console.error('GetAll error:', error);
      return [];
    }
    return data as T[];
  }
};

// Submit contact form
export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
}): Promise<{ success: boolean; emailSent: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_inquiries')
      .insert({
        ...formData,
        inquiry_type: formData.inquiry_type || 'general',
        status: 'new',
        priority: 'normal'
      });

    if (error) {
      console.error('Database error:', error);
      return { success: false, emailSent: false, error: 'Failed to save your inquiry. Please try again.' };
    }

    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (anonKey && supabaseUrl) {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        console.error('Email notification failed');
        return {
          success: true,
          emailSent: false,
          error: 'Your inquiry was saved, but email notification failed. Our team can still see it in the admin panel.'
        };
      }

      return { success: true, emailSent: true };
    }

    return {
      success: true,
      emailSent: false,
      error: 'Your inquiry was saved, but email notification is not configured.'
    };
  } catch (err) {
    console.error('Submit form error:', err);
    return { success: false, emailSent: false, error: 'Failed to submit your inquiry. Please try again.' };
  }
}

// Submit job application
export async function submitJobApplication(formData: {
  job_id: string;
  full_name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
}) {
  const { error } = await supabase
    .from('job_applications')
    .insert({
      ...formData,
      status: 'pending'
    });

  return !error;
}
