import { motion } from 'framer-motion';
import {
  Target, Eye, Shield, Award, Users,
  Globe, TrendingUp, Heart, Lightbulb, Leaf, Quote
} from 'lucide-react';
import { useTeamMembers, usePageContent, useSiteSettings, useAutoCounters } from '../hooks/useData';
import PageHero from '../components/PageHero';

const valueIcons = [Shield, Award, Lightbulb, Heart, Leaf, Users];

function FounderSection({ c }: { c: (s: string, k: string, fb?: string) => string }) {
  const { settings } = useSiteSettings();

  const founderName = settings?.founder_name || c('founder', 'name');
  const founderDesignation = settings?.founder_designation || c('founder', 'designation');
  const founderBio = settings?.founder_bio || c('founder', 'bio');
  const founderMessage = settings?.founder_message || c('founder', 'message');
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
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold-500/20">
                {founderImage ? (
                  <img src={founderImage} alt={founderName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy-800/50">
                    <Users className="w-20 h-20 text-gold-500/20" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 px-6 py-3 rounded-xl shadow-gold-lg text-center min-w-[200px]">
                <p className="font-heading font-bold text-lg">{founderName}</p>
                {founderDesignation && <p className="text-xs font-medium opacity-90">{founderDesignation}</p>}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3">
            <Quote className="w-12 h-12 text-gold-500/30 mb-4" />
            {founderMessage && (
              <p className="text-xl text-gray-300 italic leading-relaxed mb-6 font-heading">"{founderMessage}"</p>
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

function TeamSection({ c }: { c: (s: string, k: string, fb?: string) => string }) {
  const { data: team } = useTeamMembers();
  if (team.length === 0) return null;
  return (
    <section id="team" className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
            {c('team', 'badge', 'Our Team')}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">{c('team', 'title', 'Meet Our Leadership')}</h2>
          {c('team', 'description') && <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{c('team', 'description')}</p>}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div key={member.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
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
                {member.bio && <p className="text-gray-400 text-sm">{member.bio}</p>}
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

  // Timeline — fully editable via Content Editor (reads from page_content about.timeline.*)
  const timelineItems = [1, 2, 3, 4, 5, 6].map(i => ({
    year: c('timeline', `year_${i}`),
    title: c('timeline', `title_${i}`),
    description: c('timeline', `description_${i}`),
  })).filter(item => item.year && item.title);

  // Core values — DB-driven with icon fallbacks
  const valueIconComponents = valueIcons;
  const coreValues = [1, 2, 3, 4, 5, 6].map((i, idx) => ({
    icon: valueIconComponents[idx],
    title: c('values', `value_${i}_title`),
    description: c('values', `value_${i}_description`),
  })).filter(v => v.title);

  return (
    <>
      <PageHero pageId="about" />

      {/* Company Overview */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {c('overview', 'badge') && (
                <span className="text-gold-500 text-sm font-medium tracking-wider uppercase block mb-2">{c('overview', 'badge')}</span>
              )}
              {/* DB key is 'overview_title' or 'title' — check both */}
              {(c('overview', 'overview_title') || c('overview', 'title')) && (
                <h2 className="text-4xl font-heading font-bold text-white mt-2 mb-6">
                  {c('overview', 'overview_title') || c('overview', 'title')}
                </h2>
              )}
              <div className="space-y-4 text-gray-400 leading-relaxed">
                {c('overview', 'paragraph_1') && <p>{c('overview', 'paragraph_1')}</p>}
                {c('overview', 'paragraph_2') && <p>{c('overview', 'paragraph_2')}</p>}
                {c('overview', 'paragraph_3') && <p>{c('overview', 'paragraph_3')}</p>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              {settings?.about_image_url ? (
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <img src={settings.about_image_url} alt="Company" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-navy-800/50 border border-gold-500/10 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-gold-500/40" />
                    </div>
                    <p className="text-gray-500 text-sm">Upload About page image in Settings</p>
                  </div>
                </div>
              )}
              {counters.experience > 0 && (
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 p-6 rounded-2xl shadow-gold-lg">
                  <div className="text-3xl font-heading font-bold">{counters.experience}+</div>
                  <div className="text-sm font-medium">Years Experience</div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      {(c('vision', 'description') || c('mission', 'description')) && (
        <section className="py-24 bg-gradient-to-b from-navy-950 to-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {c('vision', 'description') && (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                    <Eye className="w-8 h-8 text-gold-500" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">{c('vision', 'title', 'Our Vision')}</h3>
                  <p className="text-gray-400 leading-relaxed">{c('vision', 'description')}</p>
                </motion.div>
              )}
              {c('mission', 'description') && (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-gold-500" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">{c('mission', 'title', 'Our Mission')}</h3>
                  <p className="text-gray-400 leading-relaxed">{c('mission', 'description')}</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Core Values — only renders when values exist in DB */}
      {coreValues.length > 0 && (
        <section className="py-24 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              {c('values', 'badge') && (
                <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
                  {c('values', 'badge')}
                </span>
              )}
              {c('values', 'title') && (
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">{c('values', 'title')}</h2>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                  className="group bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                    <value.icon className="w-7 h-7 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Journey Through Years — DB-driven timeline */}
      {timelineItems.length > 0 && (
        <section className="py-24 bg-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
                {c('timeline', 'section_title', 'Journey Through Years')}
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold-500/30 hidden md:block" />
              <div className="space-y-12">
                {timelineItems.map((item, index) => (
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
      )}

      {/* Why Choose Us */}
      {c('strengths', 'title') && (
        <section className="py-24 bg-gradient-to-b from-navy-900 to-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              {c('strengths', 'badge') && (
                <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
                  {c('strengths', 'badge')}
                </span>
              )}
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">{c('strengths', 'title')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Award, idx: 1 },
                { icon: Shield, idx: 2 },
                { icon: TrendingUp, idx: 3 },
                { icon: Globe, idx: 4 },
              ].map(({ icon: Icon, idx }, i) => {
                const title = c('strengths', `strength_${idx}_title`);
                const desc = c('strengths', `strength_${idx}_description`);
                if (!title) return null;
                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-10 h-10 text-gold-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <FounderSection c={c} />
      <TeamSection c={c} />
    </>
  );
}
