import { useEffect } from 'react';
import { useSiteSettings } from '../hooks/useData';

// Available fonts that are actually loadable from Google Fonts
// Key: display name, Value: Google Font API name
const GOOGLE_FONT_MAP: Record<string, string> = {
  'Inter': 'Inter',
  'Playfair Display': 'Playfair Display',
  'Cormorant Garamond': 'Cormorant Garamond',
  'Roboto': 'Roboto',
  'Open Sans': 'Open Sans',
  'Montserrat': 'Montserrat',
  'Poppins': 'Poppins',
  'Lato': 'Lato',
  'Merriweather': 'Merriweather',
  'Source Sans 3': 'Source+Sans+3',
  'Raleway': 'Raleway',
  'Nunito': 'Nunito',
  'Oswald': 'Oswald',
  'Bebas Neue': 'Bebas+Neue',
  'Josefin Sans': 'Josefin+Sans',
  'Cinzel': 'Cinzel',
  'Libre Baskerville': 'Libre+Baskerville',
  'PT Serif': 'PT+Serif',
  'Work Sans': 'Work+Sans',
  'Karla': 'Karla',
  'Manrope': 'Manrope',
  'Space Grotesk': 'Space+Grotesk',
  'DM Sans': 'DM+Sans',
  'Sora': 'Sora',
  'Outfit': 'Outfit',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans',
  'Syne': 'Syne',
  'Schibsted Grotesk': 'Schibsted+Grotesk',
  'Quicksand': 'Quicksand',
  'Mulish': 'Mulish',
  'Figtree': 'Figtree',
  'Geist': 'Geist',
};

function getGoogleFontName(fontValue: string): string | null {
  const name = fontValue.split(',')[0].trim();
  return GOOGLE_FONT_MAP[name] || null;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;
    const body = document.body;

    // Apply CSS custom properties for colors
    root.style.setProperty('--primary-color', settings.primary_color || '#c49028');
    root.style.setProperty('--secondary-color', settings.secondary_color || '#a67820');
    root.style.setProperty('--accent-color', settings.accent_color || '#e8b84a');
    root.style.setProperty('--bg-color', settings.bg_color || '#030810');
    root.style.setProperty('--text-color', settings.text_color || '#ffffff');
    root.style.setProperty('--border-color', settings.border_color || '#c49028');
    root.style.setProperty('--button-hover-color', settings.button_hover_color || '#e8b84a');
    root.style.setProperty('--card-bg-color', settings.card_bg_color || '#0c1a2e');
    root.style.setProperty('--card-border-color', settings.card_border_color || '#c49028');
    root.style.setProperty('--nav-bg-color', settings.nav_bg_color || '#030810');
    root.style.setProperty('--footer-bg-color', settings.footer_bg_color || '#030810');
    root.style.setProperty('--link-hover-color', settings.link_hover_color || '#e8b84a');
    root.style.setProperty('--muted-text-color', settings.muted_text_color || '#909090');
    root.style.setProperty('--success-color', settings.success_color || '#10b981');
    root.style.setProperty('--warning-color', settings.warning_color || '#f59e0b');
    root.style.setProperty('--error-color', settings.error_color || '#ef4444');

    // Apply background color
    body.style.backgroundColor = settings.bg_color || '#071027';
    body.style.color = settings.text_color || '#ffffff';

    // Apply fonts
    // Only apply fonts that are explicitly set in DB — don't override CSS var with a hardcoded fallback
    const headingFont = settings.heading_font || null;
    const bodyFont = settings.body_font || null;

    if (headingFont) root.style.setProperty('--heading-font', headingFont);
    if (bodyFont) root.style.setProperty('--body-font', bodyFont);

    if (bodyFont) body.style.fontFamily = bodyFont;

    // Load Google Fonts dynamically
    const fontsToLoad: string[] = [];
    const headingName = headingFont ? getGoogleFontName(headingFont) : null;
    const bodyName = bodyFont ? getGoogleFontName(bodyFont) : null;

    if (headingName) fontsToLoad.push(headingName);
    if (bodyName && bodyName !== headingName) fontsToLoad.push(bodyName);

    if (fontsToLoad.length > 0) {
      const linkId = 'google-fonts-link';
      let link = document.getElementById(linkId) as HTMLLinkElement | null;
      const fontQuery = fontsToLoad.map(f => `family=${f}:wght@300;400;500;600;700;800`).join('&');
      const href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = href;
    }

    // Update scrollbar colors
    const scrollbarThumb = document.querySelector('::-webkit-scrollbar-thumb');
    // Note: pseudo-elements can't be styled via JS, handled in CSS with vars

  }, [settings]);

  return <>{children}</>;
}
