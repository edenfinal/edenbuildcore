import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageHero } from '../hooks/useData';
import { useSiteSettings } from '../hooks/useData';

interface PageHeroProps {
  pageId: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: { label: string; link?: string }[];
}

export default function PageHero({
  pageId,
  fallbackTitle = '',
  fallbackSubtitle = '',
  fallbackDescription = '',
  fallbackImage = '',
  showBreadcrumb = false,
  breadcrumbItems = [],
}: PageHeroProps) {
  const { hero, loading } = usePageHero(pageId);
  const { settings } = useSiteSettings();
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = hero?.title || fallbackTitle;
  const subtitle = hero?.subtitle || fallbackSubtitle;
  const description = hero?.description || fallbackDescription;
  const bgImage = hero?.background_image_url || fallbackImage;
  const opacity = hero?.overlay_opacity ?? 0.75;
  const align = hero?.text_alignment || 'center';
  const btnText = hero?.button_text;
  const btnLink = hero?.button_link;
  const showBtn = hero?.show_button ?? false;
  const height = hero?.height || 'large';
  const txtColor = hero?.text_color || '#ffffff';
  const overlayColor = hero?.overlay_color || '#030810';
  const isActive = hero?.is_active ?? true;

  const primaryColor = settings?.primary_color || '#c49028';

  const heightClass = {
    small: 'min-h-[30vh] md:min-h-[35vh]',
    medium: 'min-h-[40vh] md:min-h-[50vh]',
    large: 'min-h-[50vh] md:min-h-[65vh]',
    full: 'min-h-[80vh] md:min-h-[90vh]',
  }[height] || 'min-h-[50vh] md:min-h-[65vh]';

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align] || 'text-center items-center';

  if (!isActive) return null;
  if (loading) {
    return (
      <section className={`relative ${heightClass} flex items-center justify-center overflow-hidden bg-[#030810]`}>
        <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className={`relative ${heightClass} flex flex-col justify-center overflow-hidden`}>
      {/* Background Image */}
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
            style={{
              backgroundImage: `url(${bgImage})`,
              opacity: imageLoaded ? 1 : 0,
            }}
          />
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-0"
            onLoad={() => setImageLoaded(true)}
          />
        </>
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${overlayColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${overlayColor}${Math.round((opacity * 0.7) * 255).toString(16).padStart(2, '0')} 50%, ${overlayColor}${Math.round((opacity * 0.4) * 255).toString(16).padStart(2, '0')} 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-transparent to-transparent" />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 border border-[#c49028]/10 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-1/3 right-16 w-24 h-24 border border-[#c49028]/10 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#c49028]/40 rounded-full animate-ping" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Breadcrumb */}
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {breadcrumbItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-[#c49028]/40">/</span>}
                  {item.link ? (
                    <Link to={item.link} className="text-gray-400 hover:text-[#c49028] transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#c49028]">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        <div className={`flex flex-col ${alignClass} max-w-4xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {/* Subtitle */}
          {subtitle && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase mb-4"
              style={{ color: primaryColor }}
            >
              <span className="w-8 h-px bg-current" />
              {subtitle}
              <span className="w-8 h-px bg-current" />
            </motion.span>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6"
            style={{ color: txtColor }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
              style={{ color: `${txtColor}cc` }}
            >
              {description}
            </motion.p>
          )}

          {/* CTA Button */}
          {showBtn && btnText && btnLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              {btnLink.startsWith('/') || btnLink.startsWith('#') ? (
                <Link
                  to={btnLink}
                  className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl transition-all hover:scale-105 hover:shadow-lg group"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#030810',
                  }}
                >
                  {btnText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <a
                  href={btnLink}
                  className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl transition-all hover:scale-105 hover:shadow-lg group"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#030810',
                  }}
                >
                  {btnText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030810] to-transparent" />
    </section>
  );
}
