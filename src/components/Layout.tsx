import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeProvider from './ThemeProvider';
import { initializeDefaultAdmin } from '../hooks/useAuth';
import { useSettings } from '../contexts/SettingsContext';

export default function Layout() {
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    initializeDefaultAdmin();
  }, []);

  useEffect(() => {
    const siteName = settings?.site_name || 'Eden Buildcore (Pvt.) Ltd.';
    const metaTitle = settings?.meta_title || siteName;
    const metaDescription = settings?.meta_description || 'Leading Construction & Engineering Company delivering excellence in civil construction, infrastructure development, and engineering solutions.';
    const metaKeywords = settings?.meta_keywords || 'construction, engineering, civil construction, infrastructure, MEP works';

    const path = location.pathname;
    let pageTitle = '';
    if (path === '/') pageTitle = 'Home';
    else if (path.startsWith('/about')) pageTitle = 'About Us';
    else if (path.startsWith('/services')) pageTitle = 'Services';
    else if (path.startsWith('/projects')) pageTitle = 'Projects';
    else if (path.startsWith('/gallery')) pageTitle = 'Gallery';
    else if (path.startsWith('/contact')) pageTitle = 'Contact';
    else if (path.startsWith('/careers')) pageTitle = 'Careers';
    else if (path.startsWith('/blog')) pageTitle = 'Blog';
    else if (path.startsWith('/clients')) pageTitle = 'Clients';
    else if (path.startsWith('/certifications')) pageTitle = 'Certifications';
    else if (path.startsWith('/privacy')) pageTitle = 'Privacy Policy';
    else if (path.startsWith('/terms')) pageTitle = 'Terms of Service';

    document.title = pageTitle ? `${pageTitle} | ${metaTitle}` : metaTitle;

    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) metaDescTag.setAttribute('content', metaDescription);

    const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (metaKeywordsTag) metaKeywordsTag.setAttribute('content', metaKeywords);

    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) ogTitleTag.setAttribute('content', pageTitle ? `${pageTitle} | ${metaTitle}` : metaTitle);

    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) ogDescTag.setAttribute('content', metaDescription);

    if (settings?.favicon_url) {
      const faviconTag = document.querySelector('link[rel="icon"]');
      if (faviconTag) faviconTag.setAttribute('href', settings.favicon_url);
    }
  }, [settings, location.pathname]);

  return (
    <ThemeProvider>
      <div className="min-h-screen text-white" style={{ backgroundColor: 'var(--bg-color, #030810)', fontFamily: 'var(--body-font, Inter, system-ui, sans-serif)' }}>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
