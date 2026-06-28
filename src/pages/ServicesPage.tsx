import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Zap, Settings, RefreshCw, Palette,
  Factory, Droplets, FileText, Shield, ArrowRight, CheckCircle
} from 'lucide-react';
import { useServices, usePageContent } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { Service } from '../lib/supabase';


const iconMap: Record<string, React.ElementType> = {
  Building2, MapPin, Settings, Zap, RefreshCw, Palette,
  Factory, Droplets, FileText, Shield
};

export default function ServicesPage() {
  const { data: services } = useServices();
  const displayServices = services.filter(s => s.is_active !== false);
  const pageContent = usePageContent('services');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  return (
    <>
      {/* Hero Section */}
      <PageHero
        pageId="services"
      />

      {/* Services Grid */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {displayServices.map((service, index) => {
              const Icon = iconMap[service.icon_name || ''] || Building2;
              const features = service.features as string[] || [];

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-gold-500/10 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all duration-300"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Service Image */}
                  {service.image_url && (
                    <div className="relative w-full h-52 overflow-hidden">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 rounded-xl bg-navy-950/80 backdrop-blur-sm flex items-center justify-center border border-gold-500/20">
                          <Icon className="w-6 h-6 text-gold-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Icon — only if no image */}
                      {!service.image_url && (
                        <div className="w-16 h-16 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                          <Icon className="w-8 h-8 text-gold-500" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                          {service.detailed_description || service.short_description}
                        </p>

                        {/* Features */}
                        {features.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-6">
                            {features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                                <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium transition-colors group/link"
                        >
                          Get Quote for This Service
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('process', 'badge', 'Our Process')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
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
                <div className="text-7xl font-heading font-bold text-gold-500/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>

                {/* Connector */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gold-500/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-6">
              {c('cta', 'title', 'Need a Custom Solution?')}
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              {c('cta', 'description', 'Our team is ready to discuss your specific requirements and provide tailored solutions.')}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all shadow-gold hover:shadow-gold-lg"
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
