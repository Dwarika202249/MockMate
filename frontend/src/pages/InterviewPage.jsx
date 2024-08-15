// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Loader from '../components/Loader';
// import Feedback from '../components/Feedback';

// const InterviewPage = () => {
//   const { interviewId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [feedback, setFeedback] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchInterview = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setQuestions(response.data.questions);
//       } catch (error) {
//         console.error('Error fetching interview data:', error);
//       }
//     };

//     fetchInterview();
//   }, [interviewId]);

//   const handleAnswerChange = (event) => {
//     setAnswers({
//       ...answers,
//       [currentQuestionIndex]: event.target.value,
//     });
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handleSubmitAnswers = async () => {
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post('http://localhost:5000/api/interview/submit', {
//         interviewId,
//         answers,
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });

//       setFeedback(response.data.feedback);
//     } catch (error) {
//       console.error('Error submitting answers:', error);
//     }
//     setIsSubmitting(false);
//   };

//   if (!questions.length) {
//     return <div><Loader /></div>;
//   }

//   if (feedback) {
//     return (
//       <div>
//         <Feedback feedback={feedback} />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar />
//       <h2 className="m-6 text-2xl font-bold mb-4">Interview</h2>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1} of {questions.length}</h3>
//         <p className="mb-4">{questions[currentQuestionIndex]}</p>
//         <textarea
//           value={answers[currentQuestionIndex] || ''}
//           onChange={handleAnswerChange}
//           rows="4"
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Type your answer here..."
//         />
//         <div className="mt-4">
//           {currentQuestionIndex < questions.length - 1 ? (
//             <button
//               onClick={handleNextQuestion}
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//               disabled={!answers[currentQuestionIndex]}
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmitAnswers}
//               className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Feedback from '../components/Feedback';

const InterviewPage = () => {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching interview data:', error);
      }
    };

    fetchInterview();
  }, [interviewId]);

  const handleAnswerChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: event.target.value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitAnswers = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/interview/submit', {
        interviewId,
        answers,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setFeedback(response.data.feedback);
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loader />;
  }

  if (!questions.length) {
    return <div>
      <h2>Something wrong with questions fetching. Kindly try again!!</h2>
    </div>;
  }

  if (feedback) {
    return (
      <div>
        <Feedback feedback={feedback} />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h2 className="m-6 text-2xl font-bold mb-4">Interview</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1} of {questions.length}</h3>
        <p className="mb-4">{questions[currentQuestionIndex]}</p>
        <textarea
          value={answers[currentQuestionIndex] || ''}
          onChange={handleAnswerChange}
          rows="4"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your answer here..."
        />
        <div className="mt-4 flex justify-between">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={!answers[currentQuestionIndex] || answers[currentQuestionIndex].trim() === ''}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitAnswers}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              disabled={isSubmitting || !answers[currentQuestionIndex] || answers[currentQuestionIndex].trim() === ''}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
