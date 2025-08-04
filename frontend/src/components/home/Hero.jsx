import { Link } from "react-router-dom";
import {
  FaMicrophone,
  FaCheckCircle,
  FaStar,
  FaBriefcase,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Hero = () => {
  return (
    <section className="relative bg-[#0e031a] text-center py-32 px-4 sm:px-8 lg:px-32 overflow-hidden z-10">
      {/* Background Gradient Blur */}
      <motion.div
        variants={pulse}
        animate="animate"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 opacity-20 blur-[120px] rounded-full pointer-events-none z-0"
      />

      {/* Floating Cards - Desktop */}
      <>
        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
          left-1 top-24 lg:left-64 lg:top-32 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaCheckCircle className="text-green-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Interview Passed</p>
            <p className="text-gray-500 text-xs">95% Success Rate</p>
          </div>
        </motion.div>

        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
          left-1 bottom-12 lg:left-80 lg:bottom-28 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaStar className="text-purple-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Top Rated</p>
            <p className="text-gray-500 text-xs">4.9/5 Rating</p>
          </div>
        </motion.div>

        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
          right-1 top-24 lg:right-80 lg:top-28 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaMicrophone className="text-blue-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Live Interview</p>
            <p className="text-gray-500 text-xs">Real-time AI Chat</p>
          </div>
        </motion.div>

        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
          right-1 bottom-12 lg:right-80 lg:bottom-32 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaBriefcase className="text-orange-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Personalized Prep</p>
            <p className="text-gray-500 text-xs">Custom Sessions</p>
          </div>
        </motion.div>
      </>

      {/* Hero Content with Stagger Animation */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.h5
          variants={fadeInUp}
          className="uppercase tracking-wide text-xs font-bold bg-indigo-900 text-white px-12 py-2 sm:mb-8 rounded-full inline-block overflow-hidden"
        >
          <span className="relative z-10">MockMate: Your interview mate</span>
        </motion.h5>

        <motion.h1
          variants={fadeInUp}
          className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
        >
          Don’t Just Prepare, <br />
          <span className="text-white font-extrabold">
            Dominate Your Interviews
          </span>
          <br />
          <span className="text-purple-600">With AI</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-2xl mx-auto text-base text-gray-500"
        >
          Practice with AI-powered mock interviews, Level up your interview
          game, and land your dream job with real-time voice-to-voice
          conversations.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center justify-center bg-[#ddc510] hover:bg-[#f5b507] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
          >
            Start Free Interview →
          </Link>
        </motion.div>
      </motion.div>

      {/* Mobile Cards Grid */}
      <div className="lg:hidden mt-10 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaCheckCircle className="text-green-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Interview Passed</p>
            <p className="text-gray-500 text-xs">95% Success Rate</p>
          </div>
        </div>

        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaStar className="text-purple-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Top Rated</p>
            <p className="text-gray-500 text-xs">4.9/5 Rating</p>
          </div>
        </div>

        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaMicrophone className="text-blue-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Live Interview</p>
            <p className="text-gray-500 text-xs">Real-time AI Chat</p>
          </div>
        </div>

        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaBriefcase className="text-orange-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Personalized Prep</p>
            <p className="text-gray-500 text-xs">Custom Sessions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
