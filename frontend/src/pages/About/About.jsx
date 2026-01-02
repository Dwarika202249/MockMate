import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import { Link } from "react-router-dom";
import { 
  FaBrain, 
  FaRocket, 
  FaUsers, 
  FaChartLine, 
  FaMicrophone, 
  FaVideo, 
  FaShieldAlt, 
  FaInfinity,
  FaStar,
  FaCheckCircle,
  FaLightbulb,
  FaGlobe
} from "react-icons/fa";

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const [activeUsers, setActiveUsers] = useState(null);
  const [interviewsConducted, setInterviewsConducted] = useState(null);

  // Fetch public stats (active user count, interviews conducted)
  useEffect(() => {
    let mounted = true;
    import('../../services/InterviewService').then(({ default: InterviewService }) => {
      InterviewService.getPublicStats()
        .then((res) => {
          if (!mounted) return;
          if (res && res.status === 'success' && res.data) {
            setActiveUsers(res.data.activeUsers ?? null);
            setInterviewsConducted(res.data.interviewsConducted ?? null);
          }
        })
        .catch((err) => {
          console.error('Failed to load public stats', err);
        });
    });
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    { icon: FaUsers, value: activeUsers !== null ? activeUsers.toLocaleString() : "—", label: "Active Users", color: "from-blue-400 to-cyan-400" },
    { icon: FaChartLine, value: "95%", label: "Success Rate", color: "from-purple-400 to-pink-400" },
    { icon: FaRocket, value: interviewsConducted !== null ? interviewsConducted.toLocaleString() : "—", label: "Interviews Conducted", color: "from-orange-400 to-red-400" },
    { icon: FaStar, value: "4.9/5", label: "User Rating", color: "from-yellow-400 to-amber-400" }
  ];

  const features = [
    {
      icon: FaBrain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze your responses in real-time, providing instant feedback and personalized improvement suggestions.",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: FaMicrophone,
      title: "Voice Recognition",
      description: "State-of-the-art speech-to-text technology captures your answers with precision, mimicking real interview conditions.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: FaVideo,
      title: "Video Practice",
      description: "Practice with our interactive video interface and get feedback on your body language, tone, and presentation skills.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Private",
      description: "Your data is encrypted and protected. We prioritize your privacy with enterprise-grade security measures.",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  const values = [
    {
      icon: FaLightbulb,
      title: "Innovation First",
      description: "Constantly evolving with cutting-edge AI technology to give you the best interview preparation experience."
    },
    {
      icon: FaUsers,
      title: "User-Centric",
      description: "Every feature is designed with you in mind, ensuring an intuitive and effective learning journey."
    },
    {
      icon: FaGlobe,
      title: "Accessibility",
      description: "Making professional interview preparation accessible to everyone, anywhere, at any time."
    },
    {
      icon: FaInfinity,
      title: "Continuous Growth",
      description: "Unlimited practice sessions with diverse question sets to help you master every interview scenario."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-x-hidden">
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        {/* Hero Section */}
        <motion.section 
          style={{ opacity, scale }}
          className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.4)",
                    "0 0 60px rgba(168, 85, 247, 0.6)",
                    "0 0 20px rgba(168, 85, 247, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm my-8"
              >
                <FaBrain className="text-6xl text-purple-400" />
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  About MockMate
                </span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              >
                Revolutionizing interview preparation with{" "}
                <span className="text-purple-400 font-semibold">AI-powered intelligence</span>,{" "}
                <span className="text-pink-400 font-semibold">real-time feedback</span>, and{" "}
                <span className="text-blue-400 font-semibold">personalized learning</span>
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-purple-500/50 to-pink-500/50" />
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <div className={`inline-flex p-4 bg-gradient-to-r ${stat.color} rounded-xl mb-4`}>
                      <stat.icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                    <p className="text-gray-300">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Our Mission
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto mb-8">
                At MockMate, we believe that <span className="text-purple-400 font-semibold">everyone deserves</span> the opportunity to excel in their career journey. 
                We've built an intelligent platform that combines <span className="text-pink-400 font-semibold">cutting-edge AI technology</span> with 
                personalized coaching to help you master the art of interviewing.
              </p>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                Whether you're a <span className="text-blue-400 font-semibold">fresh graduate</span>, a <span className="text-cyan-400 font-semibold">career switcher</span>, 
                or an <span className="text-purple-400 font-semibold">experienced professional</span>, MockMate provides tailored mock interviews, 
                real-time feedback, and actionable insights to boost your confidence and land your dream job.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Powered by Advanced Technology
              </span>
            </motion.h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl blur-xl`} />
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 h-full hover:border-white/40 transition-all duration-300">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6`}
                    >
                      <feature.icon className="text-4xl text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-orange-400">
                Our Core Values
              </span>
            </motion.h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <value.icon className="text-4xl text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/30 shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Why Choose MockMate?
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "AI-driven personalized feedback",
                  "Real-time speech and video analysis",
                  "Industry-specific interview scenarios",
                  "Unlimited practice sessions",
                  "Detailed performance analytics",
                  "Resume-based question generation",
                  "Mock interview history tracking",
                  "24/7 accessible from anywhere"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <FaCheckCircle className="text-2xl text-green-400 flex-shrink-0" />
                    <span className="text-gray-200 text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Ready to Ace Your Next Interview?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Join thousands of successful candidates who transformed their interview skills with MockMate
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/"
                    className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
