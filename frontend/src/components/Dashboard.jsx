import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {userData.name}!</h2>
      <p className="text-lg">Here is an overview of your account:</p>
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-xl font-semibold">User Details:</h3>
        <p><strong>Email:</strong> {userData.email}</p>
        {/* Add more user details or statistics here */}
      </div>
    </div>
  );
};

export default Dashboard;
