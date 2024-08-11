import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StartInterview from './StartInterview';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  useEffect(() => {
    // Close modal if clicked outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {userData.name}!</h2>
      <p className="text-lg">Here is an overview of your account:</p>
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-xl font-semibold mb-2">User Details:</h3>
        <p><strong>Email:</strong> {userData.email}</p>
        {/* Add more user details or statistics here */}
      </div>
      {/* Create Interview Button */}
      <div className="bg-white p-12 rounded-lg shadow-md mt-6">
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-3xl"
        >
          Create Interview <span className='font-bold text-5xl'>+</span>
        </button>
      </div>
      {/* Modal for StartInterview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <StartInterview onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
