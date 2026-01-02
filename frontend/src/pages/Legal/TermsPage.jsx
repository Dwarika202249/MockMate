import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";

const TermsPage = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using MockMate ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of any changes.`
    },
    {
      title: "2. Description of Service",
      content: `MockMate is an AI-powered interview preparation platform that provides:
      
• AI-generated interview questions based on your resume and target role
• Voice-based mock interview sessions with real-time feedback
• Performance analytics and improvement recommendations
• Resume parsing and analysis capabilities
• Progress tracking across multiple interview sessions

The Service is designed to help professionals prepare for job interviews through realistic practice scenarios.`
    },
    {
      title: "3. User Accounts",
      content: `To access certain features, you must create an account. You agree to:

• Provide accurate, current, and complete information during registration
• Maintain the security of your password and account
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use
• Not share your account credentials with others

We reserve the right to suspend or terminate accounts that violate these terms.`
    },
    {
      title: "4. Credits and Payments",
      content: `MockMate operates on a credit-based system:

• New users receive 100 free credits upon first registration
• Credits are consumed when using AI-powered features (approximately 20 credits per full interview)
• Purchased credits are non-refundable except as required by law
• Credits have no cash value and cannot be transferred
• Unused credits do not expire
• We reserve the right to modify credit pricing with 30 days notice`
    },
    {
      title: "5. Acceptable Use",
      content: `You agree NOT to:

• Use the Service for any illegal purpose
• Upload malicious content or attempt to compromise our systems
• Impersonate others or provide false information
• Share, resell, or redistribute your account access
• Use automated systems to access the Service without permission
• Attempt to reverse engineer our AI algorithms
• Use the Service to harass, abuse, or harm others
• Upload content that infringes intellectual property rights`
    },
    {
      title: "6. Intellectual Property",
      content: `All content, features, and functionality of MockMate are owned by us and protected by international copyright, trademark, and other intellectual property laws. This includes:

• Our AI models and algorithms
• User interface design and graphics
• Question databases and evaluation criteria
• Brand names, logos, and trademarks

You retain ownership of content you upload (resumes, responses), but grant us a license to process this data to provide the Service.`
    },
    {
      title: "7. Privacy and Data",
      content: `Your privacy is important to us. By using MockMate, you acknowledge that:

• We collect and process data as described in our Privacy Policy
• Interview recordings and transcripts are stored securely
• We use your data to improve our AI models (anonymized)
• You can request data deletion at any time
• We implement industry-standard security measures

Please review our Privacy Policy for complete details on data handling.`
    },
    {
      title: "8. AI-Generated Content",
      content: `MockMate uses artificial intelligence to generate questions and feedback. You acknowledge that:

• AI responses may not always be accurate or appropriate
• Generated content should be used as guidance, not definitive advice
• We do not guarantee employment outcomes
• AI feedback is supplementary to professional career guidance
• The Service is for practice purposes only`
    },
    {
      title: "9. Disclaimers",
      content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:

• Merchantability and fitness for a particular purpose
• Accuracy or reliability of AI-generated content
• Uninterrupted or error-free operation
• Compatibility with all devices or browsers

We do not guarantee that using MockMate will result in job offers or improved interview performance.`
    },
    {
      title: "10. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, MOCKMATE SHALL NOT BE LIABLE FOR:

• Indirect, incidental, special, or consequential damages
• Loss of profits, data, or business opportunities
• Damages arising from use or inability to use the Service
• Third-party actions or content

Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.`
    },
    {
      title: "11. Indemnification",
      content: `You agree to indemnify and hold harmless MockMate, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:

• Your use of the Service
• Your violation of these Terms
• Your violation of any third-party rights
• Content you upload or submit`
    },
    {
      title: "12. Termination",
      content: `We may suspend or terminate your access to the Service at any time for:

• Violation of these Terms of Service
• Fraudulent or illegal activity
• Extended periods of inactivity
• Non-payment of applicable fees

Upon termination, your right to use the Service ceases immediately. Provisions that should survive termination will remain in effect.`
    },
    {
      title: "13. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Delaware, and you consent to personal jurisdiction in such courts.`
    },
    {
      title: "14. Contact Information",
      content: `For questions about these Terms of Service, please contact us:

Email: legal@mockmate.ai
Support: support@mockmate.ai

MockMate Inc.
123 Innovation Drive
San Francisco, CA 94105
United States`
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
          <h2 className="text-3xl font-bold text-white mb-4">Terms of Service</h2>
          <p className="text-gray-400">Last updated: January 1, 2026</p>
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
              Welcome to MockMate. These Terms of Service ("Terms") govern your use of our AI-powered interview preparation platform. Please read these terms carefully before using our services.
            </p>

            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-purple-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Questions? Contact us at{" "}
                <a href="mailto:legal@mockmate.ai" className="text-purple-400 hover:underline">
                  legal@mockmate.ai
                </a>
              </p>
              <div className="flex gap-6">
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
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

export default TermsPage;
