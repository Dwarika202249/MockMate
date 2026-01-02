import { motion } from "framer-motion";
import { 
  FaCheckCircle,
  FaStar, 
  FaGem
} from "react-icons/fa";


const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const creditPackages = [
    {
      credits: 100,
      price: 5,
      popular: false,
      savings: null,
      features: ["100 AI Credits", "~5 Full Interviews", "Basic Support"]
    },
    {
      credits: 250,
      price: 10,
      popular: true,
      savings: "Save 17%",
      features: ["250 AI Credits", "~12-15 Full Interviews", "Priority Support", "Advanced Analytics"]
    },
    {
      credits: 500,
      price: 18,
      popular: false,
      savings: "Save 30%",
      features: ["500 AI Credits", "~25 Full Interviews", "Premium Support", "Unlimited Analytics", "Custom Interview Templates"]
    }
  ];

const Pricing = () => {
  return (
    <section
      className="relative text-white py-20 px-6 bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] text-center sm:px-8 lg:px-32 z-10 overflow-hidden"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <section className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                  >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      Purchase <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI Credits</span>
                    </h2>
                    <p className="text-gray-300 text-lg">Choose the package that fits your interview preparation needs</p>
                  </motion.div>
      
                  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {creditPackages.map((pkg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 hover:scale-105 ${
                          pkg.popular
                            ? 'border-purple-500/50 shadow-[0_8px_32px_rgba(168,85,247,0.3)]'
                            : 'border-purple-500/20 hover:border-purple-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                            <FaStar /> Most Popular
                          </div>
                        )}
      
                        {pkg.savings && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {pkg.savings}
                          </div>
                        )}
      
                        <div className="text-center mb-6">
                          <div className="text-purple-400 mb-4">
                            <FaGem className="text-5xl mx-auto" />
                          </div>
                          <div className="text-6xl font-bold mb-2">{pkg.credits}</div>
                          <div className="text-gray-400 mb-4">AI Credits</div>
                          <div className="text-4xl font-bold text-purple-400">
                            ${pkg.price}
                          </div>
                        </div>
      
                        <ul className="space-y-3 mb-8">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300">
                              <FaCheckCircle className="text-green-400 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
      
                        <button
                          className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
                            pkg.popular
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/50'
                              : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-500/50'
                          }`}
                        >
                          Purchase Now
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
    </section>
  );
};

export default Pricing;
