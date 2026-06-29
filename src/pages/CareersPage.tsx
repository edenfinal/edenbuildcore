import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Users, ChevronDown, Send, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useJobs, submitJobApplication, usePageContent } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { Job } from '../lib/supabase';



function JobCard({ job, onApply, c }: { job: Job; onApply: () => void; c: (section: string, key: string, fallback: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const requirements = job.requirements as string[] || [];
  const responsibilities = job.responsibilities as string[] || [];
  const benefits = job.benefits as string[] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all"
    >
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {job.is_featured && (
              <span className="px-3 py-1 bg-gold-500 text-navy-950 text-xs font-semibold rounded-full mb-3 inline-block">
                Featured
              </span>
            )}
            <h3 className="text-xl font-heading font-semibold text-white mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {job.department && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-gold-500" />
                  {job.department}
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  {job.location}
                </span>
              )}
              {job.employment_type && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gold-500" />
                  {job.employment_type}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {job.openings && (
              <span className="text-sm text-gray-400">
                <Users className="w-4 h-4 inline mr-1 text-gold-500" />
                {job.openings} Opening{job.openings > 1 ? 's' : ''}
              </span>
            )}
            {job.salary_range && (
              <span className="text-sm text-gold-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />{job.salary_range}
              </span>
            )}
            {job.experience_level && (
              <span className="text-sm text-gray-500">{job.experience_level}</span>
            )}
          </div>
        </div>

        <p className="text-gray-400 mt-4">{job.description}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-gold-500 hover:text-gold-400 mt-4 font-medium text-sm"
        >
          {expanded ? c('careers.job', 'hide_details', 'Hide Details') : c('careers.job', 'view_details', 'View Details')}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gold-500/10"
          >
            <div className="p-6 space-y-6">
              {requirements.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3">{c('careers.job', 'requirements_title', 'Requirements')}</h4>
                  <ul className="space-y-2">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                        <CheckCircle className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {benefits.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3">{c('careers.job', 'benefits_title', 'Benefits')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {benefits.map((benefit, i) => (
                      <span key={i} className="px-3 py-1 bg-gold-500/10 text-gold-400 rounded-full text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onApply}
                className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all"
              >
                {c('careers.job', 'apply_button', 'Apply Now')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ApplicationForm({ job, onClose, c }: { job: Job; onClose: () => void; c: (section: string, key: string, fallback: string) => string }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume_url: '',
    portfolio_url: '',
    linkedin_url: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const success = await submitJobApplication({
      job_id: job.id,
      ...formData
    });
    setStatus(success ? 'success' : 'error');
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur-lg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-navy-800/90 rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">{c('careers.application', 'title', 'Apply for Position')}</h2>
            <p className="text-gold-500">{job.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="sr-only">Close</span>
            X
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{c('careers.application', 'success_title', 'Application Submitted!')}</h3>
            <p className="text-gray-400">{c('careers.application', 'success_message', "We'll review your application and contact you soon.")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{c('careers.application', 'label_name', 'Full Name')} *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:border-gold-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{c('careers.application', 'label_email', 'Email')} *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{c('careers.application', 'label_phone', 'Phone')} *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:border-gold-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{c('careers.application', 'label_resume', 'Resume URL')}</label>
              <input
                type="url"
                value={formData.resume_url}
                onChange={e => setFormData(prev => ({ ...prev, resume_url: e.target.value }))}
                className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:border-gold-500/50"
                placeholder="Link to your resume"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{c('careers.application', 'label_cover', 'Cover Letter')}</label>
              <textarea
                value={formData.cover_letter}
                onChange={e => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:border-gold-500/50"
                placeholder="Tell us why you're the right fit..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{c('careers.application', 'label_linkedin', 'LinkedIn')}</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={e => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{c('careers.application', 'label_portfolio', 'Portfolio')}</label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={e => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:border-gold-500/50"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                Failed to submit. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl flex items-center justify-center gap-2"
            >
              {status === 'loading' ? 'Submitting...' : c('careers.application', 'submit_button', 'Submit Application')}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function CareersPage() {
  const { data: jobs } = useJobs();
  const pageContent = usePageContent('careers');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState('all');

  const displayJobs = jobs.filter(j => j.is_active !== false);
  const departments = ['all', ...new Set(displayJobs.map(j => j.department).filter(Boolean))];

  const filteredJobs = filter === 'all'
    ? displayJobs
    : displayJobs.filter(j => j.department === filter);

  return (
    <>
      {/* Hero Section */}
      <PageHero
        pageId="careers"
      />

      {/* Filter */}
      <section className="py-6 bg-navy-950 border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {departments.map((dept) => (
              <button
                key={dept as string}
                onClick={() => setFilter(dept as string)}
                className={`px-5 py-2 rounded-full capitalize font-medium transition-all ${
                  filter === dept
                    ? 'bg-gold-500 text-navy-950'
                    : 'bg-navy-800/50 text-gray-400 hover:text-white border border-gold-500/20'
                }`}
              >
                {dept === 'all' ? c('careers.filters', 'all_text', 'All Positions') : dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-16 bg-navy-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => setSelectedJob(job)}
                c={c}
              />
            ))}
          </div>

          {displayJobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-white mb-2">No Open Positions</h3>
              <p className="text-gray-400">Check back soon — we'll post new openings here.</p>
            </div>
          )}
          {displayJobs.length > 0 && filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
              <p className="text-gray-400">No positions in this department.</p>
            </div>
          )}
        </div>
      </section>

      {/* Application Form Modal */}
      <AnimatePresence>
        {selectedJob && (
          <ApplicationForm job={selectedJob} onClose={() => setSelectedJob(null)} c={c} />
        )}
      </AnimatePresence>
    </>
  );
}
