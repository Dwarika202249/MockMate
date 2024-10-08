import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import StartInterview from './StartInterview';
import Loader from './Loader';

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
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/user`, {
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
    return <Loader />;
  }

  return (
    <div>
      <h2 className="text-3xl text-indigo-700 font-bold mb-10">Dashboard</h2>
      <h3 className="text-xl text-indigo-600 font-bold mb-4 capitalize">Welcome to your Dashboard, <span className='uppercase text-indigo-900'>{userData.name}</span></h3>
      <p className="text-lg">Here is an overview of your account:</p>
      <motion.div
        className="bg-white p-4 rounded-lg shadow-md mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-2 text-indigo-500">User Details:</h3>
        <p><strong className='text-indigo-500'>Email:</strong> {userData.email}</p>
        {/* Add more user details or statistics here */}
      </motion.div>
      {/* Create Interview Button */}
      <motion.div
        className="bg-white p-12 rounded-lg shadow-md mt-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={handleOpenModal}
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 text-3xl flex justify-center items-center"
        >
          Create Interview <span className='ml-3 font-bold text-5xl'>+</span>
        </button>
        
      </motion.div>
      {/* Modal for StartInterview */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative"
              initial={{ y: '-100vh', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100vh', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <StartInterview onClose={handleCloseModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
