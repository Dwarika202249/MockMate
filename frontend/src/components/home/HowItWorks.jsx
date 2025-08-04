// import { FaUpload, FaMicrophone, FaComments, FaRocket } from "react-icons/fa";

// const HowItWorks = () => {
//   return (
//     <section className="relative bg-[#0e031a] text-center py-24 px-4 sm:px-8 lg:px-32 z-10 overflow-hidden">
//       {/* Section Title */}
//       <h5 className="relative uppercase tracking-wide text-xs font-bold bg-indigo-900 text-white px-12 py-2 sm:mb-4 rounded-full inline-block overflow-hidden z-10">
//         <span className="relative z-10">How Mockmate works</span>
//         <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent shine-glow" />
//       </h5>

//       <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-4">
//         How Our <span className="text-purple-500">AI Platform</span> Works
//       </h2>
//       <p className="text-gray-400 max-w-2xl mx-auto text-base">
//         Experience seamless, AI-driven mock interviews that guide you from job
//         description to real interview success — in just 4 easy steps.
//       </p>

//       {/* Steps Grid */}
//       <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white z-10 relative">
//         {/* Step 1 */}
//         <div className="bg-[#201d33] p-6 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-md">
//           <FaUpload className="text-purple-400 text-3xl mb-4 mx-auto" />
//           <h4 className="text-sm text-purple-400 font-bold mb-2">Step 1</h4>
//           <h3 className="text-lg font-semibold mb-1">Upload Job Desc / Resume</h3>
//           <p className="text-gray-400 text-sm">
//             Provide JD or upload your resume to tailor your mock interview experience.
//           </p>
//         </div>

//         {/* Step 2 */}
//         <div className="bg-[#201d33] p-6 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-md">
//           <FaMicrophone className="text-blue-400 text-3xl mb-4 mx-auto" />
//           <h4 className="text-sm text-blue-400 font-bold mb-2">Step 2</h4>
//           <h3 className="text-lg font-semibold mb-1">Start Mock Interview</h3>
//           <p className="text-gray-400 text-sm">
//             Engage in real-time voice interviews powered by our AI engine.
//           </p>
//         </div>

//         {/* Step 3 */}
//         <div className="bg-[#201d33] p-6 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-md">
//           <FaComments className="text-pink-400 text-3xl mb-4 mx-auto" />
//           <h4 className="text-sm text-pink-400 font-bold mb-2">Step 3</h4>
//           <h3 className="text-lg font-semibold mb-1">Receive Feedback</h3>
//           <p className="text-gray-400 text-sm">
//             Get AI-generated feedback and improvement insights instantly.
//           </p>
//         </div>

//         {/* Step 4 */}
//         <div className="bg-[#201d33] p-6 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-md">
//           <FaRocket className="text-yellow-400 text-3xl mb-4 mx-auto" />
//           <h4 className="text-sm text-yellow-400 font-bold mb-2">Step 4</h4>
//           <h3 className="text-lg font-semibold mb-1">Nail the Real Thing</h3>
//           <p className="text-gray-400 text-sm">
//             Go into your next interview confident, polished, and prepared.
//           </p>
//         </div>
//       </div>

//       {/* Optional glowing blur background for visual pop */}
//       <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 opacity-20 blur-[120px] rounded-full pointer-events-none z-0" />
//     </section>
//   );
// };

// export default HowItWorks;

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
    <section className="relative bg-[#0e031a] text-center py-24 px-4 sm:px-8 lg:px-32 z-10 overflow-hidden">
      {/* Section Title */}
      <motion.h5
        className="relative uppercase tracking-wide text-xs font-bold bg-indigo-900 text-white px-12 py-2 sm:mb-4 rounded-full inline-block overflow-hidden z-10"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="relative z-10">How Mockmate works</span>
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent shine-glow" />
      </motion.h5>

      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-4"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        How Our <span className="text-purple-500">AI Platform</span> Works
      </motion.h2>

      <motion.p
        className="text-gray-400 max-w-2xl mx-auto text-base"
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
            className="bg-[#201d33] p-6 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-md"
          >
            {step.icon}
            <h4 className={`text-sm font-bold mb-2 ${step.color}`}>{step.step}</h4>
            <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Glow Background */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 opacity-20 blur-[120px] rounded-full pointer-events-none z-0" />
    </section>
  );
};

export default HowItWorks;
