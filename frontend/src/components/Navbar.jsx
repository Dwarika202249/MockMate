import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';


const Navbar = () => {
  const loggedIn = isAuthenticated();

  return (
    <nav className="bg-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-3xl font-bold">MockMate</Link>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            {loggedIn ? (
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            ) : (
              <li><Link to="/login" className="hover:underline">Login</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
