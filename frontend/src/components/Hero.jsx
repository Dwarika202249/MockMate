import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero.jpg';

const Hero = () => {
  return (
    <section className="mx-10 flex items-center justify-between py-16 px-4">
      <motion.div
        className="flex-1 mr-8"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
      >
        <h1 className="text-5xl font-bold mb-8 text-indigo-900">
          Welcome to MockMate
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Enhance your interview skills with personalized mock interviews, experts like AI feedback, and detailed progress tracking. Start your journey towards acing your next interview today!
        </p>
        <a
          href="/register"
          className="inline-block bg-indigo-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Get Started
        </a>
      </motion.div>
      
      <motion.div
        className="flex-1"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
      >
        <img src={heroImage} alt="Hero" className="w-full h-auto object-cover" />
      </motion.div>
    </section>
  );
};

export default Hero;
