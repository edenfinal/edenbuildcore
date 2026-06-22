import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Zap, Settings, RefreshCw, Palette,
  Factory, Droplets, FileText, Shield, ArrowRight, CheckCircle
} from 'lucide-react';
import { useServices, usePageContent } from '../hooks/useData';

const iconMap: Record<string, React.ElementType> = {
  Building2, MapPin, Settings, Zap, RefreshCw, Palette,
  Factory, Droplets, FileText, Shield
};

export default function ServicesPage() {
  const { data: services, loading } = useServices();
  const pageContent = usePageContent('services');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-color)' }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-6 border border-[var(--primary-color)]/30">
              {c('hero', 'badge', 'What We Offer')}
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-[var(--text-color)] mb-6 leading-tight">
              {c('hero', 'title_line1', 'Premium Construction')}
              <span className="block text-[var(--primary-color)]">{c('hero', 'title_line2', '& Engineering Services')}</span>
            </h1>
            <p className="text-xl text-[var(--muted-text-color)] leading-relaxed">
              {c('hero', 'description', 'Comprehensive construction solutions tailored to meet your unique requirements, delivered with excellence and precision.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24" style={{ backgroundColor: 'var(--card-bg-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <Settings className="w-16 h-16 text-[var(--primary-color)]/20 mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-[var(--text-color)] mb-2">No Services Available</h2>
              <p className="text-[var(--muted-text-color)]">Services will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon_name || ''] || Building2;
                const features = service.features as string[] || [];

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/10 rounded-2xl overflow-hidden hover:border-[var(--primary-color)]/30 transition-all duration-300"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--secondary-color)] via-[var(--primary-color)] to-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                          <Icon className="w-8 h-8 text-[var(--primary-color)]" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-heading font-semibold text-[var(--text-color)] mb-3 group-hover:text-[var(--accent-color)] transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-[var(--muted-text-color)] leading-relaxed mb-4">
                            {service.detailed_description || service.short_description}
                          </p>

                          {features.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-6">
                              {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-[var(--muted-text-color)] text-sm">
                                  <CheckCircle className="w-4 h-4 text-[var(--primary-color)] flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 text-[var(--primary-color)] hover:text-[var(--accent-color)] font-medium transition-colors group/link"
                          >
                            Get Quote for This Service
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--primary-color)]/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('process', 'badge', 'Our Process')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-color)]">
              {c('process', 'title', 'How We Work')}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: c('process', 'step_1_title', 'Consultation'), desc: c('process', 'step_1_description', 'Understanding your vision and requirements') },
              { step: '02', title: c('process', 'step_2_title', 'Planning'), desc: c('process', 'step_2_description', 'Creating detailed project plans and designs') },
              { step: '03', title: c('process', 'step_3_title', 'Execution'), desc: c('process', 'step_3_description', 'Implementing with precision and quality') },
              { step: '04', title: c('process', 'step_4_title', 'Delivery'), desc: c('process', 'step_4_description', 'On-time handover with complete documentation') },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="text-7xl font-heading font-bold text-[var(--primary-color)]/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">{item.title}</h3>
                <p className="text-[var(--muted-text-color)] text-sm">{item.desc}</p>

                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-[var(--primary-color)]/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--card-bg-color)' }}>
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading font-bold text-[var(--text-color)] mb-6">
              {c('cta', 'title', 'Need a Custom Solution?')}
            </h2>
            <p className="text-xl text-[var(--muted-text-color)] mb-10">
              {c('cta', 'description', 'Our team is ready to discuss your specific requirements and provide tailored solutions.')}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:bg-[var(--button-hover-color)] transition-all"
            >
              {c('cta', 'button_text', 'Contact Us Today')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
