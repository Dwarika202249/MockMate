import React from 'react';

const InterviewHistory = () => {
  // Dummy data for now
  const interviewHistory = [
    { date: '2024-08-10', type: 'Technical', feedback: 'Good understanding of algorithms, needs to improve on system design.' },
    { date: '2024-07-28', type: 'Behavioral', feedback: 'Strong communication skills, but could be more concise.' },
    { date: '2024-07-15', type: 'HR', feedback: 'Positive attitude, but needs to articulate career goals more clearly.' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interview History</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul>
          {interviewHistory.map((interview, index) => (
            <li key={index} className="mb-4 border-b pb-4">
              <div className="flex justify-between">
                <span><strong>Date:</strong> {interview.date}</span>
                <span><strong>Type:</strong> {interview.type}</span>
              </div>
              <p className="mt-2"><strong>Feedback:</strong> {interview.feedback}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InterviewHistory;
