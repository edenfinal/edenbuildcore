import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageHero } from '../hooks/useData';
import { useSiteSettings } from '../hooks/useData';
import { supabase } from '../lib/supabase';
import type { PageHero as PageHeroType } from '../lib/supabase';

interface PageHeroProps {
  pageId: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: { label: string; link?: string }[];
}

/* ─── Carousel Hook ─── */
function useCarouselSlides(pageId: string, enabled: boolean) {
  const [slides, setSlides] = useState<PageHeroType[]>([]);
  const [loading, setLoading] = useState(enabled);

  const fetchSlides = useCallback(async () => {
    if (!enabled) return;
    try {
      const { data, error } = await supabase
        .from('page_heroes')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .order('created_at');
      if (error) throw error;
      setSlides(data as PageHeroType[]);
    } catch (e) {
      console.error('Carousel slides error:', e);
    } finally {
      setLoading(false);
    }
  }, [pageId, enabled]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  return { slides, loading };
}

/* ─── Single Hero View ─── */
function SingleHeroView({
  hero,
  primaryColor,
  txtColor,
}: {
  hero: PageHeroType;
  primaryColor: string;
  txtColor: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const align = hero.text_alignment || 'center';

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align] || 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} max-w-4xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {hero.subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase mb-4"
          style={{ color: primaryColor }}
        >
          <span className="w-8 h-px bg-current" />
          {hero.subtitle}
          <span className="w-8 h-px bg-current" />
        </motion.span>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6"
        style={{ color: txtColor }}
      >
        {hero.title}
      </motion.h1>

      {hero.description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
          style={{ color: `${txtColor}cc` }}
        >
          {hero.description}
        </motion.p>
      )}

      {hero.show_button && hero.button_text && hero.button_link && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          {hero.button_link.startsWith('/') || hero.button_link.startsWith('#') ? (
            <Link
              to={hero.button_link}
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl transition-all hover:scale-105 hover:shadow-lg group"
              style={{ backgroundColor: primaryColor, color: '#030810' }}
            >
              {hero.button_text}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <a
              href={hero.button_link}
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl transition-all hover:scale-105 hover:shadow-lg group"
              style={{ backgroundColor: primaryColor, color: '#030810' }}
            >
              {hero.button_text}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Carousel View ─── */
function CarouselHeroView({
  slides,
  primaryColor,
  txtColor,
  interval,
  animSpeed,
}: {
  slides: PageHeroType[];
  primaryColor: string;
  txtColor: string;
  interval: number;
  animSpeed: number;
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[current];
  if (!slide) return null;

  return (
    <>
      {/* Background Images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animSpeed / 1000 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${slide.background_image_url})` }}
        />
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {slide.subtitle && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wider uppercase mb-4 border"
                style={{ color: primaryColor, borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}15` }}
              >
                {slide.subtitle}
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6" style={{ color: txtColor }}>
              {slide.title?.split(' ').slice(0, 2).join(' ')}
              <br className="hidden sm:block" />
              {slide.title?.split(' ').slice(2).join(' ')}
            </h1>

            {slide.description && (
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: `${txtColor}cc` }}>
                {slide.description}
              </p>
            )}

            {slide.show_button && slide.button_text && slide.button_link && (
              <Link
                to={slide.button_link}
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl transition-all hover:scale-105 hover:shadow-lg group"
                style={{ backgroundColor: primaryColor, color: '#030810' }}
              >
                {slide.button_text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#030810]/50 border border-[#c49028]/20 flex items-center justify-center text-white hover:bg-[#c49028]/20 transition-all z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#030810]/50 border border-[#c49028]/20 flex items-center justify-center text-white hover:bg-[#c49028]/20 transition-all z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-[#c49028] w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Main Component ─── */
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
  const { slides: carouselSlides } = useCarouselSlides(pageId, hero?.is_carousel ?? false);

  const title = hero?.title || fallbackTitle;
  const subtitle = hero?.subtitle || fallbackSubtitle;
  const description = hero?.description || fallbackDescription;
  const bgImage = hero?.background_image_url || fallbackImage;
  const opacity = hero?.overlay_opacity ?? 0.75;
  const height = hero?.height || 'large';
  const txtColor = hero?.text_color || '#ffffff';
  const overlayColor = hero?.overlay_color || '#030810';
  const isActive = hero?.is_active ?? true;
  const isCarousel = hero?.is_carousel ?? false;
  const slideInterval = hero?.slide_interval ?? 6000;
  const animSpeed = hero?.animation_speed ?? 1000;

  const primaryColor = settings?.primary_color || '#c49028';

  const heightClass = {
    small: 'min-h-[30vh] md:min-h-[35vh]',
    medium: 'min-h-[40vh] md:min-h-[50vh]',
    large: 'min-h-[50vh] md:min-h-[65vh]',
    full: 'min-h-[80vh] md:min-h-[90vh]',
  }[height] || 'min-h-[50vh] md:min-h-[65vh]';

  if (!isActive) return null;
  if (loading) {
    return (
      <section className={`relative ${heightClass} flex items-center justify-center overflow-hidden bg-[#030810]`}>
        <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // Carousel mode (Home page)
  if (isCarousel && carouselSlides.length > 0) {
    return (
      <section className={`relative ${heightClass} flex flex-col justify-center overflow-hidden`}>
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(135deg, ${overlayColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${overlayColor}${Math.round((opacity * 0.5) * 255).toString(16).padStart(2, '0')} 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-transparent to-transparent z-[1]" />

        <CarouselHeroView
          slides={carouselSlides}
          primaryColor={primaryColor}
          txtColor={txtColor}
          interval={slideInterval}
          animSpeed={animSpeed}
        />

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030810] to-transparent z-[1]" />
      </section>
    );
  }

  // Single hero mode (all other pages)
  return (
    <section className={`relative ${heightClass} flex flex-col justify-center overflow-hidden`}>
      {/* Background Image */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
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

        {hero && (
          <SingleHeroView hero={hero} primaryColor={primaryColor} txtColor={txtColor} />
        )}
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030810] to-transparent" />
    </section>
  );
}
