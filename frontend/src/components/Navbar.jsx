import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { motion } from "framer-motion";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      setLoggedIn(isAuthenticated());
    };

    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-indigo-900 text-white p-4"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="text-3xl font-bold">
            MockMate
          </Link>
        </motion.div>
        <div>
          <ul className="flex space-x-4">
            <motion.li
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </motion.li>
            {loggedIn ? (
              <>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </motion.li>
                <motion.li
                >
                  <Link
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-1 px-2 mt-4 ml-5 rounded hover:bg-red-600"
                  >
                    Logout
                  </Link>
                </motion.li>
              </>
            ) : (
              <motion.li
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </motion.li>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
