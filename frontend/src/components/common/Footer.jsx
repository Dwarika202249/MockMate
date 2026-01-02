import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] text-white py-8 overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">MockMate</h3>
            <p className="text-sm md:w-[70%] text-gray-300">Empower your preparation with MockMate's AI-powered mock interviews tailored to your role, experience level, and goals. From real-time feedback to expert-crafted questions, we help you build confidence, sharpen your skills, and accelerate your journey to landing your dream job.</p>
          </div>
          <div className="mb-6 md:mb-0 w-[30%]">
            <h4 className="text-md font-semibold mb-2 text-purple-300">Quick Links</h4>
            <ul className="text-gray-300">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-purple-400 transition-colors">Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2 text-purple-300">Contact Us</h4>
            <p className="text-sm mb-2 w-[16rem] text-gray-300">Email: support@mockmate.com</p>
            <p className="text-sm text-gray-300">Phone: +1-234-567-890</p>
          </div>
        </div>
        <div className="mt-8 text-center border-t border-purple-500/20 pt-4">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} MockMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
