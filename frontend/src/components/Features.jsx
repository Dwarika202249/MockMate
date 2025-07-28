// import { useEffect, useRef, useState } from 'react';
// import { motion } from 'framer-motion';

// const features = [
//   {
//     title: 'Personalized Mock Interviews',
//     description: 'Get tailored mock interviews based on your career goals and job role.',
//     icon: '📋',
//   },
//   {
//     title: 'AI Feedback',
//     description: 'Receive detailed feedback from AI like industry experts to improve your performance.',
//     icon: '🗣️',
//   },
//   {
//     title: 'Progress Tracking',
//     description: 'Monitor your progress with analytics and track your improvements over time.',
//     icon: '📈',
//   },
//   {
//     title: 'Practice Sessions',
//     description: 'Access a variety of practice questions and scenarios to prepare for different interview situations.',
//     icon: '📝',
//   },
// ];

// const Features = () => {
//   const [inView, setInView] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setInView(true);
//         } else {
//           setInView(false);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, []);

//   return (
//     <section className="m-10 py-16 px-4 bg-white">
//       <h2 className="text-5xl font-bold mb-10 text-center text-indigo-900">Our Features</h2>
//       <div
//         ref={ref}
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//       >
//         {features.map((feature, index) => (
//           <motion.div
//             key={index}
//             className="p-6 bg-gray-100 rounded-lg shadow-lg flex-col justify-center items-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
//             transition={{ duration: 0.8, ease: 'easeOut' }}
//           >
//             <div className="flex justify-center items-center text-4xl mb-4 text-blue-500">
//               {feature.icon}
//             </div>
//             <h3 className="text-xl font-semibold mb-2 text-center text-indigo-800">{feature.title}</h3>
//             <p className="text-gray-700 text-center">{feature.description}</p>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Features;


import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserTie,
  FaRobot,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";

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
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  return (
    <section className=" relative overflow-hidden py-16 px-4 bg-white">
      {/* 🔮 Animated Background Blur */}
      <div className="smoky-bg"></div>

      <h2 className="text-5xl font-bold mb-10 text-center text-[#0e031a] z-10 relative">
        Our Features
      </h2>

      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10 relative"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            style={{ backgroundColor: feature.bgColor }}
            className="p-6 rounded-lg shadow-lg flex-col justify-center items-center custom-border-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
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
      </div>
    </section>
  );
};

export default Features;
