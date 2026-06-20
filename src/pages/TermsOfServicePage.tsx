import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Mail } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using the Eden Buildcore (Pvt.) Ltd. website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services. These terms apply to all visitors, clients, contractors, and users of our services.

Your continued use of our website and services after any modifications to these terms constitutes your acceptance of the updated terms. We reserve the right to modify these terms at any time without prior notice.`
  },
  {
    title: '2. Services Description',
    content: `Eden Buildcore (Pvt.) Ltd. provides construction, engineering, and related professional services including but not limited to:

• Building construction and civil engineering works
• Project management and consultancy services
• Architectural design and planning
• Structural engineering and design
• Renovation, rehabilitation, and restoration works
• Infrastructure development
• Quantity surveying and cost estimation
• Construction supervision and quality control

All services are subject to separate contractual agreements that will outline specific terms, deliverables, timelines, and payment schedules.`
  },
  {
    title: '3. Client Responsibilities',
    content: `Clients engaging our services agree to:

• Provide accurate and complete information required for project execution
• Ensure timely availability of necessary permits, approvals, and site access
• Make payments according to agreed schedules and terms
• Designate authorized representatives for project communications
• Comply with all applicable laws and regulations
• Ensure site conditions are safe and suitable for work execution
• Promptly review and respond to project communications and approvals
• Maintain appropriate insurance coverage as specified in contracts`
  },
  {
    title: '4. Quotations and Pricing',
    content: `All quotations and estimates provided by Eden Buildcore are:

• Valid for 30 days from the date of issuance unless otherwise stated
• Based on information provided by the client at the time of quotation
• Subject to change based on site conditions, material costs, or scope modifications
• Exclusive of applicable taxes unless explicitly stated
• Conditional upon final contract agreement and terms

Prices may be adjusted for changes in scope, specifications, or unforeseen site conditions. Any variations from the original scope will be communicated and require written approval before execution.`
  },
  {
    title: '5. Payment Terms',
    content: `Payment terms for our services are as follows:

• Initial deposits or advance payments as specified in individual contracts
• Progress payments based on completed milestones
• Final payment upon project completion and handover
• Payment methods: bank transfer, check, or other agreed methods
• Late payments may incur interest charges at prevailing rates
• Retention amounts as per contract terms (typically 5-10%)

All invoices are due within 30 days of issuance unless otherwise agreed. Eden Buildcore reserves the right to suspend work on projects with overdue payments.`
  },
  {
    title: '6. Intellectual Property',
    content: `All intellectual property rights related to our services are protected:

• Design documents, drawings, and specifications remain our property until full payment
• Clients receive license to use deliverables for intended project purposes
• Proprietary methodologies and processes remain our exclusive property
• Unauthorized reproduction or distribution of our work is prohibited
• Client-provided materials remain their property with license granted to us for project use

Upon full payment, clients receive ownership of project-specific deliverables as outlined in their contract. Eden Buildcore retains the right to showcase completed projects in our portfolio.`
  },
  {
    title: '7. Confidentiality',
    content: `Both parties agree to maintain confidentiality of:

• Project details, specifications, and technical information
• Commercial and financial information
• Business strategies and operational methods
• Client personal and corporate information
• Any information marked as confidential

This obligation survives the termination of services and continues for 5 years thereafter. Disclosure may be made as required by law or with prior written consent.`
  },
  {
    title: '8. Warranties and Guarantees',
    content: `Eden Buildcore provides the following warranties:

• Workmanship warranty as specified in individual contracts (typically 12 months)
• Materials warranty as per manufacturer specifications
• Structural warranty for load-bearing elements (up to 10 years as per contract)

Warranties are void if:
• Unauthorized modifications are made to our work
• Damage results from client negligence or misuse
• Normal wear and tear or expected maintenance items
• Third-party alterations without our approval

Warranty claims must be reported in writing within the warranty period.`
  },
  {
    title: '9. Limitation of Liability',
    content: `To the maximum extent permitted by law:

• Our total liability shall not exceed the contract value for the specific service
• We are not liable for indirect, incidental, or consequential damages
• We are not responsible for delays caused by factors beyond our control
• Client indemnifies us against claims arising from their negligence
• Force majeure events excuse performance delays

Nothing in these terms limits liability for death or personal injury caused by negligence, fraud, or other liability that cannot be legally excluded.`
  },
  {
    title: '10. Project Delays and Extensions',
    content: `Project timelines may be affected by:

• Weather conditions and natural events
• Client delays in providing approvals or access
• Unforeseen site conditions
• Changes in scope or specifications
• Delays in material availability
• Government regulatory requirements

Extensions will be granted for delays caused by the above factors. Written notification of delays must be provided within 7 days of occurrence. Eden Buildcore will make reasonable efforts to mitigate delays and notify clients promptly.`
  },
  {
    title: '11. Termination',
    content: `Either party may terminate services under the following conditions:

• By mutual written agreement
• Material breach not remedied within 30 days of notice
• Insolvency or bankruptcy of either party
• Force majeure events exceeding 90 days

Upon termination:
• Client must pay for all completed work and materials
• Eden Buildcore will deliver work-in-progress as agreed
• Confidentiality and other surviving obligations remain in effect
• Reasonable costs of demobilization will be compensated`
  },
  {
    title: '12. Dispute Resolution',
    content: `Disputes will be resolved through the following process:

1. **Negotiation:** Parties will attempt good-faith resolution within 30 days
2. **Mediation:** If unresolved, parties will engage a neutral mediator
3. **Arbitration:** Binding arbitration under Construction Industry Arbitration Rules
4. **Litigation:** As a last resort, courts of competent jurisdiction

Governing law: Laws of Pakistan
Jurisdiction: Courts in Lahore, Pakistan

Nothing prevents parties from seeking injunctive relief for urgent matters.`
  },
  {
    title: '13. Force Majeure',
    content: `Neither party shall be liable for delays or failures caused by:

• Natural disasters (earthquakes, floods, storms)
• War, terrorism, or civil unrest
• Government actions or regulatory changes
• Pandemics or public health emergencies
• Labor strikes affecting the industry
• Supply chain disruptions beyond control
• Other events beyond reasonable control

Affected party must notify the other within 7 days and take reasonable steps to mitigate effects. If force majeure continues for 90 days, either party may terminate affected obligations.`
  },
  {
    title: '14. Insurance Requirements',
    content: `Eden Buildcore maintains appropriate insurance coverage including:

• Professional indemnity insurance
• Public liability insurance
• Contractor's all-risk insurance
• Workmen's compensation insurance

Clients may be required to maintain:
• Property insurance for completed works
• Third-party liability insurance
• Specific project insurance as per contract terms

Insurance certificates will be provided upon request.`
  },
  {
    title: '15. Website Use Terms',
    content: `When using our website, you agree to:

• Provide accurate information when submitting inquiries
• Not submit false, misleading, or fraudulent information
• Not attempt to gain unauthorized access to our systems
• Not interfere with website functionality or security
• Not use automated tools without permission
• Not transmit malicious code or harmful content

We reserve the right to restrict access for users who violate these terms. Website content is provided for informational purposes and does not constitute professional advice.`
  },
  {
    title: '16. Changes to Terms',
    content: `Eden Buildcore may update these Terms of Service at any time. Changes will be communicated by:

• Posting updated terms on our website with revision date
• Email notification to registered clients (for significant changes)
• Notice on our website homepage

Continued use of our services after changes constitutes acceptance. We encourage regular review of these terms. Material changes to existing contracts require mutual agreement.`
  },
];

export default function TermsOfServicePage() {
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
              <FileText className="w-8 h-8 text-gold-500" />
            </div>
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4 border border-gold-500/30">
              Legal
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              These terms govern your use of Eden Buildcore (Pvt.) Ltd.'s services. Please read them carefully before engaging our services.
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
              Welcome to Eden Buildcore (Pvt.) Ltd. These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client," "you," or "your") and Eden Buildcore (Pvt.) Ltd. ("Company," "we," "us," or "our") governing your use of our construction services, engineering solutions, and website. By engaging our services or using our website, you confirm your acceptance of these Terms.
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
                transition={{ delay: index * 0.03 }}
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

          {/* Contact for Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-br from-navy-800/50 to-navy-900/50 border border-gold-500/15 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-heading font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-gray-400 mb-6">
              If you have any questions about these Terms of Service or need clarification on any provision, please contact our legal department or your project manager.
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
            <Link to="/privacy" className="text-gold-500 hover:text-gold-400 text-sm transition-colors">
              View Privacy Policy →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
