import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden p-8 max-w-3xl"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-indigo-600 mb-6 text-center"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-lg text-gray-700 mb-4 leading-relaxed"
        >
          Welcome to our innovative platform where we blend cutting-edge
          technology with a seamless user experience. Our mission is to empower
          users by providing them with the tools they need to succeed in the
          ever-evolving digital world.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-lg text-gray-700 mb-4 leading-relaxed"
        >
          At MockMate, we believe in empowering individuals to achieve their best in interviews through innovative technology and personalized practice. Our platform is designed to simulate real interview experiences, offering tailored mock interviews with AI-driven feedback that helps you refine your skills and boost your confidence. Whether you're preparing for your dream job, a crucial academic interview, or a pivotal career move, MockMate provides the tools you need to practice, learn, and succeed. With a focus on real-time feedback, diverse interview scenarios, and user-centric design, we aim to be your trusted partner in mastering the art of interviews.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-8 text-center"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Link to="/">Learn More</Link>
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
    <Footer />
    </>
  );
};

export default About;
