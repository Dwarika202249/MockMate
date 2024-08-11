
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams} from 'react-router-dom';

// const InterviewPage = () => {
//   const [questions, setQuestions] = useState([]);
//   const { interviewId } = useParams();

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         // Replace this with your API endpoint to fetch questions
//         const response = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setQuestions(response.data.questions);
//       } catch (error) {
//         console.error('Error fetching interview questions:', error);
//         // Optionally redirect if there's an error
//         navigate('/dashboard');
//       }
//     };

//     fetchQuestions();
//   }, [interviewId, navigate]);

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Interview Questions</h2>
//       <div className="bg-white p-4 rounded-lg shadow-md mt-4">
//         {questions.length > 0 ? (
//           <ul>
//             {questions.map((question, index) => (
//               <li key={index} className="mb-4">
//                 <p className="text-lg font-semibold">{index + 1}. {question}</p>
//                 {/* Add more details or UI for answering the questions */}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No questions available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InterviewPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'

const InterviewPage = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setInterview(response.data);
      } catch (error) {
        console.error('Error fetching interview data:', error);
      }
    };

    fetchInterview();
  }, [interviewId]);

  if (!interview) {
    return <div>Loading...</div>;
  }

  return (
      <div>
    <Navbar />
      <h2 className="text-2xl font-bold mb-4">Interview</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Interview Questions</h3>
        <div>{interview.questions}</div>
      </div>
    </div>
  );
};

export default InterviewPage;
