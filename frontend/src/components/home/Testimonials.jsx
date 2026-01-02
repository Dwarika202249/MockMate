import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    company: "Google",
    message:
      "MockMate helped me land my dream job by providing realistic mock interviews and valuable feedback.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bgColor: "#FF9A9A",
  },
  {
    name: "Jane Smith",
    role: "Product Manager",
    company: "Meta",
    message:
      "The personalized mock interviews were spot on. The feedback was detailed and actionable.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    bgColor: "#93DA97",
  },
  {
    name: "Sam Wilson",
    role: "Data Scientist",
    company: "Airbnb",
    message:
      "I appreciated the variety of practice scenarios. It truly prepared me for different types of interviews.",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    bgColor: "#FCF259",
  },
  {
    name: "Emily Johnson",
    role: "UX Designer",
    company: "Figma",
    message:
      "Great experience overall. The progress tracking helped me stay focused and motivated.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    bgColor: "#8DBCC7",
  },
  {
    name: "Aarav Mehta",
    role: "Frontend Developer",
    company: "Flipkart",
    message:
      "MockMate gave me the confidence to face even the toughest technical rounds. The mock sessions were super realistic!",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    bgColor: "#FFD580",
  },
  {
    name: "Lina Alvarez",
    role: "AI Researcher",
    company: "OpenAI",
    message:
      "Loved how AI-driven the platform is. The feedback I received was just like a real hiring panel’s input.",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    bgColor: "#B8E2F2",
  },
  {
    name: "Haruto Tanaka",
    role: "DevOps Engineer",
    company: "Amazon",
    message:
      "MockMate was like a virtual coach. The continuous improvement suggestions were gold!",
    avatar: "https://randomuser.me/api/portraits/men/60.jpg",
    bgColor: "#E0B0FF",
  },
  {
    name: "Chloe Dubois",
    role: "Marketing Analyst",
    company: "Netflix",
    message:
      "The structured interview simulations helped me frame better responses and manage time under pressure.",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    bgColor: "#FFA3B1",
  },
  {
    name: "Kiran Patel",
    role: "Full Stack Engineer",
    company: "Zomato",
    message:
      "MockMate nailed the mock interview experience. It’s exactly what you need before stepping into the real deal.",
    avatar: "https://randomuser.me/api/portraits/men/38.jpg",
    bgColor: "#A7E9AF",
  },
];

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getPrevIndex = () => (current === 0 ? testimonials.length - 1 : current - 1);
  const getNextIndex = () => (current === testimonials.length - 1 ? 0 : current + 1);

  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-[#0d0219] via-[#12071f] to-[#0a0118] overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Animated Section Heading */}
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
        }}
        className="text-4xl sm:text-5xl font-bold mb-16 text-center z-10 relative"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-lg">
          What 
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-lg"> Our Users</span>
        <span className="text-white drop-shadow-lg"> Say</span>
      </motion.h2>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl mx-auto z-10 h-[420px] flex items-center justify-center overflow-hidden">
        
        {/* Previous Card - Left Side */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`prev-${getPrevIndex()}`}
            className="absolute left-0 w-[350px] h-[380px] flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center border border-purple-500/20 opacity-50 blur-[2px] scale-90"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.5 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <FaQuoteLeft className="text-2xl text-purple-400/50 mb-3" />
            <img
              src={testimonials[getPrevIndex()].avatar}
              alt={testimonials[getPrevIndex()].name}
              className="w-20 h-20 rounded-full mx-auto mb-3 border-3 border-purple-500/30"
            />
            <h3 className="text-lg font-semibold text-white/70 mb-1">
              {testimonials[getPrevIndex()].name}
            </h3>
            <p className="text-gray-400 font-medium text-sm mb-1">
              {testimonials[getPrevIndex()].role} @ {testimonials[getPrevIndex()].company}
            </p>
            <p className="text-gray-500 italic text-sm leading-relaxed line-clamp-3">
              "{testimonials[getPrevIndex()].message}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Current Card - Center */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`current-${current}`}
            className="relative z-20 w-[400px] h-[400px] flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(168,85,247,0.3)] text-center border border-purple-500/40"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FaQuoteLeft className="text-3xl text-purple-400 mb-4 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            </motion.div>

            <motion.img
              src={testimonials[current].avatar}
              alt={testimonials[current].name}
              className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            />

            <motion.h3
              className="text-xl font-semibold text-white mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {testimonials[current].name}
            </motion.h3>

            <motion.p
              className="text-gray-300 font-medium mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {testimonials[current].role} @ {testimonials[current].company}
            </motion.p>

            <motion.p
              className="text-gray-400 italic text-base leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              "{testimonials[current].message}"
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Next Card - Right Side */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`next-${getNextIndex()}`}
            className="absolute right-0 w-[350px] h-[380px] flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center border border-purple-500/20 opacity-50 blur-[2px] scale-90"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.5 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <FaQuoteLeft className="text-2xl text-purple-400/50 mb-3" />
            <img
              src={testimonials[getNextIndex()].avatar}
              alt={testimonials[getNextIndex()].name}
              className="w-20 h-20 rounded-full mx-auto mb-3 border-3 border-purple-500/30"
            />
            <h3 className="text-lg font-semibold text-white/70 mb-1">
              {testimonials[getNextIndex()].name}
            </h3>
            <p className="text-gray-400 font-medium text-sm mb-1">
              {testimonials[getNextIndex()].role} @ {testimonials[getNextIndex()].company}
            </p>
            <p className="text-gray-500 italic text-sm leading-relaxed line-clamp-3">
              "{testimonials[getNextIndex()].message}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8 z-10 relative">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-purple-500 w-6 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;