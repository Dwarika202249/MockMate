import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="relative w-full py-20 px-6 bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] text-center overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[250px] h-[250px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Animated Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl font-semibold mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-white drop-shadow-lg">Crack Your </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-lg">Next Interview</span>
          <span className="text-white drop-shadow-lg"> with Confidence</span>
        </motion.h2>

        {/* Animated Paragraph */}
        <motion.p
          className="text-gray-300 text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Join thousands of job seekers & techies who used MockMate’s AI mock interviews to land their dream roles.
        </motion.p>

        {/* Animated Buttons */}
        <motion.div
          className="flex justify-center items-center gap-4 mb-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] font-semibold px-6 py-3 rounded-xl transition-all duration-200 border border-purple-500/30 backdrop-blur-md"
          >
            Start Free Trial <AiOutlineArrowRight size={18} />
          </Link>
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 border border-yellow-500/30 backdrop-blur-md"
          >
            Schedule Demo
          </Link>
        </motion.div>

        {/* Animated Subtext */}
        <motion.p
          className="text-sm text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          No card required • 30-day free trial • Cancel anytime
        </motion.p>
      </div>
    </section>
  );
};

export default CallToAction;
