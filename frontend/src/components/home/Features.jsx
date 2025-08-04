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
    <section className="relative overflow-hidden py-16 px-4 bg-white">
      {/* 🔮 Optional: Background blur */}
      <div className="smoky-bg"></div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold mb-10 text-center text-[#0e031a] z-10 relative"
      >
        Our <span className="text-purple-500">Features</span>
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
            style={{ backgroundColor: feature.bgColor }}
            className="p-6 rounded-lg shadow-lg flex-col justify-center items-center custom-border-1"
          >
            <div className="flex justify-center items-center text-white text-4xl mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center text-[#21093b]">
              {feature.title}
            </h3>
            <p className="text-[#595472] text-center">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
