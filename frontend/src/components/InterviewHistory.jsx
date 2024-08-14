import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log(localStorage.getItem('token'));
        
        const response = await axios.get('http://localhost:5000/api/interview/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setInterviews(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching interview history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interview History</h2>
      <div className="space-y-4">
        {interviews.length ? interviews.map((interview) => (
          <div key={interview._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{interview.type}</h3>
            <p>{interview.details}</p>
            <p className="text-sm text-gray-600">Date: {new Date(interview.createdAt).toLocaleDateString()}</p>
            <a href={`/history/${interview._id}/details`} className="text-blue-500 hover:underline">View Details</a>
          </div>
        )) : <div className='mt-12 flex justify-center items-center'>
          <h2 className='font-bold text-2xl'>No Interview Details</h2>
          </div>}
      </div>
    </div>
  );
};

export default InterviewHistory;
