import { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion } from "framer-motion";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
  const { name, email, feedback } = formData;
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", feedback: "" });
  };

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 bg-gradient-to-br from-[#0d0219] via-[#12071f] to-[#0a0118] overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[250px] h-[250px] bg-pink-600/15 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Animated Header */}
      <div className="max-w-2xl mx-auto text-center mb-10 relative z-10">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-white drop-shadow-lg">We Value </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-lg">Your Feedback</span>
        </motion.h2>

        <motion.p
          className="text-gray-300 mt-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Help us improve MockMate — your insights power our platform.
        </motion.p>
      </div>

      {/* Animated Form / Success Card */}
      <motion.div
        className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-purple-500/30 p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-purple-500/50 transition-all duration-300 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {submitted ? (
          <motion.div
            className="text-center text-green-600 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AiOutlineCheckCircle size={40} className="mb-2" />
            <p className="text-lg font-medium">Thank you for your feedback!</p>
            <p className="text-sm text-gray-500 mt-1">We truly appreciate your input.</p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={onSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              viewport={{ once: true }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <label htmlFor="feedback" className="block text-sm font-semibold text-gray-300 mb-1">
                Feedback
              </label>
              <textarea
                name="feedback"
                value={feedback}
                onChange={onChange}
                required
                placeholder="Your thoughts, ideas, or issues..."
                rows="4"
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition duration-200 border border-purple-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Feedback
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </section>
  );
};

export default FeedbackForm;
