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

  return (
    <section className="m-10 py-24 px-4 bg-[#fefefe]">
      <div className="smoky-bg z-0"></div>

      {/* Animated Section Heading */}
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
        }}
        className="text-5xl -mt-8 font-bold mb-20 text-center text-[#0e031a] z-10 relative"
      >
        What <span className="text-purple-500">Our Users</span> Say
      </motion.h2>

      <div className="relative w-full max-w-2xl mx-auto z-10">
        <AnimatePresence initial={false} mode="wait">
          {testimonials.map(
            (testimonial, index) =>
              index === current && (
                <motion.div
                  key={index}
                  className="absolute w-full flex flex-col items-center p-8 bg-white rounded-xl shadow-2xl text-center border border-gray-100 custom-border-1"
                  style={{ backgroundColor: testimonial.bgColor }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <motion.div
                    custom={0}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FaQuoteLeft className="text-3xl text-indigo-300 mb-4" />
                  </motion.div>

                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-200"
                    custom={1}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  />

                  <motion.h3
                    className="text-xl font-semibold text-[#21093b] mb-1"
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {testimonial.name}
                  </motion.h3>

                  <motion.p
                    className="text-[#260c42] font-medium mb-1"
                    custom={3}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {testimonial.role} @ {testimonial.company}
                  </motion.p>

                  <motion.p
                    className="text-gray-500 italic text-base leading-relaxed"
                    custom={4}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    "{testimonial.message}"
                  </motion.p>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Testimonials;