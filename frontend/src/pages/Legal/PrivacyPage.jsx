import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiShieldCheck, HiLockClosed, HiEye, HiTrash } from "react-icons/hi";

const PrivacyPage = () => {
  const highlights = [
    { icon: HiShieldCheck, title: "Data Protection", desc: "Enterprise-grade encryption" },
    { icon: HiLockClosed, title: "Secure Storage", desc: "SOC 2 compliant infrastructure" },
    { icon: HiEye, title: "Transparency", desc: "Clear data usage policies" },
    { icon: HiTrash, title: "Your Control", desc: "Delete your data anytime" },
  ];

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information to provide and improve our services:

**Account Information:**
• Name and email address
• Password (encrypted)
• Profile picture (optional)
• Authentication tokens

**Resume Data:**
• Uploaded resume files (PDF, DOC, DOCX)
• Parsed resume content (skills, experience, education)
• Job role preferences

**Interview Data:**
• Audio recordings of practice sessions
• Transcribed responses
• AI-generated feedback and scores
• Session timestamps and duration

**Usage Data:**
• Pages visited and features used
• Device type, browser, and operating system
• IP address and general location
• Performance metrics and error logs

**Payment Information:**
• Transaction IDs (processed by Stripe)
• Credit purchase history
• We do NOT store credit card numbers`
    },
    {
      title: "2. How We Use Your Information",
      content: `Your data is used exclusively to provide and improve our services:

**Service Delivery:**
• Generate personalized interview questions
• Provide AI-powered feedback on your responses
• Track your progress across sessions
• Enable account authentication

**Service Improvement:**
• Train and improve our AI models (using anonymized data)
• Analyze usage patterns to enhance features
• Debug technical issues
• Conduct research on interview preparation effectiveness

**Communication:**
• Send important service updates
• Respond to support requests
• Share tips and best practices (optional)
• Notify about account activity

We will NEVER sell your personal data to third parties.`
    },
    {
      title: "3. AI and Machine Learning",
      content: `MockMate uses artificial intelligence extensively:

**How AI Processes Your Data:**
• Resume parsing uses NLP to extract key information
• Question generation is based on your role and experience
• Speech-to-text converts your audio responses
• Evaluation algorithms assess answer quality

**AI Training:**
• We may use anonymized, aggregated data to improve models
• Personal identifiers are stripped before training
• You can opt out of contributing to model training

**Third-Party AI Services:**
• We use Groq API for certain AI operations
• Data sent to AI providers follows their privacy policies
• We minimize data shared with external services`
    },
    {
      title: "4. Data Storage and Security",
      content: `We implement robust security measures:

**Encryption:**
• All data encrypted in transit (TLS 1.3)
• Sensitive data encrypted at rest (AES-256)
• Passwords hashed using bcrypt

**Infrastructure:**
• Hosted on secure cloud platforms (AWS/Render)
• Regular security audits and penetration testing
• SOC 2 Type II compliance in progress
• Geographic data redundancy

**Access Control:**
• Role-based access for employees
• Multi-factor authentication for admin access
• Regular access reviews and revocations
• Audit logging for data access

**Retention:**
• Account data: Retained until you delete your account
• Interview recordings: 90 days unless you request longer
• Analytics data: 2 years (anonymized)
• Deleted data: Purged within 30 days`
    },
    {
      title: "5. Data Sharing",
      content: `We share data only in limited circumstances:

**Service Providers:**
• Cloud hosting (AWS, Render)
• AI processing (Groq)
• Payment processing (Stripe)
• Email services (SendGrid)
• Analytics (anonymized only)

**Legal Requirements:**
• Court orders or subpoenas
• Legal process compliance
• Protection of rights and safety

**Business Transfers:**
• In case of merger or acquisition
• With your consent for specific purposes

**We Never:**
• Sell personal data to advertisers
• Share identifiable data for marketing
• Provide data to data brokers`
    },
    {
      title: "6. Your Rights and Choices",
      content: `You have control over your data:

**Access:**
• View all data we have about you
• Download your interview history
• Export your resume and feedback

**Correction:**
• Update your account information
• Correct inaccurate data

**Deletion:**
• Delete individual interview sessions
• Request complete account deletion
• Data removed within 30 days

**Portability:**
• Export data in standard formats
• Transfer data to other services

**Opt-Out:**
• Unsubscribe from marketing emails
• Disable analytics tracking
• Opt out of AI training contribution

To exercise these rights, contact privacy@mockmate.ai or use account settings.`
    },
    {
      title: "7. Cookies and Tracking",
      content: `We use cookies for essential functionality:

**Essential Cookies:**
• Authentication tokens
• Session management
• Security features

**Functional Cookies:**
• User preferences
• Language settings
• Theme preferences

**Analytics Cookies (Optional):**
• Usage patterns
• Feature popularity
• Performance metrics

**Third-Party Cookies:**
• Google OAuth
• Payment processing

You can manage cookies through your browser settings. Disabling essential cookies may affect functionality.`
    },
    {
      title: "8. Children's Privacy",
      content: `MockMate is not intended for users under 16:

• We do not knowingly collect data from children
• Users must be at least 16 years old
• If we discover underage users, we delete their data
• Parents can contact us about children's data

If you believe a child has provided us data, please contact privacy@mockmate.ai immediately.`
    },
    {
      title: "9. International Data Transfers",
      content: `Our services operate globally:

**Data Location:**
• Primary servers in the United States
• Some processing in EU data centers
• CDN presence worldwide

**Transfer Mechanisms:**
• Standard Contractual Clauses (EU)
• Privacy Shield principles (where applicable)
• Adequate safeguards for all transfers

**GDPR Compliance:**
• EU users have enhanced rights
• Data Processing Agreements with vendors
• Right to lodge complaints with supervisory authorities`
    },
    {
      title: "10. Changes to This Policy",
      content: `We may update this Privacy Policy:

• Material changes announced via email
• 30-day notice for significant changes
• Continued use constitutes acceptance
• Previous versions available upon request

Last material update: January 1, 2026`
    },
    {
      title: "11. Contact Us",
      content: `For privacy-related inquiries:

**Privacy Team:**
Email: privacy@mockmate.ai

**Data Protection Officer:**
Email: dpo@mockmate.ai

**General Support:**
Email: support@mockmate.ai

**Mailing Address:**
MockMate Inc.
Privacy Department
123 Innovation Drive
San Francisco, CA 94105
United States

Response time: Within 48 hours for privacy requests`
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-8"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link to="/">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-lg mb-4">
              MockMate
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">Privacy Policy</h2>
          <p className="text-gray-400">Last updated: January 1, 2026</p>
        </motion.div>

        {/* Privacy Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {highlights.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl text-center hover:border-purple-500/40 transition-all"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-white font-medium text-sm">{item.title}</h3>
              <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_rgba(168,85,247,0.3)]"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              At MockMate, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered interview preparation platform.
            </p>

            {/* Quick Summary */}
            <div className="mb-10 p-6 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-500/30 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-4">📋 Quick Summary</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• We collect only what's necessary to provide our service</li>
                <li>• Your data is encrypted and stored securely</li>
                <li>• We never sell your personal information</li>
                <li>• You can delete your data at any time</li>
                <li>• AI processing uses anonymized data when possible</li>
              </ul>
            </div>

            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {section.content.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-purple-300">{part}</strong> : part
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-purple-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Privacy questions?{" "}
                <a href="mailto:privacy@mockmate.ai" className="text-purple-400 hover:underline">
                  privacy@mockmate.ai
                </a>
              </p>
              <div className="flex gap-6">
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
};

export default PrivacyPage;
