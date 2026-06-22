import { motion } from 'framer-motion';
import { Award, Shield, FileText, Building2, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { useCertifications, usePageContent } from '../hooks/useData';
import type { Certification } from '../lib/supabase';

export default function CertificationsPage() {
  const { data: certifications } = useCertifications();
  const pageContent = usePageContent('certifications');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  const displayCerts = certifications;

  const isoCerts = displayCerts.filter(cert => cert.category === 'Quality' || cert.category === 'Environmental' || cert.category === 'Safety');
  const registrations = displayCerts.filter(cert => cert.category === 'Registration');
  const otherCerts = displayCerts.filter(cert => !['Quality', 'Environmental', 'Safety', 'Registration'].includes(cert.category || ''));

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4 border border-gold-500/30">
              {c('certifications.hero', 'badge', 'Quality Assured')}
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              {c('certifications.hero', 'title', 'Certifications & Registrations')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {c('certifications.hero', 'description', 'Our commitment to quality, safety, and excellence is validated by internationally recognized certifications.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ISO Certifications */}
      <section className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gold-500" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-white">{c('certifications.iso', 'title', 'ISO Certifications')}</h2>
            <p className="text-gray-400 mt-2">{c('certifications.iso', 'subtitle', 'International standards compliance')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(isoCerts.length > 0 ? isoCerts : defaultCertifications.filter(c => c.category === 'Quality' || c.category === 'Environmental' || c.category === 'Safety')).map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-8 hover:border-gold-500/30 transition-all group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-gold-500" />
                  </div>

                  <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-xs font-medium mb-4">
                    {cert.category}
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                    {cert.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4">{cert.description}</p>

                  <div className="space-y-2 text-sm">
                    {cert.issuing_authority && (
                      <p className="text-gray-500">
                        <span className="text-gray-400">{c('certifications.detail', 'issuing_authority_label', 'Issuing Authority')}:</span> {cert.issuing_authority}
                      </p>
                    )}
                    {cert.certificate_number && (
                      <p className="text-gray-500">
                        <span className="text-gray-400">{c('certifications.detail', 'certificate_no_label', 'Certificate No')}:</span> {cert.certificate_number}
                      </p>
                    )}
                    {cert.issue_date && (
                      <p className="text-gray-500">
                        <span className="text-gray-400">{c('certifications.detail', 'issue_date_label', 'Issue Date')}:</span> {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {cert.document_url && (
                    <a
                      href={cert.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 mt-4 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      {c('certifications.detail', 'download_text', 'Download Certificate')}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registrations */}
      <section className="py-16 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gold-500" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-white">{c('certifications.registrations', 'title', 'Company Registrations')}</h2>
            <p className="text-gray-400 mt-2">{c('certifications.registrations', 'subtitle', 'Legal compliance and registrations')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(registrations.length > 0 ? registrations : defaultCertifications.filter(c => c.category === 'Registration')).map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 bg-navy-800/30 border border-gold-500/10 rounded-xl p-6 hover:border-gold-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{cert.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{cert.description}</p>
                  {cert.certificate_number && (
                    <p className="text-gold-500 text-sm">{c('certifications.detail', 'reg_no_label', 'Reg. No')}: {cert.certificate_number}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Certifications */}
      {otherCerts.length > 0 && (
        <section className="py-16 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gold-500" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-white">Additional Certifications</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherCerts.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-navy-800/50 border border-gold-500/10 rounded-xl p-6 text-center hover:border-gold-500/30 transition-all"
                >
                  <Award className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">{cert.title}</h3>
                  <p className="text-gray-400 text-sm">{cert.issuing_authority}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              {c('certifications.cta', 'title', 'Committed to Excellence')}
            </h2>
            <p className="text-gray-400 mb-8">
              {c('certifications.cta', 'description', 'Our certifications reflect our unwavering commitment to quality, safety, and environmental responsibility. Every project we undertake adheres to these international standards.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all"
              >
                {c('certifications.cta', 'button_1', 'Partner With Us')}
              </a>
              <a
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-gold-500 text-gold-500 font-bold rounded-xl hover:bg-gold-500/10 transition-all"
              >
                {c('certifications.cta', 'button_2', 'View Our Projects')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
