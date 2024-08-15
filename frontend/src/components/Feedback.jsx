import React from 'react';
import Navbar from './Navbar';

const Feedback = ({ feedback }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 mt-6">
        <h2 className="text-3xl font-extrabold text-indigo-900 mb-6">Feedback</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
