import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { RiDashboardFill } from "react-icons/ri";
import { RiProgress6Fill } from "react-icons/ri";
import { RiHistoryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";

const DashboardLayout = () => {
  const location = useLocation(); // Hook to get the current route

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

  // Function to check if a route is active
  const isActive = (route) => location.pathname === route;

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
              <Link
                to="/dashboard"
                className={`p-2 flex rounded items-center ${
                  isActive('/dashboard') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <RiDashboardFill className='mr-2' />
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/overview"
                className={`p-2 flex rounded items-center ${
                  isActive('/dashboard/overview') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <RiProgress6Fill className='mr-2'/>
                Progress
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/interview-history"
                className={`p-2 flex items-center rounded ${
                  isActive('/dashboard/interview-history')
                    ? 'bg-indigo-700'
                    : 'hover:bg-indigo-700'
                }`}
              >
                <RiHistoryFill className='mr-2' />
                Interview History
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/settings"
                className={`p-2 flex items-center rounded ${
                  isActive('/dashboard/settings') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <IoMdSettings className='mr-2' />
                Settings
              </Link>
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
