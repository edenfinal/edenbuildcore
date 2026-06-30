import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Shield, FileText, CheckCircle, ExternalLink, ArrowLeft, ArrowRight, Calendar, Building } from 'lucide-react';
import { useCertifications, usePageContent } from '../hooks/useData';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';

type Cert = ReturnType<typeof useCertifications>['data'][number];

/* ─── Certificate Card ─── */
function CertCard({ cert, index }: { cert: Cert; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group"
    >
      <Link to={`/certifications/${cert.id}`} className="block h-full">
        <div className="relative h-full bg-navy-800/40 backdrop-blur-sm border border-gold-500/10 rounded-2xl overflow-hidden hover:border-gold-500/40 hover:shadow-[0_0_30px_rgba(196,144,40,0.08)] transition-all duration-300 cursor-pointer">

          {/* Image area */}
          <div className="relative overflow-hidden bg-navy-900/60">
            {cert.image_url ? (
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-800">
                <div className="w-20 h-20 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                  <Award className="w-10 h-10 text-gold-500/60" />
                </div>
              </div>
            )}
            {/* Category pill */}
            {cert.category && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-gold-500/90 text-navy-950 text-[10px] font-bold uppercase tracking-wider rounded-full">
                {cert.category}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5">
            <h3 className="text-base font-heading font-bold text-white group-hover:text-gold-400 transition-colors leading-snug mb-2">
              {cert.title}
            </h3>
            {cert.description && (
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{cert.description}</p>
            )}
            <div className="space-y-1 text-xs text-gray-500">
              {cert.issuing_authority && (
                <p className="flex items-center gap-1.5">
                  <Building className="w-3 h-3 text-gold-500/60 flex-shrink-0" />
                  {cert.issuing_authority}
                </p>
              )}
              {cert.issue_date && (
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-gold-500/60 flex-shrink-0" />
                  {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              )}
              {cert.certificate_number && (
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-gold-500/60 flex-shrink-0" />
                  {cert.certificate_number}
                </p>
              )}
            </div>
            {/* View detail CTA */}
            <div className="mt-4 pt-4 border-t border-gold-500/10 flex items-center justify-between">
              <span className="text-gold-500 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Certificate <ArrowRight className="w-3.5 h-3.5" />
              </span>
              {cert.verification_url && (
                <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Certificate Detail Page ─── */
function CertDetail() {
  const { id } = useParams();
  const { data: certifications } = useCertifications();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const cert = certifications.find(c => c.id === id);

  if (!cert) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-gold-500/30 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-white mb-3">Certificate Not Found</h2>
          <Link to="/certifications" className="text-gold-500 hover:text-gold-400 flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" /> Back to Certifications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-24">
      {/* Back bar */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certifications
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Image — takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="relative bg-navy-800/50 border border-gold-500/10 rounded-2xl overflow-hidden">
              {cert.image_url ? (
                <>
                  {!imgLoaded && (
                    <div className="aspect-[4/3] flex items-center justify-center bg-navy-900">
                      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full object-contain p-6 transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                  />
                </>
              ) : (
                <div className="aspect-[4/3] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-navy-900 to-navy-800">
                  <Award className="w-24 h-24 text-gold-500/20" />
                  <p className="text-gray-600 text-sm">No image available</p>
                </div>
              )}
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold-500/20 to-transparent" />
            </div>
          </motion.div>

          {/* Info — takes 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {cert.category && (
              <span className="inline-block px-3 py-1 bg-gold-500/15 text-gold-400 text-xs font-semibold rounded-full uppercase tracking-wider border border-gold-500/20">
                {cert.category}
              </span>
            )}

            <div>
              <h1 className="text-3xl font-heading font-bold text-white leading-tight mb-3">{cert.title}</h1>
              {cert.description && (
                <p className="text-gray-400 leading-relaxed">{cert.description}</p>
              )}
            </div>

            {/* Details table */}
            <div className="bg-navy-800/40 border border-gold-500/10 rounded-xl divide-y divide-gold-500/5">
              {[
                { icon: Building, label: 'Issuing Authority', value: cert.issuing_authority },
                { icon: CheckCircle, label: 'Certificate No.', value: cert.certificate_number },
                { icon: Calendar, label: 'Issue Date', value: cert.issue_date ? new Date(cert.issue_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null },
                { icon: Calendar, label: 'Expiry Date', value: cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null },
              ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 px-4 py-3">
                  <Icon className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {cert.verification_url && (
                <a
                  href={cert.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-xl hover:bg-gold-500/20 transition-all font-medium text-sm"
                >
                  <ExternalLink className="w-4 h-4" /> Verify Certificate
                </a>
              )}
              <Link
                to="/certifications"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-navy-800/50 text-gray-400 border border-gold-500/10 rounded-xl hover:text-white hover:border-gold-500/30 transition-all text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> All Certifications
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Certifications Page ─── */
export default function CertificationsPage() {
  const { id } = useParams();
  const { data: certifications } = useCertifications();
  const pageContent = usePageContent('certifications');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);

  if (id) return <CertDetail />;

  const active = certifications.filter(cert => cert.is_active !== false);

  // Group by category for clean display
  const grouped: Record<string, Cert[]> = {};
  active.forEach(cert => {
    const cat = cert.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(cert);
  });

  const sectionIcon = (cat: string) => {
    if (['ISO', 'Quality', 'Safety', 'Environmental'].includes(cat)) return Award;
    if (cat === 'Registration') return FileText;
    return Shield;
  };

  return (
    <>
      <PageHero pageId="certifications" />

      {active.length === 0 ? (
        <section className="py-32 bg-navy-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Award className="w-20 h-20 text-gold-500/20 mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold text-white mb-3">No Certifications Added Yet</h2>
            <p className="text-gray-400 mb-8">Add certifications from the admin panel to display them here.</p>
            <Link to="/admin/certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 text-gold-500 rounded-xl hover:bg-gold-500/20 transition-all border border-gold-500/20">
              Manage Certifications
            </Link>
          </div>
        </section>
      ) : (
        Object.entries(grouped).map(([category, certs], sIdx) => {
          const Icon = sectionIcon(category);
          const bg = sIdx % 2 === 0 ? 'bg-navy-950' : 'bg-navy-900';
          return (
            <section key={category} className={`py-20 ${bg}`}>
              <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 mb-12"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-white">
                      <span className="text-gold-500">{category.split(' ')[0]}</span>
                      {category.includes(' ') ? ' ' + category.split(' ').slice(1).join(' ') : ''}
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">{certs.length} certificate{certs.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent ml-4" />
                </motion.div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {certs.map((cert, i) => (
                    <CertCard key={cert.id} cert={cert} index={i} />
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* CTA */}
      {active.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Shield className="w-14 h-14 text-gold-500 mx-auto mb-6" />
              <h2 className="text-3xl font-heading font-bold text-white mb-4">
                {c('cta', 'title', 'Committed to Excellence')}
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">{c('cta', 'description', 'Our certifications reflect our unwavering commitment to quality, safety, and responsibility.')}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={c('cta', 'button_1_link', '/contact')} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all">
                  {c('cta', 'button_1', 'Partner With Us')}
                </Link>
                <Link to={c('cta', 'button_2_link', '/projects')} className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gold-500 text-gold-500 font-bold rounded-xl hover:bg-gold-500/10 transition-all">
                  {c('cta', 'button_2', 'View Our Projects')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
