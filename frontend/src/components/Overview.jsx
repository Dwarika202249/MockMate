import React from 'react';

const Overview = () => {
  // Dummy data for now
  const progress = {
    totalInterviews: 12,
    completedInterviews: 8,
    upcomingInterviews: 2,
  };

  const recentActivities = [
    { date: '2024-08-10', activity: 'Completed mock interview on Tech Skills' },
    { date: '2024-08-05', activity: 'Reviewed feedback from previous interview' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Progress</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-3">Progress Summary</h3>
        <ul>
          <li>Total Interviews: {progress.totalInterviews}</li>
          <li>Completed Interviews: {progress.completedInterviews}</li>
          <li>Upcoming Interviews: {progress.upcomingInterviews}</li>
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">Recent Activities</h3>
        <ul>
          {recentActivities.map((activity, index) => (
            <li key={index} className="mb-2">
              <strong>{activity.date}:</strong> {activity.activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
