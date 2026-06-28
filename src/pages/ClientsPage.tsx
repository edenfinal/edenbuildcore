import { motion } from 'framer-motion';
import { Building2, Award, Users, Star, Handshake, Landmark, Briefcase, Globe, ArrowRight } from 'lucide-react';
import { useClients, useTestimonials, usePageContent, useStatistics } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { Client } from '../lib/supabase';

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string }> = {
  government: { label: 'Government & Public Sector', icon: Landmark, bg: 'bg-blue-500/10' },
  private:    { label: 'Private Sector',             icon: Briefcase, bg: 'bg-gold-500/10' },
  corporate:  { label: 'Corporate Clients',          icon: Building2, bg: 'bg-emerald-500/10' },
  ngo:        { label: 'NGOs & Non-Profits',         icon: Globe,     bg: 'bg-purple-500/10' },
};

function ClientCard({ client, index }: { client: Client; index: number }) {
  const TypeIcon = TYPE_CONFIG[client.client_type || 'private']?.icon || Briefcase;
  const Wrapper = client.website_url
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={client.website_url!} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => <div className="block h-full">{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Wrapper>
        <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-2xl p-6 flex flex-col items-center text-center h-full hover:border-[#c49028]/30 hover:shadow-[0_0_20px_rgba(196,144,40,0.06)] transition-all duration-300">
          {/* Logo / Icon */}
          <div className="w-20 h-20 rounded-xl bg-[#c49028]/10 flex items-center justify-center mb-4 group-hover:bg-[#c49028]/20 transition-colors flex-shrink-0 overflow-hidden">
            {client.logo_url ? (
              <img src={client.logo_url} alt={client.name} className="w-full h-full object-contain p-2" />
            ) : (
              <TypeIcon className="w-9 h-9 text-[#c49028]" />
            )}
          </div>

          <h3 className="text-white font-semibold text-sm leading-tight mb-1 group-hover:text-[#c49028] transition-colors">
            {client.name}
          </h3>

          {client.description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{client.description}</p>
          )}

          {client.industry && (
            <span className="mt-2 text-xs text-[#c49028]/70 font-medium">{client.industry}</span>
          )}

          {client.website_url && (
            <span className="mt-3 flex items-center gap-1 text-[10px] text-gray-600 group-hover:text-[#c49028] transition-colors">
              Visit <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </Wrapper>
    </motion.div>
  );
}

export default function ClientsPage() {
  const { data: clients } = useClients();
  const { data: testimonials } = useTestimonials();
  const { data: statistics } = useStatistics();
  const pageContent = usePageContent('clients');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  const activeClients = clients.filter(cl => cl.is_active !== false);
  const featuredTestimonials = testimonials.filter(t => t.is_featured).slice(0, 3);

  // Group by type
  const grouped: Record<string, Client[]> = {};
  activeClients.forEach(cl => {
    const type = cl.client_type || 'private';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(cl);
  });

  // Stats from statistics table
  const projStat  = statistics.find(s => s.stat_key === 'projects_completed');
  const clientStat = statistics.find(s => s.stat_key === 'happy_clients');
  const expStat   = statistics.find(s => s.stat_key === 'experience');

  const stats = [
    { value: (clientStat?.stat_value || '350') + (clientStat?.stat_suffix || '+'), label: clientStat?.description || 'Satisfied Clients', icon: Users },
    { value: (projStat?.stat_value || '500') + (projStat?.stat_suffix || '+'),  label: projStat?.description  || 'Projects Delivered', icon: Award },
    { value: (expStat?.stat_value || '7') + (expStat?.stat_suffix || '+'),     label: expStat?.description   || 'Years of Excellence', icon: Star },
    { value: c('stats', 'stat_4_value', '100%'), label: c('stats', 'stat_4_label', 'Client Satisfaction'), icon: Handshake },
  ];

  return (
    <>
      <PageHero pageId="clients" />

      {/* Stats Strip */}
      <section className="relative z-10 -mt-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0c1a2e] border border-[#c49028]/15 rounded-2xl p-5 text-center backdrop-blur-sm shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-[#c49028]/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-[#c49028]" />
                </div>
                <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* No clients state */}
      {activeClients.length === 0 && (
        <section className="py-32 bg-[#030810]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Users className="w-20 h-20 text-[#c49028]/20 mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold text-white mb-3">No Clients Added Yet</h2>
            <p className="text-gray-400">Add clients from the admin panel to display them here.</p>
          </div>
        </section>
      )}

      {/* Grouped Sections */}
      {Object.entries(grouped).map(([type, group], sIdx) => {
        const cfg = TYPE_CONFIG[type] || { label: type, icon: Building2 };
        const Icon = cfg.icon;
        const bg = sIdx % 2 === 0 ? 'bg-[#030810]' : 'bg-[#060d18]';
        return (
          <section key={type} className={`py-20 ${bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-12"
              >
                <div className="w-12 h-12 rounded-xl bg-[#c49028]/10 border border-[#c49028]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#c49028]" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-white">
                    <span className="text-[#c49028]">{cfg.label.split(' ')[0]}</span>
                    {' '}{cfg.label.split(' ').slice(1).join(' ')}
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">{group.length} client{group.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-[#c49028]/20 to-transparent ml-4" />
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {group.map((client, i) => (
                  <ClientCard key={client.id} client={client} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20 bg-[#060d18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <span className="inline-flex items-center gap-2 text-[#c49028] text-sm font-medium tracking-widest uppercase mb-4">
                <Star className="w-4 h-4" /> What Our Clients Say
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Client Testimonials</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-2xl p-8 hover:border-[#c49028]/20 transition-all"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-[#c49028] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c49028]/20 flex items-center justify-center text-[#c49028] font-bold text-sm">
                      {t.client_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.client_name}</p>
                      <p className="text-gray-500 text-xs">{t.client_company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-[#030810]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl bg-[#c49028]/10 flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-8 h-8 text-[#c49028]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              {c('cta', 'title', 'Become a Partner')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              {c('cta', 'description', 'Join our growing network of satisfied clients. We deliver excellence on every project, big or small.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(196,144,40,0.3)] transition-all">
                Start a Project
              </a>
              <a href="/projects" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#c49028] text-[#c49028] font-bold rounded-xl hover:bg-[#c49028]/10 transition-all">
                View Our Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
