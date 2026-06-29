import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Linkedin, Twitter, Instagram, Youtube, ArrowUp, ArrowRight } from 'lucide-react';
import { useSiteSettings, useServices } from '../hooks/useData';
import { useSettings } from '../contexts/SettingsContext';

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Our Services', path: '/services' },
  { name: 'Projects Portfolio', path: '/projects' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Certifications', path: '/certifications' },
  { name: 'Careers', path: '/careers' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact Us', path: '/contact' },
];

export default function Footer() {
  const { settings } = useSiteSettings();
  const { data: services } = useServices();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: settings?.social_links?.facebook as string },
    { name: 'LinkedIn', icon: Linkedin, url: settings?.social_links?.linkedin as string },
    { name: 'Twitter', icon: Twitter, url: settings?.social_links?.twitter as string },
    { name: 'Instagram', icon: Instagram, url: settings?.social_links?.instagram as string },
    { name: 'YouTube', icon: Youtube, url: settings?.social_links?.youtube as string },
  ].filter(s => s.url);

  const siteName = settings?.site_name || 'Eden Buildcore';
  const siteNameParts = siteName.replace(/\s*\([^)]*\)\s*\.?/g, '').trim().split(' ');

  return (
    <footer className="relative bg-[#020609]">
      {/* Golden accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c49028] to-transparent" />


      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <Link to="/" className="inline-block mb-4 sm:mb-6">
              <img
                src={settings?.logo_url || "/EDEN_BUILDCORE.png"}
                alt={siteName}
                style={{
                  height: `${parseInt(settings?.logo_size || '64') + 16}px`,
                  objectFit: (settings?.logo_scale as any) || 'contain',
                }}
                className="w-auto mx-auto sm:mx-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const next = e.currentTarget.nextElementSibling as HTMLElement;
                  if (next) next.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }} className="flex flex-col">
                <span className="text-xl sm:text-2xl font-heading font-bold text-white">{siteNameParts[0] || 'EDEN'}</span>
                <span className="text-[10px] sm:text-xs text-[#c49028] tracking-widest">{siteNameParts[1] || 'BUILDCORE'}</span>
              </div>
            </Link>
            <p className="text-[#909090] text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              {settings?.site_description || 'A premier construction and engineering company delivering excellence in civil construction, infrastructure development, and engineering solutions across Pakistan.'}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-2 justify-center sm:justify-start">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-[#0c1a2e] border border-[#c49028]/15 text-[#909090] hover:text-[#c49028] hover:border-[#c49028]/40 hover:bg-[#c49028]/5 transition-all"
                  >
                    <social.icon size={14} className="sm:w-4 sm:h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-[#ffffff] font-semibold text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-5 sm:w-6 h-px bg-[#c49028]" />
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-1.5 sm:gap-2 text-[#909090] hover:text-[#c49028] transition-colors text-xs sm:text-sm group justify-center sm:justify-start"
                  >
                    <ArrowRight size={10} className="sm:w-3 sm:h-3 text-[#c49028]/40 group-hover:text-[#c49028] group-hover:translate-x-0.5 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h4 className="text-[#ffffff] font-semibold text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-5 sm:w-6 h-px bg-[#c49028]" />
              Our Services
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {(services.length > 0 ? services : [
                { id: '1', title: 'Civil Construction', slug: 'civil-construction' },
                { id: '2', title: 'Infrastructure Development', slug: 'infrastructure-development' },
                { id: '3', title: 'MEP Works', slug: 'mep-works' },
                { id: '4', title: 'Solar Energy Projects', slug: 'solar-energy-projects' },
                { id: '5', title: 'Renovation & Remodeling', slug: 'renovation-remodeling' },
                { id: '6', title: 'Industrial Construction', slug: 'industrial-construction' },
              ]).slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services`}
                    className="flex items-center gap-1.5 sm:gap-2 text-[#909090] hover:text-[#c49028] transition-colors text-xs sm:text-sm group justify-center sm:justify-start"
                  >
                    <ArrowRight size={10} className="sm:w-3 sm:h-3 text-[#c49028]/40 group-hover:text-[#c49028] group-hover:translate-x-0.5 transition-all" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-[#ffffff] font-semibold text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-5 sm:w-6 h-px bg-[#c49028]" />
              Contact Info
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {settings?.address && (
                <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c49028]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={12} className="sm:w-3.5 sm:h-3.5 text-[#c49028]" />
                  </div>
                  <p className="text-[#909090] text-xs sm:text-sm leading-relaxed text-left">{settings.address}</p>
                </div>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex gap-2 sm:gap-3 group justify-center sm:justify-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c49028]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={12} className="sm:w-3.5 sm:h-3.5 text-[#c49028]" />
                  </div>
                  <span className="text-[#909090] text-xs sm:text-sm group-hover:text-[#c49028] transition-colors self-center">{settings.phone}</span>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex gap-2 sm:gap-3 group justify-center sm:justify-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c49028]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={12} className="sm:w-3.5 sm:h-3.5 text-[#c49028]" />
                  </div>
                  <span className="text-[#909090] text-xs sm:text-sm group-hover:text-[#c49028] transition-colors self-center break-all">{settings.email}</span>
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex gap-2 sm:gap-3 group justify-center sm:justify-start"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
               
                  </div>
                  <span className="text-[#909090] text-xs sm:text-sm group-hover:text-green-400 transition-colors self-center">{settings.whatsapp}</span>
                </a>
              )}
              {settings?.business_hours && (
                <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c49028]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-[#c49028]" />
                  </div>
                  <div className="text-xs sm:text-sm text-left">
                    <p className="text-[#909090]">Mon-Fri: {(settings.business_hours as { weekday: string }).weekday}</p>
                    <p className="text-[#909090]">Sat: {(settings.business_hours as { saturday: string }).saturday}</p>
                    <p className="text-[#606060]">Sun: Closed</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#c49028]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[#606060] text-xs sm:text-sm text-center">
              {settings?.copyright_text || `© ${new Date().getFullYear()} ${siteName}. All Rights Reserved.`}
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-[#606060] text-xs sm:text-sm">
              <Link to="/privacy" className="hover:text-[#c49028] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#c49028] transition-colors">Terms of Service</Link>

            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-9 h-9 sm:w-10 md:w-11 sm:h-10 md:h-11 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] rounded-lg sm:rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(196,144,40,0.35)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] transition-all hover:-translate-y-1 z-40"
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
      </button>
    </footer>
  );
}
