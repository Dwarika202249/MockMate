import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { RiDashboardFill, RiProgress6Fill, RiHistoryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { FaArrowRight, FaFile } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import Navbar from './Navbar';

const DashboardLayout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state

  // Set initial state based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false); // Close sidebar on mobile view
      } else {
        setIsOpen(true); // Open sidebar on desktop view
      }
    };

    handleResize(); // Set initial state on component mount
    window.addEventListener('resize', handleResize); // Adjust state on window resize

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  // Handle sidebar close on outside click in mobile view only
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 768 && isOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (route) => location.pathname === route;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen relative">
        {/* Sidebar */}
        <motion.div
          className={`fixed md:relative w-64 bg-indigo-900 text-white p-4 shadow-md z-40 transform transition-transform duration-300 ease-in-out sidebar ${
            isOpen ? 'translate-x-0 md:h-auto min-h-screen' : '-translate-x-full md:translate-x-0 min-h-screen'
          }`}
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
          // style={{ height: '100vh' }}
        >
          <ul className={`${isOpen ? "md:fixed" : ""}`}>
            <li className="mb-4 mt-20">
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
                Overview
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/resume"
                className={`p-2 flex rounded items-center ${
                  isActive('/dashboard/resume') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                {/* <RiProgress6Fill className='mr-2'/> */}
                <FaFile className='mr-2'/>
                Resume Interview
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
        </motion.div>

        {/* Sidebar Toggle Button */}
        <motion.div
          className={`fixed top-20 z-50 sidebar-toggle ${isOpen ? 'left-64' : 'left-4'} `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button onClick={toggleSidebar} className="text-white bg-indigo-800 rounded-md ml-4">
            {isOpen ? <HiX size={30} /> : <FaArrowRight size={30}/>}
          </button>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out overflow-y-auto ${
            isOpen ? 'block md:block' : 'block md:-ml-64'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mt-20 ml-16">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DashboardLayout;

