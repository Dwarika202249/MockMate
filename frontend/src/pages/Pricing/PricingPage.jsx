import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaRocket,
  FaBolt,
  FaInfinity,
  FaChartLine,
  FaHeadset,
  FaCrown,
  FaShieldAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Navbar from "../../components/common/Navbar";
import Pricing from "../../components/home/Pricing";

const PricingPage = () => {
  const features = [
    {
      icon: <FaBolt className="text-3xl" />,
      title: "AI-Powered Feedback",
      description: "Get instant, detailed feedback powered by advanced AI models"
    },
    {
      icon: <FaInfinity className="text-3xl" />,
      title: "Unlimited Practice",
      description: "Practice as much as you need with our credit-based system"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Progress Analytics",
      description: "Track your improvement with detailed performance metrics"
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our support team"
    }
  ];

  const faqs = [
    {
      question: "How do AI credits work?",
      answer: "Each action that uses AI (question generation, answer evaluation) consumes credits. A typical full interview uses 15-20 credits. You get 100 free credits when you sign up!"
    },
    {
      question: "What happens when I run out of credits?",
      answer: "You can purchase more credits anytime. We offer flexible packages to suit your needs. You'll receive notifications when your balance is low."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 14-day money-back guarantee for all credit purchases if you're not satisfied with our service."
    },
    {
      question: "Do credits expire?",
      answer: "No! Your credits never expire. Use them at your own pace whenever you're ready to practice."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Every new user gets 100 free AI credits to start practicing immediately. No credit card required."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] text-white overflow-hidden relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/25 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-pink-600/20 rounded-full blur-[90px]"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-32 pb-20 px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-purple-500/50">
              <HiSparkles className="text-5xl text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-2xl"
          >
            Simple, Transparent Pricing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto mb-8 drop-shadow-lg"
          >
            Pay only for what you use with our flexible credit-based system. 
            Start with <span className="text-purple-300 font-bold">100 free credits</span> — no credit card required!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
            >
              <FaRocket /> Get Started Free
            </Link>
            <Link
              to="/dashboard"
              className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-purple-500/50"
            >
              View Dashboard
            </Link>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-lg"
            >
              Why Choose <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">MockMate?</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 group"
                >
                  <div className="text-purple-300 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Original Pricing Component */}
        <Pricing />

        {/* FAQs */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-lg"
            >
              Frequently Asked <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">Questions</span>
            </motion.h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                    <FaShieldAlt className="text-purple-300" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-300 leading-relaxed pl-8">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-md rounded-3xl p-12 border border-purple-500/30 text-center"
          >
            <FaCrown className="text-6xl text-purple-300 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Ace Your Interviews?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join thousands of job seekers who've landed their dream roles with MockMate
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 px-10 py-5 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
            >
              <FaRocket /> Start Free with 100 Credits
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
