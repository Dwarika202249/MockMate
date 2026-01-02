import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GoogleAuth from "./GoogleAuth";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { FaRocket, FaBrain, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { 
  loginUser, 
  googleLogin, 
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated
} from "../../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

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
    const email = formData.get("email");
    const password = formData.get("password");
    
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async (token) => {
    const result = await dispatch(googleLogin(token));
    if (googleLogin.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const features = [
    { icon: FaBrain, text: "AI-Powered Mock Interviews" },
    { icon: FaChartLine, text: "Real-time Performance Analytics" },
    { icon: FaRocket, text: "Boost Your Career Confidence" },
    { icon: FaShieldAlt, text: "Secure & Private Practice" },
  ];

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Left Side - Branding & Features */}
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
            Your AI-powered interview preparation partner. Practice, improve, and land your dream job.
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-md border border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300">
                <feature.icon className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-gray-300 text-lg group-hover:text-white transition-colors">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 p-6 bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
        >
          <p className="text-gray-300 italic mb-4">"MockMate helped me ace my Google interview. The AI feedback was incredibly detailed and helpful!"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">S</div>
            <div>
              <p className="text-white font-medium">Sarah Chen</p>
              <p className="text-gray-400 text-sm">Software Engineer @ Google</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-gray-400">Sign in to continue your interview prep</p>
            </div>

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

            <form onSubmit={onSubmit} className="space-y-5">
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
                    placeholder="••••••••"
                    required
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-purple-500/30 bg-white/5 text-purple-600 focus:ring-purple-500/50" />
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-purple-900/50 cursor-not-allowed text-gray-400"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a0b2e] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleAuth onSuccess={handleGoogleLogin} />
            </div>

            <p className="mt-8 text-center text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Create one free →
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Privacy First</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
