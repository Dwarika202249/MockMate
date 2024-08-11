import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white p-4 shadow-md">
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/dashboard" className="hover:bg-indigo-700 p-2 block rounded">Dashboard</Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/overview" className="hover:bg-indigo-700 p-2 block rounded">Overview</Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/interview-history" className="hover:bg-indigo-700 p-2 block rounded">Interview History</Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/settings" className="hover:bg-indigo-700 p-2 block rounded">Settings</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
