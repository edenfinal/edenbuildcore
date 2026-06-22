import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Zap, Settings, RefreshCw, Palette,
  Factory, Droplets, FileText, Shield, ArrowRight, CheckCircle
} from 'lucide-react';
import { useServices, usePageContent } from '../hooks/useData';
import type { Service } from '../lib/supabase';

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'Civil Construction',
    slug: 'civil-construction',
    short_description: 'Complete civil construction services from foundation to finishing.',
    detailed_description: 'Our civil construction services encompass the full spectrum of building construction, from initial site preparation and foundation work to final finishing touches. We specialize in residential, commercial, and institutional buildings, ensuring structural integrity, aesthetic appeal, and long-term durability.',
    icon_name: 'Building2',
    features: ['Foundation & Structural Work', 'Concrete & Masonry', 'Steel Structures', 'Finishing & Interiors'],
    is_featured: true,
    is_active: true,
    order_index: 0,
    created_at: '',
    updated_at: ''
  },
  {
    id: '2',
    title: 'Infrastructure Development',
    slug: 'infrastructure',
    short_description: 'Building roads, bridges, and essential infrastructure.',
    detailed_description: 'We undertake major infrastructure projects including road construction, bridges, tunnels, and public works. Our infrastructure division employs cutting-edge technology and sustainable practices to deliver projects that serve communities for generations.',
    icon_name: 'MapPin',
    features: ['Highway Construction', 'Bridge Engineering', 'Tunnel Construction', 'Public Works'],
    is_featured: true,
    is_active: true,
    order_index: 1,
    created_at: '',
    updated_at: ''
  },
  {
    id: '3',
    title: 'MEP Works',
    slug: 'mep',
    short_description: 'Mechanical, electrical, and plumbing solutions.',
    detailed_description: 'Our MEP division delivers integrated mechanical, electrical, and plumbing services for buildings of all sizes. We design and install efficient systems that optimize energy use while ensuring comfort, safety, and regulatory compliance.',
    icon_name: 'Settings',
    features: ['HVAC Systems', 'Electrical Installations', 'Plumbing Systems', 'Fire Safety Systems'],
    is_featured: true,
    is_active: true,
    order_index: 2,
    created_at: '',
    updated_at: ''
  },
  {
    id: '4',
    title: 'Solar Energy Projects',
    slug: 'solar',
    short_description: 'Renewable energy solutions for a sustainable future.',
    detailed_description: 'Embrace sustainable energy with our solar project services. We design, install, and commission solar power systems for residential, commercial, and industrial applications, helping clients reduce energy costs and carbon footprint.',
    icon_name: 'Zap',
    features: ['Commercial Solar', 'Industrial Solar', 'Solar Water Heating', 'Net Metering'],
    is_featured: true,
    is_active: true,
    order_index: 3,
    created_at: '',
    updated_at: ''
  },
  {
    id: '5',
    title: 'Renovation & Remodeling',
    slug: 'renovation',
    short_description: 'Transforming spaces with modern renovation services.',
    detailed_description: 'We breathe new life into existing structures through comprehensive renovation services. From historical restoration to modern upgrades, we maintain structural integrity while enhancing functionality and aesthetics.',
    icon_name: 'RefreshCw',
    features: ['Structural Renovation', 'Modernization', 'Heritage Restoration', 'Space Transformation'],
    is_featured: false,
    is_active: true,
    order_index: 4,
    created_at: '',
    updated_at: ''
  },
  {
    id: '6',
    title: 'Interior Design & Fit-Out',
    slug: 'interior',
    short_description: 'Premium interior design and fit-out services.',
    detailed_description: 'Our interior design team creates stunning, functional spaces that reflect your brand and lifestyle. We offer complete fit-out services from concept design to final installation, ensuring every detail meets your expectations.',
    icon_name: 'Palette',
    features: ['Concept Design', 'Space Planning', 'Fit-Out Works', 'FF&E Supply'],
    is_featured: false,
    is_active: true,
    order_index: 5,
    created_at: '',
    updated_at: ''
  },
  {
    id: '7',
    title: 'Industrial Construction',
    slug: 'industrial',
    short_description: 'Specialized construction for industrial facilities.',
    detailed_description: 'We construct state-of-the-art industrial facilities including factories, warehouses, and production plants. Our industrial construction services prioritize functionality, safety, and operational efficiency.',
    icon_name: 'Factory',
    features: ['Factory Buildings', 'Warehouses', 'Production Facilities', 'Industrial Infrastructure'],
    is_featured: true,
    is_active: true,
    order_index: 6,
    created_at: '',
    updated_at: ''
  },
  {
    id: '8',
    title: 'Water Supply Projects',
    slug: 'water',
    short_description: 'Water infrastructure including treatment and distribution.',
    detailed_description: 'Our water supply projects encompass the design and construction of water treatment plants, distribution networks, and storage facilities. We ensure communities have access to safe, reliable water supplies.',
    icon_name: 'Droplets',
    features: ['Water Treatment Plants', 'Distribution Networks', 'Reservoir Construction', 'Pump Stations'],
    is_featured: false,
    is_active: true,
    order_index: 7,
    created_at: '',
    updated_at: ''
  },
  {
    id: '9',
    title: 'Government Contracting',
    slug: 'government',
    short_description: 'Trusted partner for government infrastructure projects.',
    detailed_description: 'Eden Buildcore is a pre-qualified government contractor with extensive experience in public sector projects. We understand the unique requirements of government contracts and deliver within budget and timeline.',
    icon_name: 'Shield',
    features: ['Public Buildings', 'Infrastructure Projects', 'Government Tenders', 'Public Works'],
    is_featured: false,
    is_active: true,
    order_index: 8,
    created_at: '',
    updated_at: ''
  },
  {
    id: '10',
    title: 'Engineering Consultancy',
    slug: 'consultancy',
    short_description: 'Expert engineering consultation and project management.',
    detailed_description: 'Our consultancy division provides expert engineering advice, project management, and technical services. From feasibility studies to project supervision, we offer comprehensive support throughout the project lifecycle.',
    icon_name: 'FileText',
    features: ['Feasibility Studies', 'Project Management', 'Technical Advisory', 'Quality Assurance'],
    is_featured: false,
    is_active: true,
    order_index: 9,
    created_at: '',
    updated_at: ''
  },
];

const iconMap: Record<string, React.ElementType> = {
  Building2, MapPin, Settings, Zap, RefreshCw, Palette,
  Factory, Droplets, FileText, Shield
};

export default function ServicesPage() {
  const { data: services } = useServices();
  const displayServices = services.length > 0 ? services : defaultServices;
  const pageContent = usePageContent('services');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Services"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-6 border border-gold-500/30">
              {c('hero', 'badge', 'What We Offer')}
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              {c('hero', 'title_line1', 'Premium Construction')}
              <span className="block text-gold-500">{c('hero', 'title_line2', '& Engineering Services')}</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {c('hero', 'description', 'Comprehensive construction solutions tailored to meet your unique requirements, delivered with excellence and precision.')}
            </p>
          </motion.div>
        </div>
      </section>

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

                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                        <Icon className="w-8 h-8 text-gold-500" />
                      </div>

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
