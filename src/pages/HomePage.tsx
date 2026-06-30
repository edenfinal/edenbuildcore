import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ChevronRight, Award, Users, Building2, HardHat, Building,
  ArrowRight, Star, Quote, Shield, Target, Eye, Globe, MapPin,
  Phone, Mail, Clock, CheckCircle, TrendingUp
} from 'lucide-react';
import { useSiteSettings, useServices, useProjects, useClients, useTestimonials, useCertifications, useStatistics, usePageContent, useAutoCounters } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { Project, Client, Testimonial, Service, Certification, Statistic } from '../lib/supabase';

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
        className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase ${light ? 'bg-gold-500/20 text-gold-400' : 'bg-navy-800 text-gold-500'} mb-3 sm:mb-4`}
      >
        {subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold ${light ? 'text-white' : 'text-navy-950'} px-4`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`mt-2 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base ${light ? 'text-gray-300' : 'text-gray-600'} px-4`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

// Hero Section - Only shows admin-managed slides, no hardcoded defaults
// Stats Section - values and labels are managed from the admin Statistics table.
function StatsSection({ stats, c }: { stats: Statistic[]; c: (section: string, key: string, fallback: string) => string }) {
  const { counters } = useAutoCounters();

  // Stats are admin-editable via the Statistics CRUD page.
  // Years can still fall back to company_start_year if the statistics row is missing.
  const expStat = stats.find(s => s.stat_key === 'years_experience');
  const projStat = stats.find(s => s.stat_key === 'projects_completed');
  const clientStat = stats.find(s => s.stat_key === 'happy_clients');
  const teamStat = stats.find(s => s.stat_key === 'team_members');

  const statItems = [
    {
      key: 'stat_1',
      value: expStat?.stat_value || String(counters.experience || 0),
      prefix: expStat?.stat_prefix || '',
      suffix: expStat?.stat_suffix || '+',
      desc: expStat?.description || c('stats', 'stat_1_description', 'Years of Excellence'),
    },
    {
      key: 'stat_2',
      value: projStat?.stat_value || String(counters.projects || 0),
      prefix: projStat?.stat_prefix || '',
      suffix: projStat?.stat_suffix || '+',
      desc: projStat?.description || c('stats', 'stat_2_description', 'Projects Delivered'),
    },
    {
      key: 'stat_3',
      value: clientStat?.stat_value || String(counters.clients || 0),
      prefix: clientStat?.stat_prefix || '',
      suffix: clientStat?.stat_suffix || '+',
      desc: clientStat?.description || c('stats', 'stat_3_description', 'Satisfied Clients'),
    },
    {
      key: 'stat_4',
      value: teamStat?.stat_value || String(counters.team || 0),
      prefix: teamStat?.stat_prefix || '',
      suffix: teamStat?.stat_suffix || '+',
      desc: teamStat?.description || c('stats', 'stat_4_description', 'Expert Team Members'),
    },
  ];

  const icons = [TrendingUp, Building2, Users, HardHat];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 -mt-12 sm:-mt-16 md:-mt-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl border border-gold-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 md:divide-x divide-gold-500/20">
            {statItems.map((stat, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center px-2 sm:px-4"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-gold-500/10 text-gold-500 mb-2 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-1 sm:mb-2">
                    <AnimatedCounter
                      value={parseInt(stat.value || '0')}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base">{stat.desc}</p>
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
  const { counters } = useAutoCounters();

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-navy-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full border border-gold-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] rounded-full border border-gold-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-1"
          >
            {settings?.secondary_logo_url ? (
              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
                <img src={settings.secondary_logo_url} alt="Company" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-navy-800/60 border border-gold-500/10 flex items-center justify-center">
                <Building2 className="w-24 h-24 text-gold-500/20" />
              </div>
            )}
            {counters.experience > 0 && (
              <div className="absolute -bottom-4 sm:-bottom-6 right-2 sm:right-4 md:right-8 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-gold-lg">
                <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">{counters.experience}+</div>
                <div className="text-xs sm:text-sm font-medium">{c('about_preview', 'badge_text', 'Years of Excellence')}</div>
              </div>
            )}
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2"
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4">
              {c('about_preview', 'badge', 'Who We Are')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight">
              {c('about_preview', 'title_line1', 'Building Dreams Into')}
              <span className="block bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">{c('about_preview', 'title_line2', 'Reality')}</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              {c('about_preview', 'paragraph_1', 'Eden Buildcore (Pvt.) Ltd. is a premier construction and engineering company committed to delivering exceptional quality and innovation. With decades of experience, we have established ourselves as industry leaders in civil construction, infrastructure development, and engineering solutions.')}
            </p>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              {c('about_preview', 'paragraph_2', "Our team of skilled professionals brings expertise, dedication, and passion to every project, ensuring that we not only meet but exceed our clients' expectations. We take pride in our commitment to safety, sustainability, and excellence.")}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                c('about_preview', 'feature_1', 'Quality Assurance'),
                c('about_preview', 'feature_2', 'Safety First'),
                c('about_preview', 'feature_3', 'On-Time Delivery'),
                c('about_preview', 'feature_4', 'Expert Team')
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-1.5 sm:gap-2 text-gray-300 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium text-sm sm:text-base transition-colors group"
            >
              {c('about_preview', 'link_text', 'Learn More About Us')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Preview
function ServicesPreview({ services, c }: { services: Service[]; c: (section: string, key: string, fallback: string) => string }) {
  const displayServices = services.filter(s => s.is_active).slice(0, 6);
  if (displayServices.length === 0) return null;

  const icons: Record<string, React.ElementType> = {
    Building, MapPin, HardHat, Users, Award, Shield,
    Settings: Building2, Sun: Building, RefreshCw: Building2, FileText: Building
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-navy-950 to-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          subtitle={c('services', 'badge', 'What We Offer')}
          title={c('services', 'title', 'Our Premium Services')}
          description={c('services', 'description', 'Comprehensive construction and engineering solutions tailored to meet your unique requirements.')}
          light
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayServices.map((service, index) => {
            const IconComponent = icons[service.icon_name || ''] || Building2;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:border-gold-500/30 transition-all duration-300 hover:shadow-gold"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl sm:rounded-t-2xl" />
                <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-gold-500/20 transition-colors">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gold-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  {service.short_description}
                </p>
                <Link
                  to={`/services#${service.slug || service.id}`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 text-gold-500 hover:text-gold-400 font-medium text-xs sm:text-sm transition-colors group/link"
                >
                  {c('services', 'learn_more_text', 'Learn More')}
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold text-sm sm:text-base rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all shadow-gold hover:shadow-gold-lg"
          >
            {c('services', 'button_text', 'View All Services')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Featured Projects
function FeaturedProjects({ projects, c }: { projects: Project[]; c: (section: string, key: string, fallback: string) => string }) {
  const featured = projects.filter(p => p.featured && p.is_published).slice(0, 3);
  const displayProjects = featured.length > 0 ? featured : projects.filter(p => p.is_published).slice(0, 3);
  if (displayProjects.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          subtitle={c('projects', 'badge', 'Our Portfolio')}
          title={c('projects', 'title', 'Featured Projects')}
          description={c('projects', 'description', 'Explore our portfolio of successfully completed construction and engineering projects.')}
          light
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link to={`/projects/${project.slug || project.id}`}>
                <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6">
                  <img
                    src={project.thumbnail_url || ''}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!project.thumbnail_url ? 'hidden' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-gold-500 text-navy-950 text-xs sm:text-sm font-medium rounded-full">
                    {project.category || 'Construction'}
                  </div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between">
                    <div>
                      <p className="text-gold-400 text-xs sm:text-sm">{project.status}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold-500 flex items-center justify-center group-hover:bg-gold-400 transition-colors">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-navy-950" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-1 sm:mb-2 group-hover:text-gold-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-500" />
                  {project.location || 'Location TBA'}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gold-500 text-gold-500 font-bold text-sm sm:text-base rounded-xl hover:bg-gold-500/10 transition-all"
          >
            {c('projects', 'button_text', 'View All Projects')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Clients Section
function ClientsSection({ clients, c }: { clients: Client[]; c: (section: string, key: string, fallback: string) => string }) {
  const displayClients = clients.length > 0 ? clients : [
    { id: '1', name: 'Government Sector', logo_url: '' },
    { id: '2', name: 'Private Sector', logo_url: '' },
    { id: '3', name: 'Corporate Clients', logo_url: '' },
    { id: '4', name: 'International Partners', logo_url: '' },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-navy-950 border-t border-b border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-gold-500 text-xs sm:text-sm font-medium tracking-wider uppercase">{c('clients', 'badge', 'Trusted By')}</span>
          <h2 className="text-xl sm:text-2xl font-heading font-semibold text-white mt-1 sm:mt-2">{c('clients', 'title', 'Our Esteemed Clients')}</h2>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-4 sm:gap-8 md:gap-12"
            animate={{
              x: [0, -50 * displayClients.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20 + displayClients.length * 3,
                ease: "linear",
              },
            }}
          >
            {[...displayClients, ...displayClients].map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="flex-shrink-0 w-28 sm:w-32 md:w-40 h-16 sm:h-20 md:h-24 flex items-center justify-center bg-navy-800/50 rounded-lg sm:rounded-xl border border-gold-500/10 hover:border-gold-500/30 transition-all"
              >
                {client.logo_url ? (
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="max-w-[80%] max-h-[60%] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <span className="text-gray-400 font-medium text-xs sm:text-sm text-center px-2">{client.name}</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection({ testimonials, c }: { testimonials: Testimonial[]; c: (section: string, key: string, fallback: string) => string }) {
  const displayTestimonials = testimonials.length > 0 ? testimonials.slice(0, 3) : [
    {
      id: '1',
      client_name: 'Ahmed Khan',
      client_designation: 'CEO',
      client_company: 'Pak Infrastructure Ltd',
      client_image_url: '',
      content: 'Eden Buildcore exceeded our expectations with their professional approach and timely delivery. Their attention to detail and quality craftsmanship is unmatched.',
      rating: 5,
      is_featured: true,
      is_active: true,
      order_index: 0,
      created_at: '',
      updated_at: ''
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-navy-900 to-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          subtitle={c('testimonials', 'badge', 'Testimonials')}
          title={c('testimonials', 'title', 'What Our Clients Say')}
          description={c('testimonials', 'description', 'Hear from our satisfied clients about their experience working with Eden Buildcore.')}
          light
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8"
            >
              <Quote className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 text-gold-500/20" />
              <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-sm sm:text-base">
                  {testimonial.client_name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">{testimonial.client_name}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {testimonial.client_designation}, {testimonial.client_company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Certifications Preview
function CertificationsPreview({ certifications, c }: { certifications: Certification[]; c: (section: string, key: string, fallback: string) => string }) {
  return (
    <section className="py-20 bg-navy-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-sm font-medium tracking-wider uppercase">{c('certifications', 'badge', 'Quality Assured')}</span>
          <h2 className="text-2xl font-heading font-semibold text-white mt-2">{c('certifications', 'title', 'Certifications & Registrations')}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {(certifications.length > 0 ? certifications : [
            { id: '1', title: 'ISO 9001:2015', category: 'Quality Management' },
            { id: '2', title: 'ISO 14001:2015', category: 'Environmental' },
            { id: '3', title: 'PEC Registered', category: 'Engineering Council' },
            { id: '4', title: 'SECP', category: 'Corporate Registration' },
          ]).map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="flex flex-col items-center gap-3 p-6 bg-navy-800/50 border border-gold-500/10 rounded-xl hover:border-gold-500/30 transition-all">
                <Award className="w-10 h-10 text-gold-500" />
                <div className="text-center">
                  <p className="text-white font-medium">{cert.title}</p>
                  <p className="text-gray-400 text-sm">{cert.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/certifications"
            className="text-gold-500 hover:text-gold-400 font-medium inline-flex items-center gap-2 group"
          >
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
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-navy-950/50 backdrop-blur-sm border border-gold-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10"
          >
            <div className="absolute top-0 left-6 sm:left-8 w-12 sm:w-16 h-1 bg-gold-500 rounded-full -translate-y-px" />
            <div className="w-12 h-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-gold-500/10 flex items-center justify-center mb-4 sm:mb-6">
              <Eye className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gold-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 sm:mb-4">{c('vision_mission', 'vision_title', 'Our Vision')}</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {c('vision_mission', 'vision_description', 'To be the leading construction and engineering company in the region, setting new standards of excellence, innovation, and sustainable development. We envision a future where every structure we build becomes a landmark of quality and reliability.')}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-navy-950/50 backdrop-blur-sm border border-gold-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10"
          >
            <div className="absolute top-0 left-6 sm:left-8 w-12 sm:w-16 h-1 bg-gold-500 rounded-full -translate-y-px" />
            <div className="w-12 h-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-gold-500/10 flex items-center justify-center mb-4 sm:mb-6">
              <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gold-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 sm:mb-4">{c('vision_mission', 'mission_title', 'Our Mission')}</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {c('vision_mission', 'mission_description', 'To deliver exceptional construction solutions that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety. We strive to build lasting relationships based on trust, integrity, and mutual respect.')}
            </p>
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
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-transparent to-navy-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold-500/10 opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-gold-500/5 opacity-10" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-6 border border-gold-500/30">
            {c('cta', 'badge', 'Start Your Project')}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
            {c('cta', 'title_line1', 'Ready to Build Your')}
            <span className="block bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">{c('cta', 'title_line2', 'Dream Project?')}</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {c('cta', 'description', "Let's discuss your construction needs and bring your vision to life. Our expert team is ready to deliver excellence.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all shadow-gold hover:shadow-gold-lg"
            >
              {c('cta', 'button_text', 'Get a Free Quote')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${settings?.phone || '+1234567890'}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-gold-500 text-gold-400 font-bold rounded-xl hover:bg-gold-500/10 transition-all"
            >
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
      <PageHero pageId="home" />
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
