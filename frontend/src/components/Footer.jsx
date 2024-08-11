import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-4">MockMate</h3>
            <p className="text-sm">Your trusted partner for mock interviews and career growth.</p>
          </div>
          <div className="mb-6 md:mb-0">
            <h4 className="text-md font-semibold mb-2">Quick Links</h4>
            <ul>
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/register" className="hover:underline">Register</a></li>
              <li><a href="/login" className="hover:underline">Login</a></li>
              <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Contact Us</h4>
            <p className="text-sm mb-2">Email: support@mockmate.com</p>
            <p className="text-sm">Phone: +1-234-567-890</p>
          </div>
        </div>
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} MockMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
