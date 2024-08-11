import React from 'react';
import heroImage from '../assets/hero.jpg';

const Hero = () => {
  return (
    <section className="mx-10 flex items-center justify-between py-16 px-4">
      <div className="flex-1 mr-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to MockMate
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Enhance your interview skills with personalized mock interviews, experts like AI feedback, and detailed progress tracking. Start your journey towards acing your next interview today!
        </p>
        <a
          href="/register"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Get Started
        </a>
      </div>
      <div className="flex-1">
        <img src={heroImage} alt="Hero" className="w-full h-auto object-cover" />
      </div>
    </section>
  );
};

export default Hero;
