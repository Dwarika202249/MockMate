import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

const faqs = [
  {
    question: "What is MockMate's AI Mock Interview platform?",
    answer:
      "MockMate is an AI-powered interview preparation tool designed to simulate real-world interviews across various job roles, giving you actionable feedback and performance analytics.",
  },
  {
    question: "How do AI mock interviews actually work?",
    answer:
      "Once you select a role, our system generates domain-specific questions, evaluates your responses using advanced AI models, and delivers feedback on communication, structure, and accuracy.",
  },
  {
    question: "Is there a free trial or credit system?",
    answer:
      "Yes! Every new user gets free AI credits to try out interviews. After that, you can purchase additional credits or subscribe to a plan that fits your needs.",
  },
  {
    question: "What exactly are AI credits?",
    answer:
      "AI credits are tokens you spend to initiate interviews or resume evaluations. Each credit corresponds to one interaction, like a full mock interview or an AI resume scan.",
  },
  {
    question: "Can I access MockMate on multiple devices?",
    answer:
      "Absolutely. Your account works seamlessly across desktop, tablet, and mobile. Just log in from anywhere, anytime.",
  },
  {
    question: "Do you support coding and system design interviews?",
    answer:
      "Yes! We support technical interviews including DSA, system design, and role-specific dev questions for frontend, backend, and full-stack roles.",
  },
  {
    question: "Is my data secure and confidential?",
    answer:
      "Security is our top priority. All your responses and documents are encrypted and never shared without your consent.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] px-6 py-24 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
      {/* Animated Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <FiHelpCircle className="text-white drop-shadow-lg" size={24} />
          </div>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 mb-4 drop-shadow-lg">
          Frequently <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Asked</span> Questions
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Everything you need to know about MockMate's AI interview platform
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="group relative bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] hover:border-purple-500/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <button
              onClick={() => toggleFAQ(index)}
              className="relative z-10 w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
            >
              <span className="text-base sm:text-lg font-semibold text-white pr-4">
                {faq.question}
              </span>
              <FiChevronDown
                className={`w-6 h-6 text-purple-400 flex-shrink-0 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)] transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative z-10 overflow-hidden"
                >
                  <div className="px-6 pb-5">
                    <div className="pt-2 border-t border-purple-500/20 mt-2">
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default FAQs;
