import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#0e031a] text-center">
      <div className="max-w-2xl mx-auto">
        {/* Animated Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl font-semibold text-[#ffffff] mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Crack Your <span className="text-purple-500">Next Interview</span> with Confidence
        </motion.h2>

        {/* Animated Paragraph */}
        <motion.p
          className="text-[#c0c8f8] text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Join thousands of job seekers & techies who used MockMate’s AI mock interviews to land their dream roles.
        </motion.p>

        {/* Animated Buttons */}
        <motion.div
          className="flex justify-center items-center gap-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center text-white bg-[#5E3BEE] hover:bg-[#4526cb] font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
          >
            Start Free Trial <AiOutlineArrowRight size={18} />
          </Link>
          <Link
            to="/dashboard"
            className="bg-[#ddc510] hover:bg-[#f5b507] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
          >
            Schedule Demo
          </Link>
        </motion.div>

        {/* Animated Subtext */}
        <motion.p
          className="text-sm text-[#faffb5]"
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
