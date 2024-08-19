import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="mx-10 flex flex-col lg:flex-row items-center justify-between py-16 px-4">
      <motion.div
        className="flex-1 mt-8 lg:mt-0 lg:mr-8"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-indigo-900">
          Welcome to MockMate
        </h1>
        <p className="text-base lg:text-lg text-gray-700 mb-8">
          Enhance your interview skills with personalized mock interviews, AI-driven feedback, and detailed progress tracking. Start your journey towards acing your next interview today!
        </p>
        <Link
          to="/register"
          className="inline-block bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-200"
        >
          Get Started
        </Link>
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
