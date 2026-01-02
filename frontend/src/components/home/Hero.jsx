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
    <section className="relative bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] text-center py-32 px-4 sm:px-8 lg:px-32 overflow-hidden z-10">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Floating Cards - Desktop */}
      <>
        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 items-start space-x-3 
          left-1 top-24 lg:left-64 lg:top-32 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30"
        >
          <FaCheckCircle className="text-green-400 text-2xl drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Interview Passed</p>
            <p className="text-gray-400 text-xs">95% Success Rate</p>
          </div>
        </motion.div>

        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 items-start space-x-3 
          left-1 bottom-12 lg:left-80 lg:bottom-28 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30"
        >
          <FaStar className="text-purple-400 text-2xl drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Top Rated</p>
            <p className="text-gray-400 text-xs">4.9/5 Rating</p>
          </div>
        </motion.div>

        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 items-start space-x-3 
          right-1 top-24 lg:right-80 lg:top-28 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30"
        >
          <FaMicrophone className="text-blue-400 text-2xl drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Live Interview</p>
            <p className="text-gray-400 text-xs">Real-time AI Chat</p>
          </div>
        </motion.div>

        <motion.div
          variants={float}
          animate="animate"
          className="hidden lg:flex absolute z-10 bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 items-start space-x-3 
          right-1 bottom-12 lg:right-80 lg:bottom-32 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30"
        >
          <FaBriefcase className="text-orange-400 text-2xl drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Personalized Prep</p>
            <p className="text-gray-400 text-xs">Custom Sessions</p>
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
          className="uppercase tracking-wide text-xs font-bold bg-purple-600/30 backdrop-blur-md text-purple-200 px-12 py-2 sm:mb-8 rounded-full inline-block overflow-hidden border border-purple-500/40"
        >
          <span className="relative z-10">MockMate: Your interview mate</span>
        </motion.h5>

        <motion.h1
          variants={fadeInUp}
          className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-lg">
            Don't Just Prepare,
          </span>
          <br />
          <span className="text-white font-extrabold drop-shadow-lg">
            Dominate Your Interviews
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-lg">With AI</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-2xl mx-auto text-base text-gray-300"
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
            className="mt-8 inline-flex items-center justify-center bg-gradient-to-r from-yellow-600 to-amber-600 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 border border-yellow-500/30 backdrop-blur-md"
          >
            Start Free Interview →
          </Link>
        </motion.div>
      </motion.div>

      {/* Mobile Cards Grid */}
      <div className="lg:hidden mt-10 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 flex items-start space-x-3 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30">
          <FaCheckCircle className="text-green-400 text-xl drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Interview Passed</p>
            <p className="text-gray-400 text-xs">95% Success Rate</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 flex items-start space-x-3 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30">
          <FaStar className="text-purple-400 text-xl drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Top Rated</p>
            <p className="text-gray-400 text-xs">4.9/5 Rating</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 flex items-start space-x-3 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30">
          <FaMicrophone className="text-blue-400 text-xl drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Live Interview</p>
            <p className="text-gray-400 text-xs">Real-time AI Chat</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl text-white rounded-2xl px-4 py-3 flex items-start space-x-3 shadow-[0_8px_32px_rgba(168,85,247,0.4)] border border-purple-500/30">
          <FaBriefcase className="text-orange-400 text-xl drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]" />
          <div className="text-left text-sm">
            <p className="font-semibold">Personalized Prep</p>
            <p className="text-gray-400 text-xs">Custom Sessions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
