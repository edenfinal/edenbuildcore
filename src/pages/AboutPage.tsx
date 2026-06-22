import { motion } from 'framer-motion';
import {
  Target, Eye, Shield, Award, Users, Globe, Building2,
  CheckCircle, History, TrendingUp, Heart, Lightbulb, Leaf
} from 'lucide-react';
import { useTeamMembers, usePageContent } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { TeamMember } from '../lib/supabase';

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

function TeamSection() {
  const { data: team } = useTeamMembers();
  const pageContent = usePageContent('about');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  const displayTeam = team.length > 0 ? team : [
    { id: '1', full_name: 'Muhammad Hassan', designation: 'CEO & Founder', department: 'Executive', bio: 'Visionary leader with 30+ years in construction industry.' },
    { id: '2', full_name: 'Sarah Ahmed', designation: 'Chief Operations Officer', department: 'Operations', bio: 'Expert in project management and operational excellence.' },
    { id: '3', full_name: 'Ali Khan', designation: 'Chief Technical Officer', department: 'Technical', bio: 'Leading innovation in construction technology and methods.' },
    { id: '4', full_name: 'Fatima Malik', designation: 'HR Director', department: 'Human Resources', bio: 'Building and nurturing our exceptional team.' },
  ];

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
          {displayTeam.map((member, index) => (
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
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors">
                  {member.full_name}
                </h3>
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
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  return (
    <>
      {/* Hero Section */}
      <PageHero
        pageId="about"
        fallbackTitle="About Eden Buildcore"
        fallbackSubtitle="Our Story"
        fallbackDescription="Two decades of excellence in construction, engineering, and infrastructure development"
        fallbackImage="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Company Overview */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold-500 text-sm font-medium tracking-wider uppercase">{c('overview', 'badge', 'Company Overview')}</span>
              <h2 className="text-4xl font-heading font-bold text-white mt-2 mb-6">
                {c('overview', 'title', 'A Legacy of Construction Excellence')}
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  {c('overview', 'paragraph_1', 'Eden Buildcore (Pvt.) Ltd. is a premier construction and engineering company that has been shaping Pakistan\'s infrastructure landscape since 1999. With a portfolio spanning commercial, residential, industrial, and infrastructure projects, we have established ourselves as leaders in the industry.')}
                </p>
                <p>
                  {c('overview', 'paragraph_2', 'Our commitment to quality, innovation, and client satisfaction has earned us the trust of government bodies, multinational corporations, and private developers alike. Every project we undertake reflects our dedication to excellence and our passion for building structures that stand the test of time.')}
                </p>
                <p>
                  {c('overview', 'paragraph_3', 'From landmark high-rises to critical infrastructure projects, we bring the same level of expertise, professionalism, and attention to detail. Our team of engineers, architects, and construction professionals work collaboratively to transform visions into reality.')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Construction Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 p-6 rounded-2xl shadow-gold-lg">
                <div className="text-3xl font-heading font-bold">25+</div>
                <div className="text-sm font-medium">Years Experience</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">{c('vision', 'title', 'Our Vision')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {c('vision', 'description', 'To be the leading construction and engineering company in the region, setting new standards of excellence, innovation, and sustainable development. We envision a future where every structure we build becomes a landmark of quality and reliability, contributing to the nation\'s progress and prosperity.')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">{c('mission', 'title', 'Our Mission')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {c('mission', 'description', 'To deliver exceptional construction solutions that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety. We strive to build lasting relationships based on trust, integrity, and mutual respect, while contributing positively to the communities we serve.')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('values', 'badge', 'What Drives Us')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
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
                className="group bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                  <value.icon className="w-7 h-7 text-gold-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{c('values', `value_${index + 1}_title`, value.title)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{c('values', `value_${index + 1}_description`, value.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Journey Through Years
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold-500/30 hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}
                >
                  <div className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-6">
                    <div className="absolute top-6 w-4 h-4 bg-gold-500 rounded-full hidden md:block"
                      style={{ [index % 2 === 0 ? 'right' : 'left']: '-8px' }}
                    />
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
      <section className="py-24 bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
              {c('strengths', 'badge', 'Why Choose Us')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
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

      {/* Team Section */}
      <TeamSection />
    </>
  );
}
