import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Linkedin, Twitter, Mail, Phone,
  Award, Star, Briefcase, Globe
} from 'lucide-react';
import { useTeamMembers, usePageContent } from '../hooks/useData';
import type { TeamMember } from '../lib/supabase';
import PageHero from '../components/PageHero';

const DEPT_COLORS: Record<string, string> = {
  engineering: '#3b82f6',
  management:  '#c49028',
  operations:  '#10b981',
  design:      '#8b5cf6',
  finance:     '#f59e0b',
  hr:          '#ec4899',
  it:          '#06b6d4',
  sales:       '#f97316',
};

function getDeptColor(dept?: string | null) {
  if (!dept) return '#c49028';
  const key = dept.toLowerCase().trim();
  return DEPT_COLORS[key] || '#c49028';
}

export default function OurTeamPage() {
  const { data: team } = useTeamMembers();
  const pageContent = usePageContent('team');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeTeam = team.filter((m) => m.is_active !== false);

  // Group by department
  const departments = Array.from(new Set(activeTeam.map(m => m.department).filter(Boolean)));
  const hasDepts = departments.length > 1;

  const [activeDept, setActiveDept] = useState<string>('all');
  const filtered = activeDept === 'all' ? activeTeam : activeTeam.filter(m => m.department === activeDept);
  const featured = filtered.filter(m => m.is_featured);
  const rest = filtered.filter(m => !m.is_featured);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[420px] flex items-end bg-[#030810] overflow-hidden pt-20">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a2e] via-[#030810] to-[#030810]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#c49028]/5 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#c49028]/3 blur-[100px]" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(#c49028 1px, transparent 1px), linear-gradient(90deg, #c49028 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pb-16 pt-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c49028]/10 border border-[#c49028]/20 text-[#c49028] rounded-full text-sm font-medium tracking-wider uppercase mb-6">
              <Users className="w-4 h-4" />
              {c('hero', 'badge', 'Our People')}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              <span className="text-[#c49028]">{c('hero', 'title_line1', 'Meet the')}</span>
              <br />
              {c('hero', 'title_line2', 'Team Behind Excellence')}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              {c('hero', 'description', 'Dedicated professionals who bring skill, passion, and commitment to every project we undertake.')}
            </p>
          </motion.div>

          {/* Stats strip */}
          {activeTeam.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-8">
              <div>
                <div className="text-4xl font-heading font-bold text-white">{activeTeam.length}</div>
                <div className="text-gray-500 text-sm mt-1">Team Members</div>
              </div>
              {departments.length > 0 && (
                <div>
                  <div className="text-4xl font-heading font-bold text-white">{departments.length}</div>
                  <div className="text-gray-500 text-sm mt-1">Departments</div>
                </div>
              )}
              {featured.length > 0 && (
                <div>
                  <div className="text-4xl font-heading font-bold text-[#c49028]">{activeTeam.filter(m => m.is_featured).length}</div>
                  <div className="text-gray-500 text-sm mt-1">Leadership</div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Department Filter */}
      {hasDepts && (
        <section className="bg-[#060d18] border-b border-[#c49028]/10 sticky top-[64px] z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
              {['all', ...departments].map(dept => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeDept === dept
                      ? 'bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] shadow-[0_0_15px_rgba(196,144,40,0.25)]'
                      : 'bg-[#0c1a2e] text-gray-400 border border-[#c49028]/10 hover:border-[#c49028]/25 hover:text-white'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No team state */}
      {activeTeam.length === 0 && (
        <section className="py-32 bg-[#030810]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#c49028]/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-[#c49028]/30" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-3">Team Coming Soon</h2>
            <p className="text-gray-400">Team members will be displayed here once added from the admin panel.</p>
          </div>
        </section>
      )}

      {/* Featured / Leadership */}
      {featured.length > 0 && (
        <section className="py-20 bg-[#030810]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 rounded-xl bg-[#c49028]/10 border border-[#c49028]/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-[#c49028]" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white">
                <span className="text-[#c49028]">Leadership</span> Team
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#c49028]/20 to-transparent ml-2" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rest of team */}
      {rest.length > 0 && (
        <section className={`py-20 ${featured.length > 0 ? 'bg-[#060d18]' : 'bg-[#030810]'}`}>
          <div className="max-w-7xl mx-auto px-6">
            {featured.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 rounded-xl bg-[#c49028]/10 border border-[#c49028]/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#c49028]" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-white">
                  <span className="text-[#c49028]">Our</span> Team
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#c49028]/20 to-transparent ml-2" />
              </motion.div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rest.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join Us CTA */}
      <section className="py-20 bg-[#030810]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl bg-[#c49028]/10 flex items-center justify-center mx-auto mb-6 border border-[#c49028]/20">
              <Briefcase className="w-8 h-8 text-[#c49028]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              {c('cta', 'title', 'Join Our Team')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              {c('cta', 'description', "We're always looking for talented individuals to join our growing team. Explore open positions.")}
            </p>
            <a href="/careers" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(196,144,40,0.3)] transition-all">
              View Open Positions
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function MemberCard({ member, index, featured = false }: {
  member: TeamMember;
  index: number;
  featured?: boolean;
}) {
  const deptColor = getDeptColor(member.department);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group relative"
    >
      <div className={`relative bg-[#0c1a2e] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(196,144,40,0.08)] hover:-translate-y-1 ${
        featured ? 'border-[#c49028]/25 hover:border-[#c49028]/40' : 'border-[#c49028]/10 hover:border-[#c49028]/25'
      }`}>

        {/* Top accent line */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${deptColor}, transparent)` }} />

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 bg-[#c49028] text-[#030810] text-[10px] font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
            <Star className="w-2.5 h-2.5" /> Leadership
          </div>
        )}

        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#060d18]">
          {member.image_url ? (
            <img
              src={member.image_url}
              alt={member.full_name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-heading font-bold text-[#c49028]/20">
                {member.full_name.charAt(0)}
              </span>
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2e] via-transparent to-transparent opacity-70" />
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-white font-semibold text-base leading-tight group-hover:text-[#c49028] transition-colors">
            {member.full_name}
          </h3>
          {member.designation && (
            <p className="text-sm mt-1" style={{ color: deptColor }}>{member.designation}</p>
          )}
          {member.department && (
            <span className="inline-block mt-2 text-[10px] font-medium text-gray-500 uppercase tracking-widest">
              {member.department}
            </span>
          )}
          {member.bio && (
            <p className="text-gray-400 text-xs mt-3 leading-relaxed line-clamp-3">{member.bio}</p>
          )}

          {/* Experience */}
          {member.experience_years && (
            <div className="flex items-center gap-1.5 mt-3">
              <Award className="w-3.5 h-3.5 text-[#c49028]/60" />
              <span className="text-xs text-gray-500">{member.experience_years} yrs experience</span>
            </div>
          )}

          {/* Specializations */}
          {member.specializations && member.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {member.specializations.slice(0, 3).map((s, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-[#c49028]/8 border border-[#c49028]/15 text-[#c49028]/70 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Social links */}
          {(member.linkedin_url || member.twitter_url || member.email || member.phone) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#c49028]/10">
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#030810] border border-[#c49028]/10 flex items-center justify-center text-gray-500 hover:text-[#c49028] hover:border-[#c49028]/30 transition-all">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {member.twitter_url && (
                <a href={member.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#030810] border border-[#c49028]/10 flex items-center justify-center text-gray-500 hover:text-[#c49028] hover:border-[#c49028]/30 transition-all">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`}
                  className="w-8 h-8 rounded-lg bg-[#030810] border border-[#c49028]/10 flex items-center justify-center text-gray-500 hover:text-[#c49028] hover:border-[#c49028]/30 transition-all">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {member.phone && (
                <a href={`tel:${member.phone}`}
                  className="w-8 h-8 rounded-lg bg-[#030810] border border-[#c49028]/10 flex items-center justify-center text-gray-500 hover:text-[#c49028] hover:border-[#c49028]/30 transition-all">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
