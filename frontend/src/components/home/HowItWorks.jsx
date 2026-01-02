import { FaUpload, FaMicrophone, FaComments, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const steps = [
  {
    icon: <FaUpload className="text-purple-400 text-3xl mb-4 mx-auto" />,
    step: "Step 1",
    color: "text-purple-400",
    title: "Upload Job Desc / Resume",
    description: "Provide JD or upload your resume to tailor your mock interview experience.",
  },
  {
    icon: <FaMicrophone className="text-blue-400 text-3xl mb-4 mx-auto" />,
    step: "Step 2",
    color: "text-blue-400",
    title: "Start Mock Interview",
    description: "Engage in real-time voice interviews powered by our AI engine.",
  },
  {
    icon: <FaComments className="text-pink-400 text-3xl mb-4 mx-auto" />,
    step: "Step 3",
    color: "text-pink-400",
    title: "Receive Feedback",
    description: "Get AI-generated feedback and improvement insights instantly.",
  },
  {
    icon: <FaRocket className="text-yellow-400 text-3xl mb-4 mx-auto" />,
    step: "Step 4",
    color: "text-yellow-400",
    title: "Nail the Real Thing",
    description: "Go into your next interview confident, polished, and prepared.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] text-center py-24 px-4 sm:px-8 lg:px-32 z-10 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Section Title */}
      <motion.h5
        className="relative uppercase tracking-wide text-xs font-bold bg-purple-600/30 backdrop-blur-md text-purple-200 px-12 py-2 sm:mb-4 rounded-full inline-block overflow-hidden z-10 border border-purple-500/40"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="relative z-10">How Mockmate works</span>
      </motion.h5>

      <motion.h2
        className="text-4xl md:text-5xl font-extrabold mt-6 mb-4 relative z-10"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-lg">
          How Our 
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-lg"> AI Platform</span>
        <span className="text-white drop-shadow-lg"> Works</span>
      </motion.h2>

      <motion.p
        className="text-gray-300 max-w-2xl mx-auto text-base relative z-10"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Experience seamless, AI-driven mock interviews that guide you from job
        description to real interview success — in just 4 easy steps.
      </motion.p>

      {/* Steps Grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white z-10 relative">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="mb-4">{step.icon}</div>
              <h4 className={`text-sm font-bold mb-2 ${step.color} drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]`}>{step.step}</h4>
              <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
              <p className="text-gray-300 text-sm">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
