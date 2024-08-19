import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'John Doe',
    role: 'Software Engineer',
    message: 'MockMate helped me land my dream job by providing realistic mock interviews and valuable feedback.',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: 'Jane Smith',
    role: 'Product Manager',
    message: 'The personalized mock interviews were spot on. The feedback was detailed and actionable.',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: 'Sam Wilson',
    role: 'Data Scientist',
    message: 'I appreciated the variety of practice scenarios. It truly prepared me for different types of interviews.',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: 'Emily Johnson',
    role: 'UX Designer',
    message: 'Great experience overall. The progress tracking helped me stay focused and motivated.',
    avatar: 'https://via.placeholder.com/80',
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="m-10 py-16 px-4">
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center text-indigo-900">What Our Users Say</h2>
      <div className="relative w-full max-w-2xl mx-auto">
        <AnimatePresence initial={false}>
          {testimonials.map((testimonial, index) => (
            index === current && (
              <motion.div
                key={index}
                className="absolute w-full flex flex-col items-center p-6 bg-white rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg md:text-xl font-semibold mb-2">{testimonial.name}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-2">{testimonial.role}</p>
                <p className="text-sm md:text-base text-gray-700 italic">"{testimonial.message}"</p>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Testimonials;
