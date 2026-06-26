import { motion } from 'framer-motion';
import { Building2, Award, Users, Star, Handshake, Landmark, Briefcase, TrendingUp } from 'lucide-react';
import { useClients, useTestimonials, usePageContent } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { Client, Testimonial } from '../lib/supabase';

export default function ClientsPage() {
  const { data: clients } = useClients();
  const { data: testimonials } = useTestimonials();
  const pageContent = usePageContent('clients');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  const governmentClients = clients.filter(cl => cl.client_type === 'government' || cl.is_featured);
  const privateClients = clients.filter(cl => cl.client_type === 'private');
  const featuredTestimonials = testimonials.filter(t => t.is_featured).slice(0, 3);

  const stats = [
    { value: c('clients.stats', 'stat_1', '350+'), label: 'Satisfied Clients', icon: Users },
    { value: c('clients.stats', 'stat_2', '50+'), label: 'Government Projects', icon: Landmark },
    { value: c('clients.stats', 'stat_3', '25+'), label: 'Years Experience', icon: Award },
    { value: c('clients.stats', 'stat_4', '100%'), label: 'Client Satisfaction', icon: Star },
  ];

  return (
    <>
      {/* Hero Section */}
      <PageHero
        pageId="clients"
        fallbackTitle="Our Valued Clients"
        fallbackSubtitle="Trusted Partners"
        fallbackDescription="Proudly serving government agencies and private sector leaders across Pakistan with excellence and integrity."
        fallbackImage="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920"
      />

      {/* Stats Bar */}
      <section className="relative z-10 -mt-8 mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0c1a2e] border border-[#c49028]/15 rounded-xl p-5 text-center backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-[#c49028]/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-[#c49028]" />
                </div>
                <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Clients */}
      <section className="py-20 bg-[#030810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 text-[#c49028] text-sm font-medium tracking-widest uppercase mb-4">
              <Landmark className="w-4 h-4" />
              {c('clients.government', 'badge', 'Public Sector')}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              {c('clients.government', 'title', 'Government & Public Sector')}
            </h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Trusted by national and provincial government bodies for critical infrastructure projects
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(governmentClients.length > 0 ? governmentClients : [
              { id: '1', name: 'Ministry of Planning', description: 'Federal Government', logo_url: null, client_type: 'government' },
              { id: '2', name: 'Public Works Department', description: 'Provincial Authority', logo_url: null, client_type: 'government' },
              { id: '3', name: 'National Highway Authority', description: 'Federal Body', logo_url: null, client_type: 'government' },
              { id: '4', name: 'Water & Power Dept', description: 'Utility Authority', logo_url: null, client_type: 'government' },
              { id: '5', name: 'Housing Authority', description: 'Development Board', logo_url: null, client_type: 'government' },
              { id: '6', name: 'Municipal Corporation', description: 'Local Government', logo_url: null, client_type: 'government' },
            ] as Client[]).map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:border-[#c49028]/30 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-[#c49028]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c49028]/20 transition-colors mb-3">
                  {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="max-w-full max-h-12 object-contain" />
                  ) : (
                    <Landmark className="w-8 h-8 text-[#c49028]" />
                  )}
                </div>
                <h3 className="text-white font-semibold group-hover:text-[#c49028] transition-colors text-sm leading-tight">{client.name}</h3>
                {client.description && (
                  <p className="text-gray-500 text-xs mt-1">{client.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Private Clients */}
      <section className="py-20 bg-[#060d18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 text-[#c49028] text-sm font-medium tracking-widest uppercase mb-4">
              <Briefcase className="w-4 h-4" />
              {c('clients.private', 'badge', 'Private Sector')}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              {c('clients.private', 'title', 'Private & Corporate Clients')}
            </h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Partnering with leading corporations and private developers for commercial and residential projects
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(privateClients.length > 0 ? privateClients : [
              { id: 'p1', name: 'Engro Corp', logo_url: null },
              { id: 'p2', name: 'Lucky Cement', logo_url: null },
              { id: 'p3', name: 'Maple Leaf', logo_url: null },
              { id: 'p4', name: 'Fauji Foundation', logo_url: null },
              { id: 'p5', name: 'Pak Arab', logo_url: null },
              { id: 'p6', name: 'Arif Habib', logo_url: null },
            ] as Client[]).map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:border-[#c49028]/30 transition-all duration-300"
              >
                {client.logo_url ? (
                  <img src={client.logo_url} alt={client.name} className="max-w-full max-h-14 object-contain mb-3 opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Briefcase className="w-10 h-10 text-[#c49028]/50 mb-3 group-hover:text-[#c49028] transition-colors" />
                )}
                <h3 className="text-white text-sm text-center font-medium group-hover:text-[#c49028] transition-colors">{client.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-20 bg-[#030810]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#c49028]/10 flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-8 h-8 text-[#c49028]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Become a Partner
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Join our growing network of satisfied clients. We are committed to delivering excellence on every project, big or small.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(196,144,40,0.3)] transition-all"
            >
              <TrendingUp className="w-5 h-5" />
              Start a Project
            </a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20 bg-[#060d18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-flex items-center gap-2 text-[#c49028] text-sm font-medium tracking-widest uppercase mb-4">
                <Star className="w-4 h-4" />
                {c('clients.testimonials', 'badge', 'Testimonials')}
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                {c('clients.testimonials', 'title', 'What Our Clients Say')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-2xl p-8 hover:border-[#c49028]/20 transition-all"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#c49028] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c49028]/20 flex items-center justify-center text-[#c49028] font-bold text-sm">
                      {testimonial.client_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{testimonial.client_name}</p>
                      <p className="text-gray-500 text-xs">{testimonial.client_company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
