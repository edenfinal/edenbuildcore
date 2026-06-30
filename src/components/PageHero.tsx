import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageHero } from '../hooks/useData';
import { useSiteSettings } from '../hooks/useData';
import { supabase } from '../lib/supabase';
import type { HeroSlide, PageHero as PageHeroType } from '../lib/supabase';

interface PageHeroProps {
  pageId: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: { label: string; link?: string }[];
}

/* ─── Carousel Hook ─── */
function useCarouselSlides(pageId: string, enabled: boolean) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchSlides = useCallback(async () => {
    if (!enabled) {
      setSlides([]);
      setHasFetched(false);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      if (error) throw error;
      setSlides(data || []);
    } catch (e) {
      console.error('Carousel slides error:', e);
    } finally {
      setHasFetched(true);
      setLoading(false);
    }
  }, [pageId, enabled]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  return { slides, loading: enabled && (!hasFetched || loading) };
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

      {hero.title && (
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6"
          style={{ color: txtColor }}
        >
          {(() => {
            const lines = hero.line_two
              ? [hero.title, hero.line_two]
              : hero.title.split(/\n|\\n/);
            return lines.length > 1 ? (
              <>
                <span style={{ color: primaryColor }}>{lines[0]}</span>
                {lines.slice(1).map((line, i) => <span key={i}><br />{line}</span>)}
              </>
            ) : (
              <>
                <span style={{ color: primaryColor }}>{hero.title.split(' ').slice(0, Math.ceil(hero.title.split(' ').length / 2)).join(' ')}</span>
                {' '}{hero.title.split(' ').slice(Math.ceil(hero.title.split(' ').length / 2)).join(' ')}
              </>
            );
          })()}
        </motion.h1>
      )}

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

      {(hero.show_button && hero.button_text && hero.button_link) || (hero.button2_text && hero.button2_link) ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-wrap gap-4 items-center justify-center"
        >
          {hero.show_button && hero.button_text && hero.button_link && (
            hero.button_link.startsWith('/') || hero.button_link.startsWith('#') ? (
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
            )
          )}
          {hero.button2_text && hero.button2_link && (
            hero.button2_link.startsWith('/') || hero.button2_link.startsWith('#') ? (
              <Link
                to={hero.button2_link}
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl border-2 transition-all hover:scale-105 group"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                {hero.button2_text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <a
                href={hero.button2_link}
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl border-2 transition-all hover:scale-105 group"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                {hero.button2_text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )
          )}
        </motion.div>
      ) : null}
    </div>
  );
}

/* ─── Carousel View ─── */
function CarouselHeroView({
  slides,
  baseHero,
  primaryColor,
  txtColor,
  overlayColor,
  baseOpacity,
  interval,
  animSpeed,
}: {
  slides: HeroSlide[];
  baseHero: PageHeroType;
  primaryColor: string;
  txtColor: string;
  overlayColor: string;
  baseOpacity: number;
  interval: number;
  animSpeed: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  const slide = slides[current];
  if (!slide) return null;

  const slideOpacity = slide.overlay_opacity ?? baseOpacity;
  const overlayStyle = {
    background: `linear-gradient(135deg, ${overlayColor}${Math.round(slideOpacity * 255).toString(16).padStart(2, '0')} 0%, ${overlayColor}${Math.round((slideOpacity * 0.7) * 255).toString(16).padStart(2, '0')} 50%, ${overlayColor}${Math.round((slideOpacity * 0.4) * 255).toString(16).padStart(2, '0')} 100%)`,
  };
  const slideHero = {
    ...baseHero,
    title: slide.title,
    subtitle: slide.subtitle,
    line_two: slide.line_two,
    description: slide.description,
    background_image_url: slide.background_image_url,
    overlay_opacity: slide.overlay_opacity,
    text_alignment: slide.text_alignment || baseHero.text_alignment,
    button_text: slide.button_text,
    button_link: slide.button_link,
    button2_text: slide.button2_text,
    button2_link: slide.button2_link,
    show_button: 'show_button' in slide ? Boolean(slide.show_button) : true,
  } as PageHeroType;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animSpeed / 1000 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: slide.background_image_url ? `url(${slide.background_image_url})` : undefined }}
        />
      </AnimatePresence>
      <div className="absolute inset-0" style={overlayStyle} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-transparent to-transparent" />

      <div className="absolute top-1/4 left-10 w-32 h-32 border border-[#c49028]/10 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-1/3 right-16 w-24 h-24 border border-[#c49028]/10 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#c49028]/40 rounded-full animate-ping" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <SingleHeroView hero={slideHero} primaryColor={primaryColor} txtColor={txtColor} />
          </motion.div>
        </AnimatePresence>

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

        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${i === current ? 'bg-[#c49028] w-8' : 'w-2.5 bg-white/30 hover:bg-white/50'}`}
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
  showBreadcrumb = false,
  breadcrumbItems = [],
}: PageHeroProps) {
  const { hero, loading } = usePageHero(pageId);
  const { settings } = useSiteSettings();
  const { slides: carouselSlides, loading: carouselLoading } = useCarouselSlides(pageId, hero?.is_carousel ?? false);

  const primaryColor = settings?.primary_color || '#c49028';

  // Show spinner while loading
  if (loading) {
    return (
      <section className="relative min-h-[50vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#030810]">
        <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // No hero configured in DB — show nothing
  if (!hero || !hero.is_active) return null;

  const opacity = hero.overlay_opacity ?? 0.75;
  const height = hero.height || 'large';
  const txtColor = hero.text_color || '#ffffff';
  const overlayColor = hero.overlay_color || '#030810';
  const isCarousel = hero.is_carousel ?? false;
  const slideInterval = hero.slide_interval ?? 6000;
  const animSpeed = hero.animation_speed ?? 1000;

  const heightClass = {
    small: 'min-h-[30vh] md:min-h-[35vh]',
    medium: 'min-h-[40vh] md:min-h-[50vh]',
    large: 'min-h-[50vh] md:min-h-[65vh]',
    full: 'min-h-[80vh] md:min-h-[90vh]',
  }[height] || 'min-h-[50vh] md:min-h-[65vh]';

  const baseCarouselSlide = {
    id: `${hero.id}-base`,
    title: hero.title || '',
    subtitle: hero.subtitle,
    description: hero.description,
    background_image_url: hero.background_image_url,
    button_text: hero.button_text,
    button_link: hero.button_link,
    button2_text: hero.button2_text,
    button2_link: hero.button2_link,
    line_two: hero.line_two,
    overlay_opacity: hero.overlay_opacity,
    text_alignment: hero.text_alignment,
    order_index: -1,
    is_active: true,
    show_button: hero.show_button,
    created_at: hero.created_at,
    updated_at: hero.updated_at,
  } as HeroSlide & { show_button?: boolean };

  const visibleCarouselSlides = isCarousel
    ? [baseCarouselSlide, ...carouselSlides.filter((slide) => slide.id !== baseCarouselSlide.id)]
    : carouselSlides;

  // Carousel mode
  if (isCarousel && visibleCarouselSlides.length > 0 && !carouselLoading) {
    return (
      <section className={`relative ${heightClass} flex flex-col justify-center overflow-hidden`}>
        <CarouselHeroView
          slides={visibleCarouselSlides}
          baseHero={hero}
          primaryColor={primaryColor}
          txtColor={txtColor}
          overlayColor={overlayColor}
          baseOpacity={opacity}
          interval={slideInterval}
          animSpeed={animSpeed}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030810] to-transparent z-[1]" />
      </section>
    );
  }

  if (isCarousel && carouselLoading) {
    return (
      <section className={`relative ${heightClass} flex items-center justify-center overflow-hidden bg-[#030810]`}>
        <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // Single hero mode
  return (
    <section className={`relative ${heightClass} flex flex-col justify-center overflow-hidden`}>
      {/* Background Image */}
      {hero.background_image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hero.background_image_url})` }}
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

        <SingleHeroView hero={hero} primaryColor={primaryColor} txtColor={txtColor} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030810] to-transparent" />
    </section>
  );
}
