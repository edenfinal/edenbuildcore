import { motion } from 'framer-motion';
import {
  Target, Eye, Shield, Award, Users, Globe, Building2,
  CheckCircle, History, TrendingUp, Heart, Lightbulb, Leaf
} from 'lucide-react';
import { useTeamMembers, usePageContent } from '../hooks/useData';

const coreValues = [
  { icon: Shield, title: 'Integrity', description: 'We uphold the highest ethical standards in all our dealings, building trust through transparency and honesty.' },
  { icon: Award, title: 'Excellence', description: 'We pursue excellence in every project, never compromising on quality and attention to detail.' },
  { icon: Users, title: 'Teamwork', description: 'We believe in collaborative teamwork, combining diverse skills to achieve extraordinary results.' },
  { icon: Lightbulb, title: 'Innovation', description: 'We embrace new technologies and methods, continuously improving our processes and solutions.' },
  { icon: Heart, title: 'Client Focus', description: 'Our clients are at the center of everything we do. Their success is our success.' },
  { icon: Leaf, title: 'Sustainability', description: 'We are committed to sustainable practices that protect our environment for future generations.' },
];

function TeamSection() {
  const { data: team } = useTeamMembers();
  const pageContent = usePageContent('about');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  return (
    <section id="team" className="py-24" style={{ backgroundColor: 'var(--card-bg-color)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-4">
            {c('team', 'badge', 'Our Team')}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-color)]">
            {c('team', 'title', 'Meet Our Leadership')}
          </h2>
        </div>

        {team.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-[var(--primary-color)]/20 mx-auto mb-4" />
            <p className="text-[var(--muted-text-color)]">Team members will appear here once added from the admin panel.</p>
          </div>
        ) : (
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
                <div className="relative bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/10 rounded-2xl p-6 hover:border-[var(--primary-color)]/30 transition-all">
                  <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-[var(--card-bg-color)]">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--primary-color)] text-4xl font-heading font-bold">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-color)] mb-1 group-hover:text-[var(--accent-color)] transition-colors">
                    {member.full_name}
                  </h3>
                  <p className="text-[var(--primary-color)] text-sm mb-3">{member.designation}</p>
                  <p className="text-[var(--muted-text-color)] text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const pageContent = usePageContent('about');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-color)' }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-6 border border-[var(--primary-color)]/30">
              {c('hero', 'badge', 'About Us')}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[var(--text-color)] mb-6 leading-tight">
              {c('hero', 'title_line1', 'Building Excellence')}
              <span className="block text-[var(--primary-color)]">{c('hero', 'title_line2', 'Since 1999')}</span>
            </h1>
            <p className="text-xl text-[var(--muted-text-color)] leading-relaxed">
              {c('hero', 'description', 'For over two decades, Eden Buildcore has been at the forefront of construction innovation, delivering landmark projects that shape skylines and transform communities.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">{c('overview', 'badge', 'Company Overview')}</span>
              <h2 className="text-4xl font-heading font-bold text-[var(--text-color)] mt-2 mb-6">
                {c('overview', 'title', 'A Legacy of Construction Excellence')}
              </h2>
              <div className="space-y-4 text-[var(--muted-text-color)] leading-relaxed">
                <p>{c('overview', 'paragraph_1', "Eden Buildcore (Pvt.) Ltd. is a premier construction and engineering company that has been shaping Pakistan's infrastructure landscape since 1999.")}</p>
                <p>{c('overview', 'paragraph_2', 'Our commitment to quality, innovation, and client satisfaction has earned us the trust of government bodies, multinational corporations, and private developers alike.')}</p>
                <p>{c('overview', 'paragraph_3', 'From landmark high-rises to critical infrastructure projects, we bring the same level of expertise, professionalism, and attention to detail.')}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-[var(--card-bg-color)]">
                <Building2 className="w-full h-full text-[var(--primary-color)]/10 p-12" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[var(--primary-color)] text-[var(--bg-color)] p-6 rounded-2xl">
                <div className="text-3xl font-heading font-bold">{c('stats', 'stat_1_value', '25')}{c('stats', 'stat_1_suffix', '+')}</div>
                <div className="text-sm font-medium">{c('stats', 'stat_1_description', 'Years Experience')}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24" style={{ background: 'linear-gradient(to bottom, var(--bg-color), var(--card-bg-color))' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/20 rounded-2xl p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-[var(--primary-color)]" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-[var(--text-color)] mb-4">{c('vision', 'title', 'Our Vision')}</h3>
              <p className="text-[var(--muted-text-color)] leading-relaxed">{c('vision', 'description', 'To be the leading construction and engineering company in the region, setting new standards of excellence, innovation, and sustainable development.')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/20 rounded-2xl p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[var(--primary-color)]" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-[var(--text-color)] mb-4">{c('mission', 'title', 'Our Mission')}</h3>
              <p className="text-[var(--muted-text-color)] leading-relaxed">{c('mission', 'description', 'To deliver exceptional construction solutions that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety.')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24" style={{ backgroundColor: 'var(--card-bg-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('values', 'badge', 'What Drives Us')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-color)]">
              {c('values', 'title', 'Our Core Values')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/10 rounded-2xl p-6 hover:border-[var(--primary-color)]/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                  <value.icon className="w-7 h-7 text-[var(--primary-color)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">{c('values', `value_${index + 1}_title`, value.title)}</h3>
                <p className="text-[var(--muted-text-color)] text-sm leading-relaxed">{c('values', `value_${index + 1}_description`, value.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-color)]">
              Journey Through Years
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--primary-color)]/30 hidden md:block" />

            <div className="space-y-12">
              {[
                { year: c('timeline', 'year_1', '1999'), title: c('timeline', 'title_1', 'Company Founded'), desc: c('timeline', 'desc_1', 'Eden Buildcore was established with a vision to transform the construction industry.') },
                { year: c('timeline', 'year_2', '2005'), title: c('timeline', 'title_2', 'Regional Expansion'), desc: c('timeline', 'desc_2', 'Expanded operations across multiple cities, completing 100+ projects.') },
                { year: c('timeline', 'year_3', '2010'), title: c('timeline', 'title_3', 'ISO Certification'), desc: c('timeline', 'desc_3', 'Achieved ISO 9001 certification, marking our commitment to quality.') },
                { year: c('timeline', 'year_4', '2015'), title: c('timeline', 'title_4', 'Infrastructure Division'), desc: c('timeline', 'desc_4', 'Launched dedicated infrastructure development division.') },
                { year: c('timeline', 'year_5', '2020'), title: c('timeline', 'title_5', '500th Project'), desc: c('timeline', 'desc_5', 'Celebrated completion of 500+ successful projects milestone.') },
                { year: c('timeline', 'year_6', '2024'), title: c('timeline', 'title_6', 'Sustainability Focus'), desc: c('timeline', 'desc_6', 'Launched green construction initiatives and solar division.') },
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}
                >
                  <div className="bg-[var(--bg-color)]/50 backdrop-blur-sm border border-[var(--primary-color)]/20 rounded-2xl p-6">
                    <div className="absolute top-6 w-4 h-4 bg-[var(--primary-color)] rounded-full hidden md:block"
                      style={{ [index % 2 === 0 ? 'right' : 'left']: '-8px' }}
                    />
                    <span className="text-[var(--primary-color)] font-heading font-bold text-2xl">{item.year}</span>
                    <h3 className="text-lg font-semibold text-[var(--text-color)] mt-2 mb-2">{item.title}</h3>
                    <p className="text-[var(--muted-text-color)] text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24" style={{ background: 'linear-gradient(to bottom, var(--card-bg-color), var(--bg-color))' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--primary-color)]/20 text-[var(--accent-color)] rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('strengths', 'badge', 'Why Choose Us')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-color)]">
              {c('strengths', 'title', 'Our Strengths')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Quality Assurance', desc: 'Rigorous quality control at every stage' },
              { icon: Shield, title: 'Safety First', desc: 'Zero compromise on safety standards' },
              { icon: TrendingUp, title: 'On-Time Delivery', desc: 'Proven track record of timely completion' },
              { icon: Globe, title: 'Global Standards', desc: 'International quality benchmarks' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-10 h-10 text-[var(--primary-color)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">{c('strengths', `strength_${index + 1}_title`, item.title)}</h3>
                <p className="text-[var(--muted-text-color)] text-sm">{c('strengths', `strength_${index + 1}_description`, item.desc)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />
    </>
  );
}
