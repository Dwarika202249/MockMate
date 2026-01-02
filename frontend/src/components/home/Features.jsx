import { motion } from "framer-motion";
import {
  FaUserTie,
  FaRobot,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const features = [
  {
    title: "Personalized Mock Interviews",
    description:
      "Get tailored mock interviews based on your career goals and job role.",
    icon: <FaUserTie />,
    bgColor: "#8DBCC7",
  },
  {
    title: "AI Feedback",
    description:
      "Receive detailed feedback from AI like industry experts to improve your performance.",
    icon: <FaRobot />,
    bgColor: "#FCF259",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress with analytics and track your improvements over time.",
    icon: <FaChartLine />,
    bgColor: "#93DA97",
  },
  {
    title: "Practice Sessions",
    description:
      "Access a variety of practice questions and scenarios to prepare for different interview situations.",
    icon: <FaClipboardList />,
    bgColor: "#FF9A9A",
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden py-16 px-4 bg-gradient-to-br from-[#0d0219] via-[#12071f] to-[#0a0118]">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold mb-10 text-center z-10 relative"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-lg">Our </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-lg">Features</span>
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10 relative"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] flex-col justify-center items-center border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-center items-center text-white text-4xl mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-md border border-purple-500/40">
                  <span className="drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">{feature.icon}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-center">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
