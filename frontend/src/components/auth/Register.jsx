import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GoogleAuth from "./GoogleAuth";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiCheck } from "react-icons/hi";
import { FaGift, FaMicrophone, FaRobot, FaChartBar } from "react-icons/fa";
import {
  registerUser,
  googleLogin,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Password strength indicators
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async (token) => {
    const result = await dispatch(googleLogin(token));
    if (googleLogin.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const benefits = [
    { icon: FaGift, title: "100 Free Credits", desc: "Start practicing immediately" },
    { icon: FaMicrophone, title: "Voice Interviews", desc: "Real conversation practice" },
    { icon: FaRobot, title: "AI Feedback", desc: "Instant detailed analysis" },
    { icon: FaChartBar, title: "Track Progress", desc: "See your improvement" },
  ];

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[80px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Left Side - Benefits & Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-20"
      >
        <div className="mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-lg mb-4">
              MockMate
            </h1>
          </Link>
          <p className="text-xl xl:text-2xl text-gray-300 leading-relaxed">
            Join thousands of professionals who landed their dream jobs with AI-powered interview practice.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-5 bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl hover:border-purple-500/40 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                <benefit.icon className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex gap-8"
        >
          <div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">10K+</p>
            <p className="text-gray-400 text-sm">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">50K+</p>
            <p className="text-gray-400 text-sm">Interviews</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">95%</p>
            <p className="text-gray-400 text-sm">Success Rate</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-lg">
                MockMate
              </h1>
            </Link>
            <p className="text-gray-400 mt-2">Your AI Interview Coach</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 p-8 rounded-3xl shadow-[0_8px_32px_rgba(168,85,247,0.3)]">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Start your journey to interview success</p>
            </div>

            {/* Free Credits Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <FaGift className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">🎉 Get 100 Free Credits!</p>
                <p className="text-gray-400 text-sm">On your first sign up</p>
              </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-300 rounded-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400">!</span>
                </div>
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiUser className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiMail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiLockClosed className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicators */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-green-500' : 'bg-gray-600'}`}>
                        {hasMinLength && <HiCheck className="w-3 h-3 text-white" />}
                      </div>
                      <span className={hasMinLength ? 'text-green-400' : 'text-gray-500'}>At least 6 characters</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasUppercase ? 'bg-green-500' : 'bg-gray-600'}`}>
                        {hasUppercase && <HiCheck className="w-3 h-3 text-white" />}
                      </div>
                      <span className={hasUppercase ? 'text-green-400' : 'text-gray-500'}>One uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasNumber ? 'bg-green-500' : 'bg-gray-600'}`}>
                        {hasNumber && <HiCheck className="w-3 h-3 text-white" />}
                      </div>
                      <span className={hasNumber ? 'text-green-400' : 'text-gray-500'}>One number</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
                  loading
                    ? "bg-purple-900/50 cursor-not-allowed text-gray-400"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Free Account 🚀"
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a0b2e] text-gray-400">Or sign up with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleAuth onSuccess={handleGoogleLogin} />
            </div>

            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in →
              </Link>
            </p>

            <p className="mt-4 text-center text-gray-500 text-xs">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-purple-400 hover:underline">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
