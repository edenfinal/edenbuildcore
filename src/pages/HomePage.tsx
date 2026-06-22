import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ChevronRight, Award, Users, Building2, HardHat, Building,
  ArrowRight, Star, Quote, Shield, Target, Eye, Globe, MapPin,
  Phone, Mail, Clock, CheckCircle, TrendingUp
} from 'lucide-react';
import { useSiteSettings, useHeroSlides, useServices, useProjects, useClients, useTestimonials, useCertifications, useStatistics, usePageContent } from '../hooks/useData';
import type { HeroSlide, Project, Client, Testimonial, Service, Certification, Statistic } from '../lib/supabase';

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2000 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

// Section Title Component
function SectionTitle({ subtitle, title, description, light = false }: { subtitle: string; title: string; description?: string; light?: boolean }) {
  return (
    <div className="text-center mb-10 sm:mb-12 md:mb-16">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase ${light ? 'bg-[var(--primary-color)]/20 text-[var(--accent-color)]' : 'bg-[var(--card-bg-color)] text-[var(--primary-color)]'} mb-3 sm:mb-4`}
      >
        {subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-color)] px-4"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`mt-2 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base ${light ? 'text-gray-300' : 'text-[var(--muted-text-color)]'} px-4`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

// Hero Section - Only shows admin-managed slides
function HeroSection({ c }: { c: (section: string, key: string, fallback: string) => string }) {
  const { data: slides, loading } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set([0]));

  const heroSlides = slides.filter((s) => s.is_active);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const nextIndex = (currentSlide + 1) % heroSlides.length;
      const img = new Image();
      img.src = heroSlides[nextIndex]?.background_image_url || '';
      img.onload = () => {
        setImagesLoaded((prev) => new Set(prev).add(nextIndex));
      };
    }
  }, [currentSlide, heroSlides]);

  const slide = heroSlides[currentSlide];

  if (loading) {
    return (
      <section className="relative h-screen min-h-[600px] sm:min-h-[700px] overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (!slide) {
    return (
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-[var(--text-color)] mb-4">
            {c('hero', 'default_title', "Building Tomorrow's Landmarks Today")}
          </h1>
          <p className="text-[var(--muted-text-color)] max-w-xl mx-auto">
            {c('hero', 'default_description', 'Add hero slides from the admin panel to customize this section.')}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl">
              {c('hero', 'button_text', 'Explore Our Projects')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold rounded-xl">
              {c('hero', 'secondary_button_text', 'Get a Quote')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen min-h-[600px] sm:min-h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        {heroSlides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${s.background_image_url})`, willChange: 'opacity' }}
          />
        ))}
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to right, ${getComputedStyle(document.documentElement).getPropertyValue('--hero-overlay-color') || '#071027'}ee, ${getComputedStyle(document.documentElement).getPropertyValue('--hero-overlay-color') || '#071027'}aa)` }} />
      </div>

      <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6 z-20">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} key={currentSlide} className="px-2 sm:px-0">
            {slide.subtitle && (
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase mb-4 sm:mb-6 border border-[var(--primary-color)]/30">
                {slide.subtitle}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-[var(--text-color)] leading-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[var(--accent-color)] via-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
                {slide.title.split(' ').slice(0, 2).join(' ')}
              </span>
              <br className="hidden sm:block" />
              <span className="text-[var(--text-color)]">{slide.title.split(' ').slice(2).join(' ')}</span>
            </h1>
            {slide.description && (
              <p className="text-base sm:text-lg md:text-xl text-[var(--muted-text-color)] max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
                {slide.description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              {slide.button_link && (
                <Link to={slide.button_link} className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold text-sm sm:text-base rounded-xl hover:bg-[var(--button-hover-color)] transition-all">
                  {slide.button_text || 'Explore'}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-sm sm:text-base rounded-xl hover:bg-[var(--primary-color)]/10 transition-all">
                {c('hero', 'secondary_button_text', 'Get a Quote')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {heroSlides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${currentSlide === index ? 'bg-[var(--primary-color)] w-6 sm:w-8' : 'bg-white/30 hover:bg-white/50'}`} />
          ))}
        </div>
      )}
    </section>
  );
}

// Stats Section - Uses page_content for editable values
function StatsSection({ stats, c }: { stats: Statistic[]; c: (section: string, key: string, fallback: string) => string }) {
  const statItems = [
    { key: 'stat_1', value: c('stats', 'stat_1_value', stats[0]?.stat_value || '25'), prefix: c('stats', 'stat_1_prefix', stats[0]?.stat_prefix || ''), suffix: c('stats', 'stat_1_suffix', stats[0]?.stat_suffix || '+'), desc: c('stats', 'stat_1_description', stats[0]?.description || 'Years of Excellence') },
    { key: 'stat_2', value: c('stats', 'stat_2_value', stats[1]?.stat_value || '500'), prefix: c('stats', 'stat_2_prefix', stats[1]?.stat_prefix || ''), suffix: c('stats', 'stat_2_suffix', stats[1]?.stat_suffix || '+'), desc: c('stats', 'stat_2_description', stats[1]?.description || 'Projects Completed') },
    { key: 'stat_3', value: c('stats', 'stat_3_value', stats[2]?.stat_value || '350'), prefix: c('stats', 'stat_3_prefix', stats[2]?.stat_prefix || ''), suffix: c('stats', 'stat_3_suffix', stats[2]?.stat_suffix || '+'), desc: c('stats', 'stat_3_description', stats[2]?.description || 'Happy Clients') },
    { key: 'stat_4', value: c('stats', 'stat_4_value', stats[3]?.stat_value || '150'), prefix: c('stats', 'stat_4_prefix', stats[3]?.stat_prefix || ''), suffix: c('stats', 'stat_4_suffix', stats[3]?.stat_suffix || '+'), desc: c('stats', 'stat_4_description', stats[3]?.description || 'Team Members') },
  ];

  const icons = [TrendingUp, Building2, Users, HardHat];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 -mt-12 sm:-mt-16 md:-mt-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl border border-[var(--primary-color)]/20" style={{ background: 'linear-gradient(to right, var(--card-bg-color), var(--bg-color), var(--card-bg-color))' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 md:divide-x divide-[var(--primary-color)]/20">
            {statItems.map((stat, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center px-2 sm:px-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-[var(--primary-color)]/10 text-[var(--primary-color)] mb-2 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-color)] mb-1 sm:mb-2">
                    <AnimatedCounter value={parseInt(stat.value || '0')} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <p className="text-[var(--muted-text-color)] text-xs sm:text-sm md:text-base">{stat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// About Preview Section
function AboutPreview({ c }: { c: (section: string, key: string, fallback: string) => string }) {
  const { settings } = useSiteSettings();

  return (
    <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full border border-[var(--primary-color)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] rounded-full border border-[var(--primary-color)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative order-1">
            <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--card-bg-color)]">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Company" className="w-full h-full object-contain p-8" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-32 h-32 text-[var(--primary-color)]/20" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 sm:-bottom-6 right-2 sm:right-4 md:right-8 bg-[var(--primary-color)] text-[var(--bg-color)] p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">{c('stats', 'stat_1_value', '25')}{c('stats', 'stat_1_suffix', '+')}</div>
              <div className="text-xs sm:text-sm font-medium">{c('stats', 'stat_1_description', 'Years of Excellence')}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4">
              {c('about_preview', 'badge', 'Who We Are')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-color)] mb-4 sm:mb-6 leading-tight">
              {c('about_preview', 'title_line1', 'Building Dreams Into')}
              <span className="block bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] bg-clip-text text-transparent">{c('about_preview', 'title_line2', 'Reality')}</span>
            </h2>
            <p className="text-[var(--muted-text-color)] text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              {c('about_preview', 'paragraph_1', 'Eden Buildcore (Pvt.) Ltd. is a premier construction and engineering company committed to delivering exceptional quality and innovation.')}
            </p>
            <p className="text-[var(--muted-text-color)] text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              {c('about_preview', 'paragraph_2', 'Our team of skilled professionals brings expertise, dedication, and passion to every project.')}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[c('about_preview', 'feature_1', 'Quality Assurance'), c('about_preview', 'feature_2', 'Safety First'), c('about_preview', 'feature_3', 'On-Time Delivery'), c('about_preview', 'feature_4', 'Expert Team')].map((feature) => (
                <div key={feature} className="flex items-center gap-1.5 sm:gap-2 text-[var(--muted-text-color)] text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-color)] flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/about" className="inline-flex items-center gap-2 text-[var(--primary-color)] hover:text-[var(--accent-color)] font-medium text-sm sm:text-base transition-colors group">
              {c('about_preview', 'link_text', 'Learn More About Us')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Preview - NO hardcoded defaults
function ServicesPreview({ services, c }: { services: Service[]; c: (section: string, key: string, fallback: string) => string }) {
  if (services.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, var(--bg-color), var(--card-bg-color))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionTitle subtitle={c('services', 'badge', 'What We Offer')} title={c('services', 'title', 'Our Premium Services')} description={c('services', 'description', 'Comprehensive construction and engineering solutions.')} light />
          <p className="text-[var(--muted-text-color)]">No services added yet. Add services from the admin panel.</p>
        </div>
      </section>
    );
  }

  const displayServices = services.slice(0, 6);
  const icons: Record<string, React.ElementType> = { Building, MapPin, HardHat, Users, Award, Shield, Building2, Settings, Zap, RefreshCw, Palette, Factory };

  return (
    <section className="py-12 sm:py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, var(--bg-color), var(--card-bg-color))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle subtitle={c('services', 'badge', 'What We Offer')} title={c('services', 'title', 'Our Premium Services')} description={c('services', 'description', 'Comprehensive construction and engineering solutions.')} light />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayServices.map((service, index) => {
            const IconComponent = icons[service.icon_name || ''] || Building2;
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="group relative bg-[var(--card-bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:border-[var(--primary-color)]/30 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl sm:rounded-t-2xl" />
                <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[var(--primary-color)]" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-[var(--text-color)] mb-2 sm:mb-3 group-hover:text-[var(--accent-color)] transition-colors">{service.title}</h3>
                <p className="text-[var(--muted-text-color)] text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">{service.short_description}</p>
                <Link to={`/services#${service.slug || service.id}`} className="inline-flex items-center gap-1.5 sm:gap-2 text-[var(--primary-color)] hover:text-[var(--accent-color)] font-medium text-xs sm:text-sm transition-colors group/link">
                  {c('services', 'learn_more_text', 'Learn More')}
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link to="/services" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold text-sm sm:text-base rounded-xl hover:bg-[var(--button-hover-color)] transition-all">
            {c('services', 'button_text', 'View All Services')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Featured Projects - NO hardcoded defaults
function FeaturedProjects({ projects, c }: { projects: Project[]; c: (section: string, key: string, fallback: string) => string }) {
  if (projects.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-24" style={{ backgroundColor: 'var(--card-bg-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionTitle subtitle={c('projects', 'badge', 'Our Portfolio')} title={c('projects', 'title', 'Featured Projects')} description={c('projects', 'description', 'Explore our portfolio.')} light />
          <p className="text-[var(--muted-text-color)]">No projects added yet. Add projects from the admin panel.</p>
        </div>
      </section>
    );
  }

  const featured = projects.filter(p => p.is_featured).slice(0, 3);
  const displayProjects = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 md:py-24" style={{ backgroundColor: 'var(--card-bg-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle subtitle={c('projects', 'badge', 'Our Portfolio')} title={c('projects', 'title', 'Featured Projects')} description={c('projects', 'description', 'Explore our portfolio.')} light />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayProjects.map((project, index) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative">
              <Link to={`/projects/${project.slug || project.id}`}>
                <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 bg-[var(--bg-color)]">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-[var(--primary-color)]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-[var(--primary-color)] text-[var(--bg-color)] text-xs sm:text-sm font-medium rounded-full">{project.category || 'Construction'}</div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between">
                    <div><p className="text-[var(--accent-color)] text-xs sm:text-sm">{project.status}</p></div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center group-hover:bg-[var(--accent-color)] transition-colors">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bg-color)]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-[var(--text-color)] mb-1 sm:mb-2 group-hover:text-[var(--accent-color)] transition-colors">{project.title}</h3>
                <p className="text-[var(--muted-text-color)] text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary-color)]" />
                  {project.location || 'Location TBA'}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link to="/projects" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-sm sm:text-base rounded-xl hover:bg-[var(--primary-color)]/10 transition-all">
            {c('projects', 'button_text', 'View All Projects')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Clients Section - NO hardcoded defaults
function ClientsSection({ clients, c }: { clients: Client[]; c: (section: string, key: string, fallback: string) => string }) {
  if (clients.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 border-t border-b border-[var(--primary-color)]/10" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[var(--primary-color)] text-xs sm:text-sm font-medium tracking-wider uppercase">{c('clients', 'badge', 'Trusted By')}</span>
          <h2 className="text-xl sm:text-2xl font-heading font-semibold text-[var(--text-color)] mt-1 sm:mt-2">{c('clients', 'title', 'Our Esteemed Clients')}</h2>
          <p className="text-[var(--muted-text-color)] mt-4">No clients added yet. Add clients from the admin panel.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 border-t border-b border-[var(--primary-color)]/10" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[var(--primary-color)] text-xs sm:text-sm font-medium tracking-wider uppercase">{c('clients', 'badge', 'Trusted By')}</span>
          <h2 className="text-xl sm:text-2xl font-heading font-semibold text-[var(--text-color)] mt-1 sm:mt-2">{c('clients', 'title', 'Our Esteemed Clients')}</h2>
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />

          <motion.div className="flex gap-4 sm:gap-8 md:gap-12" animate={{ x: [0, -50 * clients.length] }} transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 20 + clients.length * 3, ease: "linear" } }}>
            {[...clients, ...clients].map((client, index) => (
              <div key={`${client.id}-${index}`} className="flex-shrink-0 w-28 sm:w-32 md:w-40 h-16 sm:h-20 md:h-24 flex items-center justify-center bg-[var(--card-bg-color)]/50 rounded-lg sm:rounded-xl border border-[var(--primary-color)]/10 hover:border-[var(--primary-color)]/30 transition-all">
                {client.logo_url ? (
                  <img src={client.logo_url} alt={client.name} className="max-w-[80%] max-h-[60%] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                ) : (
                  <span className="text-[var(--muted-text-color)] font-medium text-xs sm:text-sm text-center px-2">{client.name}</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section - NO hardcoded defaults
function TestimonialsSection({ testimonials, c }: { testimonials: Testimonial[]; c: (section: string, key: string, fallback: string) => string }) {
  if (testimonials.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, var(--card-bg-color), var(--bg-color))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionTitle subtitle={c('testimonials', 'badge', 'Testimonials')} title={c('testimonials', 'title', 'What Our Clients Say')} description={c('testimonials', 'description', 'Hear from our satisfied clients.')} light />
          <p className="text-[var(--muted-text-color)]">No testimonials added yet. Add testimonials from the admin panel.</p>
        </div>
      </section>
    );
  }

  const displayTestimonials = testimonials.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, var(--card-bg-color), var(--bg-color))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle subtitle={c('testimonials', 'badge', 'Testimonials')} title={c('testimonials', 'title', 'What Our Clients Say')} description={c('testimonials', 'description', 'Hear from our satisfied clients.')} light />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
              className="relative bg-[var(--card-bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
              <Quote className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary-color)]/20" />
              <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-color)] fill-current" />
                ))}
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">"{testimonial.content}"</p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center text-[var(--primary-color)] font-bold text-sm sm:text-base">
                  {testimonial.client_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="text-[var(--text-color)] font-semibold text-sm sm:text-base">{testimonial.client_name}</p>
                  <p className="text-[var(--muted-text-color)] text-xs sm:text-sm">{testimonial.client_designation}, {testimonial.client_company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Certifications Preview - NO hardcoded defaults
function CertificationsPreview({ certifications, c }: { certifications: Certification[]; c: (section: string, key: string, fallback: string) => string }) {
  if (certifications.length === 0) {
    return (
      <section className="py-20" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">{c('certifications', 'badge', 'Quality Assured')}</span>
          <h2 className="text-2xl font-heading font-semibold text-[var(--text-color)] mt-2">{c('certifications', 'title', 'Certifications & Registrations')}</h2>
          <p className="text-[var(--muted-text-color)] mt-4">No certifications added yet. Add certifications from the admin panel.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">{c('certifications', 'badge', 'Quality Assured')}</span>
          <h2 className="text-2xl font-heading font-semibold text-[var(--text-color)] mt-2">{c('certifications', 'title', 'Certifications & Registrations')}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {certifications.map((cert, index) => (
            <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative">
              <div className="flex flex-col items-center gap-3 p-6 bg-[var(--card-bg-color)]/50 border border-[var(--primary-color)]/10 rounded-xl hover:border-[var(--primary-color)]/30 transition-all">
                <Award className="w-10 h-10 text-[var(--primary-color)]" />
                <div className="text-center">
                  <p className="text-[var(--text-color)] font-medium">{cert.title}</p>
                  <p className="text-[var(--muted-text-color)] text-sm">{cert.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/certifications" className="text-[var(--primary-color)] hover:text-[var(--accent-color)] font-medium inline-flex items-center gap-2 group">
            {c('certifications', 'link_text', 'View All Certifications')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Vision Mission Section
function VisionMissionSection({ c }: { c: (section: string, key: string, fallback: string) => string }) {
  return (
    <section className="py-12 sm:py-16 md:py-24" style={{ background: 'linear-gradient(to right, var(--card-bg-color), var(--bg-color), var(--card-bg-color))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="absolute top-0 left-6 sm:left-8 w-12 sm:w-16 h-1 bg-[var(--primary-color)] rounded-full -translate-y-px" />
            <div className="w-12 h-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center mb-4 sm:mb-6">
              <Eye className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[var(--primary-color)]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text-color)] mb-3 sm:mb-4">{c('vision_mission', 'vision_title', 'Our Vision')}</h3>
            <p className="text-[var(--muted-text-color)] text-sm sm:text-base leading-relaxed">{c('vision_mission', 'vision_description', 'To be the leading construction and engineering company in the region, setting new standards of excellence, innovation, and sustainable development.')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="absolute top-0 left-6 sm:left-8 w-12 sm:w-16 h-1 bg-[var(--primary-color)] rounded-full -translate-y-px" />
            <div className="w-12 h-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center mb-4 sm:mb-6">
              <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[var(--primary-color)]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text-color)] mb-3 sm:mb-4">{c('vision_mission', 'mission_title', 'Our Mission')}</h3>
            <p className="text-[var(--muted-text-color)] text-sm sm:text-base leading-relaxed">{c('vision_mission', 'mission_description', 'To deliver exceptional construction solutions that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety.')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ c }: { c: (section: string, key: string, fallback: string) => string }) {
  const { settings } = useSiteSettings();

  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="absolute inset-0 bg-[var(--primary-color)]/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-color)] via-transparent to-[var(--bg-color)]" />

      <div className="relative max-w-4xl mx-auto text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-6 border border-[var(--primary-color)]/30">
            {c('cta', 'badge', 'Start Your Project')}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-color)] mb-6 leading-tight">
            {c('cta', 'title_line1', 'Ready to Build Your')}
            <span className="block bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] bg-clip-text text-transparent">{c('cta', 'title_line2', 'Dream Project?')}</span>
          </h2>
          <p className="text-xl text-[var(--muted-text-color)] mb-10 max-w-2xl mx-auto">
            {c('cta', 'description', "Let's discuss your construction needs and bring your vision to life.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:bg-[var(--button-hover-color)] transition-all">
              {c('cta', 'button_text', 'Get a Free Quote')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={`tel:${settings?.phone || ''}`} className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold rounded-xl hover:bg-[var(--primary-color)]/10 transition-all">
              <Phone className="w-5 h-5" />
              {c('cta', 'secondary_button_text', 'Call Us Now')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Main HomePage Component
export default function HomePage() {
  const { data: services } = useServices();
  const { data: projects } = useProjects();
  const { data: clients } = useClients();
  const { data: testimonials } = useTestimonials();
  const { data: certifications } = useCertifications();
  const { data: statistics } = useStatistics();
  const pageContent = usePageContent('home');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  return (
    <>
      <HeroSection c={c} />
      <StatsSection stats={statistics} c={c} />
      <AboutPreview c={c} />
      <ServicesPreview services={services} c={c} />
      <FeaturedProjects projects={projects} c={c} />
      <ClientsSection clients={clients} c={c} />
      <TestimonialsSection testimonials={testimonials} c={c} />
      <CertificationsPreview certifications={certifications} c={c} />
      <VisionMissionSection c={c} />
      <CTASection c={c} />
    </>
  );
}
