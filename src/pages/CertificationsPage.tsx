import { motion } from 'framer-motion';
import { Award, Shield, FileText, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { useCertifications, usePageContent } from '../hooks/useData';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function CertificationsPage() {
  const { data: certifications } = useCertifications();
  const pageContent = usePageContent('certifications');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);

  const active = certifications.filter(cert => cert.is_active !== false);
  const isoCerts   = active.filter(cert => ['Quality', 'Environmental', 'Safety', 'ISO'].includes(cert.category || ''));
  const regCerts   = active.filter(cert => cert.category === 'Registration');
  const otherCerts = active.filter(cert => !['Quality', 'Environmental', 'Safety', 'ISO', 'Registration'].includes(cert.category || ''));

  return (
    <>
      <PageHero pageId="certifications" />

      {/* ISO / Quality Certifications */}
      {(isoCerts.length > 0 || active.length === 0) && (
        <section className="py-20 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gold-500" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-white">
                {c('iso', 'title', 'ISO Certifications')}
              </h2>
              <p className="text-gray-400 mt-2">{c('iso', 'subtitle', 'International standards compliance')}</p>
            </div>

            {isoCerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No ISO certifications added yet. Add them in the admin panel.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {isoCerts.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-8 hover:border-gold-500/30 transition-all group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full" />

                    {/* Certificate Image */}
                    {cert.image_url && (
                      <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-navy-700/50">
                        <img
                          src={cert.image_url}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="relative">
                      {!cert.image_url && (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center mb-6">
                          <Award className="w-8 h-8 text-gold-500" />
                        </div>
                      )}

                      {cert.category && (
                        <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-xs font-medium mb-4">
                          {cert.category}
                        </div>
                      )}

                      <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                        {cert.title}
                      </h3>
                      {cert.description && <p className="text-gray-400 text-sm mb-4">{cert.description}</p>}

                      <div className="space-y-2 text-sm">
                        {cert.issuing_authority && (
                          <p className="text-gray-500">
                            <span className="text-gray-400">Authority:</span> {cert.issuing_authority}
                          </p>
                        )}
                        {cert.certificate_number && (
                          <p className="text-gray-500">
                            <span className="text-gray-400">Cert No:</span> {cert.certificate_number}
                          </p>
                        )}
                        {cert.issue_date && (
                          <p className="text-gray-500">
                            <span className="text-gray-400">Issued:</span> {new Date(cert.issue_date).toLocaleDateString()}
                          </p>
                        )}
                        {cert.expiry_date && (
                          <p className="text-gray-500">
                            <span className="text-gray-400">Expires:</span> {new Date(cert.expiry_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4">
                        {cert.document_url && (
                          <a href={cert.document_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm">
                            <Download className="w-4 h-4" /> Download
                          </a>
                        )}
                        {cert.verification_url && (
                          <a href={cert.verification_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                            <ExternalLink className="w-4 h-4" /> Verify
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Company Registrations */}
      {regCerts.length > 0 && (
        <section className="py-20 bg-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gold-500" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-white">{c('registrations', 'title', 'Company Registrations')}</h2>
              <p className="text-gray-400 mt-2">{c('registrations', 'subtitle', 'Legal compliance and registrations')}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regCerts.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-navy-800/30 border border-gold-500/10 rounded-xl overflow-hidden hover:border-gold-500/30 transition-all group"
                >
                  {cert.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex items-start gap-4 p-6">
                    <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{cert.title}</h3>
                      {cert.description && <p className="text-gray-400 text-sm mb-2">{cert.description}</p>}
                      {cert.certificate_number && (
                        <p className="text-gold-500 text-sm">Reg. No: {cert.certificate_number}</p>
                      )}
                      {cert.document_url && (
                        <a href={cert.document_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gray-400 hover:text-gold-500 text-sm mt-2">
                          <Download className="w-3 h-3" /> Download
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Certifications */}
      {otherCerts.length > 0 && (
        <section className="py-20 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h2 className="text-3xl font-heading font-bold text-white">Additional Certifications</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherCerts.map((cert, index) => (
                <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                  className="bg-navy-800/50 border border-gold-500/10 rounded-xl overflow-hidden hover:border-gold-500/30 transition-all group">
                  {cert.image_url && (
                    <div className="aspect-square w-full overflow-hidden">
                      <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 text-center">
                    {!cert.image_url && <Award className="w-10 h-10 text-gold-500 mx-auto mb-3" />}
                    <h3 className="text-white font-semibold mb-1">{cert.title}</h3>
                    {cert.issuing_authority && <p className="text-gray-400 text-sm">{cert.issuing_authority}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state when NO certs at all */}
      {active.length === 0 && (
        <section className="py-32 bg-navy-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Award className="w-20 h-20 text-gold-500/20 mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold text-white mb-3">No Certifications Added Yet</h2>
            <p className="text-gray-400 mb-8">Add your certifications and registrations from the admin panel to display them here.</p>
            <Link to="/admin/certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 text-gold-500 rounded-xl hover:bg-gold-500/20 transition-all border border-gold-500/20">
              Manage Certifications
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Shield className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              {c('cta', 'title', 'Committed to Excellence')}
            </h2>
            <p className="text-gray-400 mb-8">{c('cta', 'description', 'Our certifications reflect our unwavering commitment to quality, safety, and environmental responsibility.')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all">
                {c('cta', 'button_1', 'Partner With Us')}
              </Link>
              <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-gold-500 text-gold-500 font-bold rounded-xl hover:bg-gold-500/10 transition-all">
                {c('cta', 'button_2', 'View Our Projects')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
