import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link } from 'react-router-dom';

const DashboardLayout = () => {
  
  const sidebarVariants = {
    initial: { x: '-10%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-50%', opacity: 0 },
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-indigo-900 text-white p-4 shadow-md"
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
      >
        <h2 className="text-3xl font-bold mb-6">
          <Link to="/">MockMate</Link>
        </h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/dashboard" className="hover:bg-indigo-700 p-2 block rounded">Dashboard</Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/overview" className="hover:bg-indigo-700 p-2 block rounded">Progress</Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/interview-history" className="hover:bg-indigo-700 p-2 block rounded">Interview History</Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/settings" className="hover:bg-indigo-700 p-2 block rounded">Settings</Link>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Content Area */}
      <motion.div
        className="flex-1 bg-gray-100 p-8"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
