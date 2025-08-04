import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

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
    <section className="max-w-4xl mx-auto px-6 py-24">
      {/* Animated Heading */}
      <motion.h2
        className="text-5xl font-bold text-center text-[#0e031a] mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Frequently <span className="text-purple-500">Asked</span> Questions
      </motion.h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
            >
              <span className="text-lg font-medium text-[#21093b]">
                {faq.question}
              </span>
              <FiChevronDown
                className={`w-6 h-6 text-indigo-600 transform transition-transform duration-300 ${
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
                  className="px-6 pb-5 text-gray-600 text-base"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
