import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from './SettingsContext';

interface SEOData {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  schema_type: string;
}

interface SEOContextType {
  seoData: SEOData | null;
  loading: boolean;
  getPageSEO: (pageId: string) => Promise<SEOData | null>;
  updatePageSEO: (pageId: string, data: Partial<SEOData>) => Promise<void>;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

const defaultSEO: SEOData = {
  meta_title: 'Eden Buildcore - Building Excellence Since 2008',
  meta_description: 'Leading construction company in Pakistan specializing in commercial, residential, and infrastructure projects.',
  meta_keywords: 'construction, building, Pakistan, commercial, residential, infrastructure',
  og_title: 'Eden Buildcore',
  og_description: 'Building Excellence Since 2008',
  og_image: '',
  canonical_url: '',
  schema_type: 'Organization',
};

export function SEOProvider({ children }: { children: ReactNode }) {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  const getPageSEO = useCallback(async (pageId: string): Promise<SEOData | null> => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_id', pageId)
        .maybeSingle();

      if (error || !data) return null;
      return data as SEOData;
    } catch (e) {
      console.error('SEO fetch error:', e);
      return null;
    }
  }, []);

  const updatePageSEO = async (pageId: string, data: Partial<SEOData>) => {
    try {
      const { error } = await supabase
        .from('seo_settings')
        .upsert({ page_id: pageId, ...data, updated_at: new Date().toISOString() });

      if (error) throw error;
    } catch (e) {
      console.error('SEO update error:', e);
    }
  };

  return (
    <SEOContext.Provider value={{ seoData, loading, getPageSEO, updatePageSEO }}>
      {children}
    </SEOContext.Provider>
  );
}

export function useSEO() {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
}

// SEO Head component
export function SEOHead({ pageId }: { pageId: string }) {
  const { getPageSEO } = useSEO();
  const { settings } = useSettings();
  const [seo, setSeo] = useState<SEOData | null>(null);

  useEffect(() => {
    getPageSEO(pageId).then(setSeo);
  }, [pageId, getPageSEO]);

  const siteName = settings?.site_name || 'Eden Buildcore';
  const title = seo?.meta_title || `${siteName} - Building Excellence`;
  const description = seo?.meta_description || settings?.site_description || '';
  const keywords = seo?.meta_keywords || '';
  const ogImage = seo?.og_image || settings?.logo_url || '';
  const canonical = seo?.canonical_url || `${window.location.origin}${window.location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:image', ogImage);
    updateProperty('og:type', 'website');
    updateProperty('og:url', canonical);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // Structured data
    const schema = {
      '@context': 'https://schema.org',
      '@type': seo?.schema_type || 'Organization',
      name: siteName,
      description: description,
      url: window.location.origin,
      logo: settings?.logo_url || '',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: settings?.phone || '',
        contactType: 'customer service',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings?.address || '',
      },
    };

    let script = document.querySelector('#schema-jsonld') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'schema-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

  }, [title, description, keywords, ogImage, canonical, siteName, settings, seo]);

  return null;
}
