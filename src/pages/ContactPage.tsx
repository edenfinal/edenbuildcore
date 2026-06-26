import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useSiteSettings, submitContactForm, usePageContent } from '../hooks/useData';
import PageHero from '../components/PageHero';

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const pageContent = usePageContent('contact');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    inquiry_type: 'general'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const success = await submitContactForm(formData);
    setStatus(success ? 'success' : 'error');

    if (success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        inquiry_type: 'general'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      {/* Hero Section */}
      <PageHero
        pageId="contact"
      />

      {/* Contact Section */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-white">{c('form', 'title', 'Send Message')}</h2>
                    <p className="text-gray-400 text-sm">{c('form', 'subtitle', 'We\'ll get back to you within 24 hours')}</p>
                  </div>
                </div>

                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{c('form', 'success_title', 'Message Sent!')}</h3>
                    <p className="text-gray-400 mb-6">{c('form', 'success_message', 'We\'ll get back to you soon.')}</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="text-gold-500 hover:text-gold-400 font-medium"
                    >
                      {c('form', 'send_another', 'Send Another Message')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{c('form', 'label_name', 'Full Name')} *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{c('form', 'label_email', 'Email')} *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{c('form', 'label_phone', 'Phone')}</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{c('form', 'label_company', 'Company')}</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{c('form', 'label_inquiry_type', 'Inquiry Type')}</label>
                      <select
                        name="inquiry_type"
                        value={formData.inquiry_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                      >
                        <option value="general">{c('form', 'inquiry_general', 'General Inquiry')}</option>
                        <option value="project">{c('form', 'inquiry_project', 'Project Inquiry')}</option>
                        <option value="partnership">{c('form', 'inquiry_partnership', 'Partnership')}</option>
                        <option value="career">{c('form', 'inquiry_career', 'Career Inquiry')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{c('form', 'label_subject', 'Subject')}</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{c('form', 'label_message', 'Message')} *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-navy-700/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {c('form', 'error_message', 'Failed to send message. Please try again.')}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>{c('form', 'sending_text', 'Sending...')}</>
                      ) : (
                        <>
                          {c('form', 'button_text', 'Send Message')}
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">{c('info', 'title', 'Quick Contact')}</h2>
                <div className="space-y-6">
                  {settings?.address && (
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-gold-500 font-medium mb-1">{c('info', 'label_address', 'Address')}</p>
                        <p className="text-gray-400">{settings.address}</p>
                      </div>
                    </div>
                  )}
                  {settings?.phone && (
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-gold-500 font-medium mb-1">{c('info', 'label_phone', 'Phone')}</p>
                        <a href={`tel:${settings.phone}`} className="text-gray-400 hover:text-white transition-colors">
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {settings?.email && (
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-gold-500 font-medium mb-1">{c('info', 'label_email', 'Email')}</p>
                        <a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-white transition-colors">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {settings?.business_hours && (
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-gold-500 font-medium mb-1">{c('info', 'label_hours', 'Business Hours')}</p>
                        <p className="text-gray-400">
                          Mon-Fri: {(settings.business_hours as { weekday: string }).weekday}<br />
                          Sat: {(settings.business_hours as { saturday: string }).saturday}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-green-600/10 border border-green-500/20 rounded-2xl hover:bg-green-600/20 transition-colors group"
                >
                  <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.411z"/>
                  </svg>
                  <div>
                    <p className="text-white font-semibold group-hover:text-green-400 transition-colors">{c('info', 'whatsapp_text', 'Chat on WhatsApp')}</p>
                    <p className="text-gray-400 text-sm">{c('info', 'whatsapp_subtext', 'Quick response guaranteed')}</p>
                  </div>
                </a>
              )}

              {/* Map */}
              <div className="aspect-video rounded-2xl overflow-hidden border border-gold-500/10">
                <iframe
                  src={settings?.google_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.56!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919043e89d4e3e5%3A0x5c1e4d4e4e4e4e4e!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
