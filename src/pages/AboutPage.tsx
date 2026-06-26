import { motion } from 'framer-motion';
import {
  Target, Eye, Shield, Award, Users,
  Globe, TrendingUp, Heart, Lightbulb, Leaf, Quote
} from 'lucide-react';
import { useTeamMembers, usePageContent, useSiteSettings, useAutoCounters } from '../hooks/useData';
import PageHero from '../components/PageHero';

const timeline = [
  { year: '1999', title: 'Company Founded', description: 'Eden Buildcore was established with a vision to transform the construction industry.' },
  { year: '2005', title: 'Regional Expansion', description: 'Expanded operations across multiple cities, completing 100+ projects.' },
  { year: '2010', title: 'ISO Certification', description: 'Achieved ISO 9001 certification, marking our commitment to quality.' },
  { year: '2015', title: 'Infrastructure Division', description: 'Launched dedicated infrastructure development division.' },
  { year: '2020', title: '500th Project', description: 'Celebrated completion of 500+ successful projects milestone.' },
  { year: '2024', title: 'Sustainability Focus', description: 'Launched green construction initiatives and solar division.' },
];

const coreValues = [
  { icon: Shield, title: 'Integrity', description: 'We uphold the highest ethical standards in all our dealings, building trust through transparency and honesty.' },
  { icon: Award, title: 'Excellence', description: 'We pursue excellence in every project, never compromising on quality and attention to detail.' },
  { icon: Users, title: 'Teamwork', description: 'We believe in collaborative teamwork, combining diverse skills to achieve extraordinary results.' },
  { icon: Lightbulb, title: 'Innovation', description: 'We embrace new technologies and methods, continuously improving our processes and solutions.' },
  { icon: Heart, title: 'Client Focus', description: 'Our clients are at the center of everything we do. Their success is our success.' },
  { icon: Leaf, title: 'Sustainability', description: 'We are committed to sustainable practices that protect our environment for future generations.' },
];

function FounderSection() {
  const { settings } = useSiteSettings();
  const pageContent = usePageContent('about');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);

  const founderName = settings?.founder_name || c('founder', 'name', '');
  const founderDesignation = settings?.founder_designation || c('founder', 'designation', '');
  const founderBio = settings?.founder_bio || c('founder', 'bio', '');
  const founderMessage = settings?.founder_message || c('founder', 'message', '');
  const founderImage = settings?.founder_image_url || '';

  if (!founderName && !founderBio) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-navy-950 to-navy-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
            {c('founder', 'badge', 'Our Leadership')}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
            {c('founder', 'title', 'Message from the Founder')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold-500/20">
                {founderImage ? (
                  <img src={founderImage} alt={founderName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy-800/50">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-12 h-12 text-gold-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 px-6 py-3 rounded-xl shadow-gold-lg text-center min-w-[200px]">
                <p className="font-heading font-bold text-lg">{founderName}</p>
                {founderDesignation && <p className="text-xs font-medium opacity-90">{founderDesignation}</p>}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Quote className="w-12 h-12 text-gold-500/30 mb-4" />
            {founderMessage && (
              <p className="text-xl text-gray-300 italic leading-relaxed mb-6 font-heading">
                "{founderMessage}"
              </p>
            )}
            {founderBio && <p className="text-gray-400 leading-relaxed mb-6">{founderBio}</p>}
            <div className="flex items-center gap-4 pt-6 border-t border-gold-500/10">
              <div>
                <p className="text-white font-heading font-bold text-lg">{founderName}</p>
                <p className="text-gold-500 text-sm">{founderDesignation}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const { data: team } = useTeamMembers();
  const pageContent = usePageContent('about');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);

  if (team.length === 0) return null;

  return (
    <section id="team" className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
            {c('team', 'badge', 'Our Team')}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
            {c('team', 'title', 'Meet Our Leadership')}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all">
                <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-navy-700/50">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold-500 text-4xl font-heading font-bold">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors">{member.full_name}</h3>
                <p className="text-gold-500 text-sm mb-3">{member.designation}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const pageContent = usePageContent('about');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);
  const { counters } = useAutoCounters();
  const { settings } = useSiteSettings();
  const overviewImage = settings?.secondary_logo_url || '';

  return (
    <>
      <PageHero pageId="about" />

      {/* Company Overview */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid gap-16 items-center ${overviewImage ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl mx-auto'}`}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {c('overview', 'badge', '') && (
                <span className="text-gold-500 text-sm font-medium tracking-wider uppercase">{c('overview', 'badge', '')}</span>
              )}
              {c('overview', 'title', '') && (
                <h2 className="text-4xl font-heading font-bold text-white mt-2 mb-6">{c('overview', 'title', '')}</h2>
              )}
              <div className="space-y-4 text-gray-400 leading-relaxed">
                {c('overview', 'paragraph_1', '') && <p>{c('overview', 'paragraph_1', '')}</p>}
                {c('overview', 'paragraph_2', '') && <p>{c('overview', 'paragraph_2', '')}</p>}
                {c('overview', 'paragraph_3', '') && <p>{c('overview', 'paragraph_3', '')}</p>}
              </div>
            </motion.div>

            {overviewImage && (
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <img src={overviewImage} alt="Company" className="w-full h-full object-cover" />
                </div>
                {counters.experience > 0 && (
                  <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 p-6 rounded-2xl shadow-gold-lg">
                    <div className="text-3xl font-heading font-bold">{counters.experience}+</div>
                    <div className="text-sm font-medium">Years Experience</div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Vision & Mission — only render if content exists */}
      {(c('vision', 'description', '') || c('mission', 'description', '')) && (
        <section className="py-24 bg-gradient-to-b from-navy-950 to-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {c('vision', 'description', '') && (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                    <Eye className="w-8 h-8 text-gold-500" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">{c('vision', 'title', 'Our Vision')}</h3>
                  <p className="text-gray-400 leading-relaxed">{c('vision', 'description', '')}</p>
                </motion.div>
              )}
              {c('mission', 'description', '') && (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-gold-500" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">{c('mission', 'title', 'Our Mission')}</h3>
                  <p className="text-gray-400 leading-relaxed">{c('mission', 'description', '')}</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            {c('values', 'badge', '') && (
              <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
                {c('values', 'badge', '')}
              </span>
            )}
            {c('values', 'title', '') && (
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">{c('values', 'title', '')}</h2>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const title = c('values', `value_${index + 1}_title`, value.title);
              const desc = c('values', `value_${index + 1}_description`, value.description);
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                  className="group bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                    <value.icon className="w-7 h-7 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">Journey Through Years</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold-500/30 hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div key={item.year} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
                  <div className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-6">
                    <div className="absolute top-6 w-4 h-4 bg-gold-500 rounded-full hidden md:block"
                      style={{ [index % 2 === 0 ? 'right' : 'left']: '-8px' }} />
                    <span className="text-gold-500 font-heading font-bold text-2xl">{item.year}</span>
                    <h3 className="text-lg font-semibold text-white mt-2 mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {c('strengths', 'title', '') && (
        <section className="py-24 bg-gradient-to-b from-navy-900 to-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              {c('strengths', 'badge', '') && (
                <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
                  {c('strengths', 'badge', '')}
                </span>
              )}
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">{c('strengths', 'title', '')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Award, title: 'Quality Assurance', desc: 'Rigorous quality control at every stage' },
                { icon: Shield, title: 'Safety First', desc: 'Zero compromise on safety standards' },
                { icon: TrendingUp, title: 'On-Time Delivery', desc: 'Proven track record of timely completion' },
                { icon: Globe, title: 'Global Standards', desc: 'International quality benchmarks' },
              ].map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-10 h-10 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{c('strengths', `strength_${index + 1}_title`, item.title)}</h3>
                  <p className="text-gray-400 text-sm">{c('strengths', `strength_${index + 1}_description`, item.desc)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FounderSection />
      <TeamSection />
    </>
  );
}
