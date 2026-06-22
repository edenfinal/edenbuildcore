import { motion } from 'framer-motion';
import { Building2, Award, Users, Globe, Star } from 'lucide-react';
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

  return (
    <>
      {/* Hero Section */}
      <PageHero
        pageId="clients"
        fallbackTitle="Our Valued Clients"
        fallbackSubtitle="Our Partners"
        fallbackDescription="Proud to serve government bodies, leading corporations, and private developers across the region."
        fallbackImage="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Stats */}
      <section className="py-12 bg-navy-900 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: c('clients.stats', 'stat_1', '350+'), label: 'Satisfied Clients', icon: Users },
              { value: c('clients.stats', 'stat_2', '50+'), label: 'Government Projects', icon: Building2 },
              { value: c('clients.stats', 'stat_3', '25+'), label: 'Years Experience', icon: Award },
              { value: c('clients.stats', 'stat_4', '100%'), label: 'Client Satisfaction', icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                <div className="text-3xl font-heading font-bold text-white">{stat.value}</div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Clients */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('clients.government', 'badge', 'Public Sector')}
            </span>
            <h2 className="text-3xl font-heading font-bold text-white">{c('clients.government', 'title', 'Government & Public Sector Clients')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {governmentClients.length > 0 ? governmentClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-xl p-6 flex items-center gap-4 hover:border-gold-500/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="max-w-full max-h-12 object-contain" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gold-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-gold-400 transition-colors">{client.name}</h3>
                  {client.description && (
                    <p className="text-gray-400 text-sm line-clamp-1">{client.description}</p>
                  )}
                </div>
              </motion.div>
            )) : (
              // Default government clients
              ['Ministry of Planning', 'Public Works Department', 'National Highway Authority', 'Water & Power Development'].map((name, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-xl p-6 flex items-center gap-4 hover:border-gold-500/30 transition-all group"
                >
                  <div className="w-16 h-16 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-gold-400 transition-colors">{name}</h3>
                    <p className="text-gray-400 text-sm">Government Client</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Private Clients */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('clients.private', 'badge', 'Private Sector')}
            </span>
            <h2 className="text-3xl font-heading font-bold text-white">{c('clients.private', 'title', 'Private & Corporate Clients')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {privateClients.length > 0 ? privateClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-navy-800/50 border border-gold-500/10 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:border-gold-500/30 transition-all group"
              >
                {client.logo_url ? (
                  <img src={client.logo_url} alt={client.name} className="max-w-full max-h-16 object-contain mb-3" />
                ) : (
                  <Globe className="w-10 h-10 text-gold-500/50 mb-3" />
                )}
                <h3 className="text-white text-sm text-center group-hover:text-gold-400 transition-colors">{client.name}</h3>
              </motion.div>
            )) : (
              // Default private clients
              ['Engro Corp', 'Lucky Cement', 'Maple Leaf', 'Fauji Foundation', 'Pak Arab', 'Arif Habib'].map((name, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-navy-800/50 border border-gold-500/10 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:border-gold-500/30 transition-all group"
                >
                  <Globe className="w-10 h-10 text-gold-500/50 mb-3" />
                  <h3 className="text-white text-sm text-center group-hover:text-gold-400 transition-colors">{name}</h3>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20 bg-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
                {c('clients.testimonials', 'badge', 'Testimonials')}
              </span>
              <h2 className="text-3xl font-heading font-bold text-white">{c('clients.testimonials', 'title', 'What Our Clients Say')}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold">
                      {testimonial.client_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonial.client_name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.client_company}</p>
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
