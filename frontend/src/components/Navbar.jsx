import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">MockMate</Link>
        <div>
          <Link to="/dashboard" className="hover:bg-indigo-700 p-2 rounded">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
