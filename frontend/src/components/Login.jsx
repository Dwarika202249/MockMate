import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleAuth from "./GoogleAuth";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password.");
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (token) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        id_token: token,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Google login failed.");
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h1 className="text-3xl text-center font-bold mb-5 text-indigo-900">
          <Link to="/">MockMate</Link>
        </h1>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition duration-200 ${
              loading
                ? "bg-indigo-900 cursor-not-allowed text-white"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-500 hover:underline">
              Register here
            </a>
          </p>
          <div className="w-full mt-5 flex justify-center items-center">
            <GoogleAuth onSuccess={handleGoogleLogin} />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
