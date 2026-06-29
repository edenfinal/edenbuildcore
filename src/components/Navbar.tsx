import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../hooks/useData';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  {
    name: 'Company',
    path: '#',
    submenu: [
      { name: 'Clients', path: '/clients' },
      { name: 'Certifications', path: '/certifications' },
      { name: 'Our Team', path: '/our-team' },
    ]
  },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Careers', path: '/careers' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/EDEN_BUILDCORE.png"
      alt="Eden Buildcore Logo"
      className={className}
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = 'none';
        const fallback = target.nextSibling as HTMLElement;
        if (fallback) fallback.style.display = 'flex';
      }}
    />
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Get site name for dynamic display
  const siteName = settings?.site_name || 'Eden Buildcore';
  const siteNameParts = siteName.replace(/\s*\([^)]*\)\s*\.?/g, '').trim().split(' ');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
  scrolled
    ? 'bg-[#030810]/85 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]'
    : 'bg-transparent'
}`}>
      {/* Top announcement bar */}
      <div className={`hidden lg:block border-b transition-all duration-500 ${
        scrolled ? 'bg-[#020609] border-[#c49028]/10' : 'bg-[#030810]/80 border-[#c49028]/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 sm:gap-6">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 sm:gap-2 text-[#c8c8c8] hover:text-[#c49028] transition-colors text-xs sm:text-sm group">
                  <Phone size={12} className="text-[#c49028]" />
                  <span className="hidden sm:inline">{settings.phone}</span>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 sm:gap-2 text-[#c8c8c8] hover:text-[#c49028] transition-colors text-xs sm:text-sm">
                  <Mail size={12} className="text-[#c49028]" />
                  <span className="hidden md:inline">{settings.email}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {['facebook', 'linkedin', 'instagram', 'twitter'].map((platform) => {
                const url = settings?.social_links?.[platform as keyof typeof settings.social_links] as string;
                if (!url) return null;
                const icons: Record<string, JSX.Element> = {
                  facebook: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                  linkedin: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
                  instagram: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="#030810" strokeWidth="1.5"/></svg>,
                  twitter: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                };
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#c49028]/10 flex items-center justify-center text-[#c49028] hover:bg-[#c49028] hover:text-[#030810] transition-all">
                    {icons[platform]}
                  </a>
                );
              })}
              <div className="w-px h-4 bg-[#c49028]/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-[60px] sm:h-[70px] md:h-[80px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="relative flex items-center gap-2">
              {/* Primary Logo */}
              <img
                src={settings?.logo_url || "/EDEN_BUILDCORE.png"}
                alt={siteName}
                style={{
                  height: `${settings?.logo_size || 64}px`,
                  objectFit: (settings?.logo_scale as any) || 'contain',
                }}
                className="w-auto drop-shadow-sm transition-all"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const next = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                  if (next) next.style.display = 'flex';
                }}
              />
              {/* Secondary Logo (wordmark) */}
              {settings?.secondary_logo_url && (
                <img
                  src={settings.secondary_logo_url}
                  alt={`${siteName} Wordmark`}
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain hidden sm:block"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              {/* Fallback text when no logo images load */}
              <div className="logo-fallback hidden flex-col justify-center">
                <span className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-white tracking-widest leading-none">{siteNameParts[0] || 'EDEN'}</span>
                <span className="text-[8px] sm:text-[10px] font-medium text-[#c49028] tracking-[0.2em] sm:tracking-[0.3em] uppercase">{siteNameParts[1] || 'BUILDCORE'}</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.submenu && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.submenu ? (
                  <button className={`flex items-center gap-1 px-3.5 py-2 text-sm font-semibold transition-colors tracking-wide
                    ${activeDropdown === link.name ? 'text-[#c49028]' : 'text-[#e0e0e0] hover:text-[#c49028]'}`}>
                    {link.name}
                    <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`relative px-3.5 py-2 text-sm font-semibold transition-colors tracking-wide block
                      ${location.pathname === link.path ? 'text-[#c49028]' : 'text-[#e0e0e0] hover:text-[#c49028]'}`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#c49028] rounded-full" />
                    )}
                  </Link>
                )}

                <AnimatePresence>
                  {link.submenu && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-[#0c1a2e]/98 backdrop-blur-xl border border-[#c49028]/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.name}
                          to={sublink.path}
                          className="flex items-center gap-2 px-5 py-3.5 text-sm text-[#c8c8c8] hover:text-[#c49028] hover:bg-[#c49028]/5 transition-all border-b border-[#c49028]/5 last:border-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c49028]/40" />
                          {sublink.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="group relative overflow-hidden inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] text-xs sm:text-sm font-bold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(196,144,40,0.35)] hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#c49028] to-[#e8b84a] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <span>Get Free Quote</span>
                <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 text-white hover:text-[#c49028] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-[#030810]/99 backdrop-blur-xl border-t border-[#c49028]/10 max-h-[80vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-0.5 sm:space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.submenu ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                        className="flex items-center justify-between w-full py-2.5 sm:py-3 px-2 text-[#e0e0e0] hover:text-[#c49028] transition-colors font-semibold text-sm"
                      >
                        {link.name}
                        <ChevronDown size={14} className={`sm:w-4 sm:h-4 transition-transform ${activeDropdown === link.name ? 'rotate-180 text-[#c49028]' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-5 sm:pl-6 space-y-0.5 sm:space-y-1 overflow-hidden"
                          >
                            {link.submenu.map((sublink) => (
                              <Link
                                key={sublink.name}
                                to={sublink.path}
                                className="flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm text-[#a0a0a0] hover:text-[#c49028] transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c49028]/30" />
                                {sublink.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block py-2.5 sm:py-3 px-2 text-xs sm:text-sm font-semibold transition-colors ${
                        location.pathname === link.path ? 'text-[#c49028]' : 'text-[#e0e0e0] hover:text-[#c49028]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Contact Info */}
              {settings?.phone && (
                <div className="pt-3 sm:pt-4 border-t border-[#c49028]/10 mt-3 sm:mt-4 px-2">
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-[#c8c8c8] hover:text-[#c49028] text-xs sm:text-sm py-2">
                    <Phone size={14} className="text-[#c49028]" />
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div className="px-2">
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-[#c8c8c8] hover:text-[#c49028] text-xs sm:text-sm py-2">
                    <Mail size={14} className="text-[#c49028]" />
                    {settings.email}
                  </a>
                </div>
              )}

              <div className="pt-3 sm:pt-4 border-t border-[#c49028]/10 mt-3 sm:mt-4">
                <Link
                  to="/contact"
                  className="block text-center py-3 sm:py-3.5 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-lg sm:rounded-xl text-xs sm:text-sm"
                >
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
