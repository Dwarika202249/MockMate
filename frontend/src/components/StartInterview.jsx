// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const StartInterview = ({ onClose }) => {
//   const [type, setType] = useState('');
//   const [details, setDetails] = useState('');
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [difficulty, setDifficulty] = useState('medium');
//   const [questions, setQuestions] = useState('');
//   const [error, setError] = useState('');
//   const modalRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Close modal if clicked outside
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [onClose]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const token = localStorage.getItem('token'); // Get token from localStorage
//       const response = await axios.post('http://localhost:5000/api/interview/start', 
//         { type, details, numQuestions, difficulty },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setQuestions(response.data.questions);
//     } catch (err) {
//       setError('Failed to generate questions. Please try again.');
//       console.error('Error generating questions:', err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div
//         ref={modalRef}
//         className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
//         >
//           &times;
//         </button>
//         <h2 className="text-center text-indigo-900 text-2xl font-bold mb-4">Start Interview</h2>
//         {error && (
//           <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Interview Type</label>
//             <input
//               type="text"
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="e.g., Technical, Behavioral"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Details</label>
//             <textarea
//               value={details}
//               onChange={(e) => setDetails(e.target.value)}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="Provide additional details for the interview"
//               rows="4"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Number of Questions</label>
//             <input
//               type="number"
//               value={numQuestions}
//               onChange={(e) => setNumQuestions(e.target.value)}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               min="1"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Difficulty</label>
//             <select
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Start Interview
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StartInterview;

// src/components/StartInterview.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StartInterview = ({ onClose }) => {
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('basic');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/interview/start', {
        type,
        details,
        numQuestions,
        difficulty,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const { interviewId } = response.data;

      // Navigate to the InterviewPage with the interviewId
      navigate(`/interview/${interviewId}`);
      onClose(); // Close the modal after navigating
    } catch (error) {
        setMessage('Error creating interview. Please try again.');
      console.error('Error starting the interview:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-3xl font-bold mb-6 text-indigo-900">Start an Interview</h2>
      {message && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Interview Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder='Technical, Behaviour, etc..'
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Details:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            placeholder='provide specific details to topicwise interviewed'
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Number of Questions:</label>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Difficulty Level:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Start Interview
        </button>
      </form>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
      >
        &times;
      </button>
    </div>
  );
};

export default StartInterview;
