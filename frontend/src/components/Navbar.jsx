// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { isAuthenticated } from "../utils/auth";
// import { motion } from "framer-motion";
// import { HiMenu, HiX } from "react-icons/hi";
// import { RiDashboardFill } from "react-icons/ri";
// import { IoHome } from "react-icons/io5";
// import { FaCircleInfo } from "react-icons/fa6";
// import { RiLoginBoxFill } from "react-icons/ri";

// const Navbar = () => {
//   const [loggedIn, setLoggedIn] = useState(isAuthenticated());
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       setLoggedIn(isAuthenticated());
//     };

//     window.addEventListener("storage", checkAuthStatus);

//     return () => {
//       window.removeEventListener("storage", checkAuthStatus);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setLoggedIn(false);
//     setIsOpen(false); // Close the sidebar on logout
//     navigate("/");
//   };

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   // Close sidebar when clicking outside of it
//   const handleClickOutside = (event) => {
//     if (isOpen && !event.target.closest(".sidebar")) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="fixed top-0 left-0 w-full bg-indigo-900 text-white p-4 z-50"
//       >
//         <div className="max-w-6xl mx-auto flex justify-between items-center ">
//           <motion.div
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Link to="/" className="text-3xl font-bold">
//               MockMate
//             </Link>
//           </motion.div>
//           <div className="md:hidden">
//             <button onClick={toggleSidebar} className="text-white">
//               {isOpen ? <HiX size={30} /> : <HiMenu size={30} />}
//             </button>
//           </div>
//           <div className="hidden md:flex space-x-4">
//             <Link to="/" className="hover:underline">
//               Home
//             </Link>
//             <Link to="/about" className="hover:underline">
//               About
//             </Link>
//             {loggedIn ? (
//               <>
//                 <Link to="/dashboard" className="hover:underline">
//                   Dashboard
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link to="/login" className="hover:underline">
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </motion.nav>

//       {/* Overlay for the sidebar */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
//       )}

//       {/* Sidebar for mobile view */}
//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: isOpen ? "0%" : "100%" }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className={`fixed top-0 right-0 h-full bg-indigo-900 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out sidebar`}
//       >
//         <div className="flex flex-col p-4">
//           <button onClick={toggleSidebar} className="self-end mb-8">
//             <HiX size={30} />
//           </button>
//           <Link
//             to="/"
//             onClick={() => setIsOpen(false)}
//             className="flex items-center mb-4 text-2xl font-bold"
//           >
//             <IoHome className='mr-2' />
//             Home
//           </Link>
//           <Link
//             to="/about"
//             onClick={() => setIsOpen(false)}
//             className="flex items-center mb-4 text-2xl font-bold"
//           >
//             <FaCircleInfo className='mr-2'/>
//             About
//           </Link>
//           {loggedIn ? (
//             <>
//               <Link
//                 to="/dashboard"
//                 onClick={() => setIsOpen(false)}
//                 className="flex items-center mb-4 text-2xl font-bold"
//               >
//                 <RiDashboardFill className='mr-2' />
//                 Dashboard
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               onClick={() => setIsOpen(false)}
//               className="flex items-center mb-4 text-2xl font-bold"
//             >
//               <RiLoginBoxFill className='mr-2'/>
//               Login
//             </Link>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// export default Navbar;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { HiMenu, HiX } from "react-icons/hi";
import { RiDashboardFill } from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { FaCircleInfo } from "react-icons/fa6";
import { RiLoginBoxFill } from "react-icons/ri";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => setLoggedIn(isAuthenticated());
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsOpen(false);
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (isOpen && !event.target.closest(".sidebar")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-white rounded-full shadow-lg px-6 py-3 z-50 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-purple-700 rounded-xl p-2">
            <span className="text-white font-bold text-lg">🦊</span>
          </div>
          <span className="text-xl font-bold text-indigo-900">MockMate</span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-indigo-900">
          <Link to="/" className="hover:text-purple-700">Home</Link>
          <Link to="/" className="hover:text-purple-700">Pricing</Link>
          <Link to="/about" className="hover:text-purple-700">About</Link>
          {loggedIn && (
            <Link to="/dashboard" className="hover:text-purple-700">Dashboard</Link>
          )}
        </div>

        {/* Auth Button */}
        <div className="hidden md:flex">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-purple-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-800 text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-purple-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-800 text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleSidebar} className="text-purple-800">
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-indigo-900 text-white w-64 z-50 sidebar transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4">
          <button onClick={toggleSidebar} className="self-end mb-8">
            <HiX size={30} />
          </button>
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center mb-4 text-2xl font-bold">
            <IoHome className="mr-2" /> Home
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center mb-4 text-2xl font-bold">
            <FaCircleInfo className="mr-2" /> About
          </Link>
          {loggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center mb-4 text-2xl font-bold">
                <RiDashboardFill className="mr-2" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center mb-4 text-2xl font-bold">
              <RiLoginBoxFill className="mr-2" /> Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
