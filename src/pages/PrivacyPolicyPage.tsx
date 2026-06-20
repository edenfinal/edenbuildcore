import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Phone } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information that you provide directly to us when you contact us, request a quote, submit a job application, or otherwise communicate with us. This includes:

• **Personal Identification Information:** Full name, email address, phone number, company name, and mailing address.
• **Project Information:** Details about your construction or engineering project requirements.
• **Communication Data:** Messages, inquiries, and correspondence you send us.
• **Employment Data:** Resumes, cover letters, and professional qualifications submitted for job applications.
• **Technical Data:** IP address, browser type, device information, and usage data collected automatically when you visit our website.`
  },
  {
    title: '2. How We Use Your Information',
    content: `Eden Buildcore (Pvt.) Ltd. uses the information we collect for the following purposes:

• To respond to your inquiries, requests, and provide requested services.
• To process and manage project quotations and proposals.
• To communicate about ongoing projects, updates, and company news.
• To process job applications and contact candidates.
• To improve our website, services, and user experience.
• To comply with legal obligations and protect our legal rights.
• To send you marketing communications (only with your explicit consent).
• To prevent fraud and ensure security of our systems.`
  },
  {
    title: '3. Information Sharing and Disclosure',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:

• **Service Providers:** With trusted third-party vendors who assist us in operating our website and conducting our business, subject to confidentiality agreements.
• **Legal Requirements:** When required by law, court order, or governmental authority.
• **Business Transfers:** In connection with a merger, acquisition, or sale of company assets, with appropriate notice to you.
• **Protection of Rights:** To protect the rights, property, or safety of Eden Buildcore, our clients, or others.
• **With Your Consent:** In any other circumstances with your explicit consent.`
  },
  {
    title: '4. Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our security measures include:

• SSL/TLS encryption for all data transmitted through our website.
• Secure server infrastructure with access controls and monitoring.
• Regular security assessments and vulnerability testing.
• Employee training on data protection and privacy practices.
• Limited access to personal data on a need-to-know basis.

While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.`
  },
  {
    title: '5. Cookies and Tracking Technologies',
    content: `Our website uses cookies and similar tracking technologies to enhance your experience. Cookies are small text files stored on your device that help us:

• Remember your preferences and settings.
• Analyze website traffic and usage patterns.
• Improve website performance and functionality.
• Provide relevant content and features.

You can control cookie settings through your browser preferences. Disabling certain cookies may affect the functionality of our website. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device for a set period).`
  },
  {
    title: '6. Third-Party Links',
    content: `Our website may contain links to third-party websites, including social media platforms and partner organizations. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit. The inclusion of a link does not constitute an endorsement by Eden Buildcore.`
  },
  {
    title: '7. Your Rights and Choices',
    content: `You have the following rights regarding your personal information:

• **Access:** Request a copy of the personal information we hold about you.
• **Correction:** Request correction of inaccurate or incomplete information.
• **Deletion:** Request deletion of your personal information, subject to legal requirements.
• **Objection:** Object to the processing of your personal information for certain purposes.
• **Withdrawal of Consent:** Withdraw consent for marketing communications at any time.
• **Portability:** Request transfer of your data in a structured, machine-readable format.

To exercise any of these rights, please contact us using the information provided below.`
  },
  {
    title: '8. Data Retention',
    content: `We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including:

• Project and business records: 7 years after project completion (for legal and accounting purposes).
• Contact inquiries: 3 years after the last communication.
• Job applications: 1 year after the application decision.
• Marketing consents: Until you withdraw consent.
• Technical logs: 90 days for security and performance monitoring.`
  },
  {
    title: '9. Children\'s Privacy',
    content: `Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected information from a minor, we will take steps to delete such information promptly. If you believe we may have collected information about a child, please contact us immediately.`
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:

• Posting the updated policy on our website with a revised "Last Updated" date.
• Sending an email notification to registered users (for significant changes).
• Displaying a prominent notice on our website.

Your continued use of our website after the effective date of any changes constitutes your acceptance of the updated Privacy Policy.`
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold-500" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-6 mx-auto">
              <Shield className="w-8 h-8 text-gold-500" />
            </div>
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4 border border-gold-500/30">
              Legal
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Eden Buildcore (Pvt.) Ltd. collects, uses, and protects your personal information.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Last Updated: June 2026</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>Effective: June 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-navy-950">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy-800/30 border border-gold-500/10 rounded-2xl p-6 mb-10"
          >
            <p className="text-gray-300 leading-relaxed">
              Eden Buildcore (Pvt.) Ltd. ("Eden Buildcore," "we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard information when you visit our website, use our services, or interact with us. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-navy-800/20 border border-gold-500/8 rounded-2xl p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gold-500 text-xs font-bold">{index + 1}</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-white">{section.title}</h2>
                </div>
                <div className="pl-12">
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact for Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-br from-navy-800/50 to-navy-900/50 border border-gold-500/15 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-heading font-bold text-white mb-4">Contact Us About Privacy</h2>
            <p className="text-gray-400 mb-6">
              If you have any questions about this Privacy Policy, wish to exercise your rights, or have concerns about how we handle your personal information, please contact our Privacy Officer:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:edenbuildcore@gmail.com"
                className="flex items-center gap-3 px-5 py-3 bg-gold-500/10 border border-gold-500/20 rounded-xl text-gold-400 hover:bg-gold-500/20 transition-colors"
              >
                <Mail className="w-4 h-4" />
                edenbuildcore@gmail.com
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-3 px-5 py-3 bg-navy-700/50 border border-gold-500/10 rounded-xl text-white hover:border-gold-500/30 transition-colors"
              >
                Contact Form
              </Link>
            </div>
          </motion.div>

          <div className="mt-8 text-center">
            <Link to="/terms" className="text-gold-500 hover:text-gold-400 text-sm transition-colors">
              View Terms of Service →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
