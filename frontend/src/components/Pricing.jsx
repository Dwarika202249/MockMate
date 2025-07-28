import { motion } from "framer-motion";
import { FaUserGraduate, FaRocket, FaBuilding } from "react-icons/fa";

const pricingPlans = [
  {
    tier: "Free",
    price: "$0",
    frequency: "/mo",
    description: "Perfect for beginners testing the waters",
    features: [
      { label: "60 Mock Interviews per month", included: true },
      { label: "Basic AI feedback", included: true },
      { label: "Limited resume parsing", included: true },
      { label: "Progress Tracking", included: true },
      { label: "Email support", included: false },
      { label: "Analytics", included: false },
    ],
    button: "Get Started",
    highlight: false,
    icon: <FaUserGraduate className="text-3xl text-indigo-400 mx-auto mb-4" />,
  },
  {
    tier: "Pro",
    price: "$20",
    frequency: "/mo",
    description: "Most popular choice for active job seekers",
    features: [
      { label: "Unlimited Mock Interviews", included: true },
      { label: "Advanced AI feedback", included: true },
      { label: "Custom interview difficulty", included: true },
      { label: "Resume parsing + suggestions", included: true },
      { label: "Progress Tracking", included: true },
      { label: "Priority Support", included: false },
    ],
    button: "Get Started",
    highlight: true,
    tag: "Most popular plan",
    icon: <FaRocket className="text-3xl text-lime-400 mx-auto mb-4" />,
  },
  {
    tier: "Enterprise",
    price: "$79",
    frequency: "/mo",
    description: "Best for bootcamps and training cohorts",
    features: [
      { label: "All Basic & Pro features", included: true },
      { label: "Interview schedule features", included: true },
      { label: "Enterprise Dashboard", included: true },
      { label: "Interview Template Creation", included: true },
      { label: "Advanced integrations", included: true },
      { label: "Priority Support", included: true },
    ],
    button: "Get Started",
    highlight: false,
    icon: <FaBuilding className="text-3xl text-purple-400 mx-auto mb-4" />,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="text-white py-20 px-6 mt-96 relative bg-[#0e031a] text-center sm:px-8 lg:px-32 z-10 overflow-hidden">
      <h5 className="relative uppercase tracking-wide text-xs font-bold bg-indigo-900 text-white px-12 py-2 sm:mb-8 rounded-full inline-block overflow-hidden z-10">
        <span className="relative z-10">Pricing</span>
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent shine-glow" />
      </h5>
      <h2 className=" capitalize text-4xl font-bold text-center m-4">
        Flexible pricing for <span className="text-purple-500">every type of</span> jobseeker
      </h2>
      <p className="text-center text-indigo-200 mb-12 max-w-2xl mx-auto">
        Whether you're just starting out or prepping for FAANG, we've got a plan to elevate your interview game.
      </p>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.tier}
            className={`relative rounded-2xl border border-indigo-800 bg-gradient-to-b from-[#151532] to-[#1c1c3f] p-8 w-full max-w-sm text-center shadow-xl transition-all duration-300 hover:scale-[1.03] ${
              plan.highlight ? "border-2 border-lime-400 shadow-lime-500/20 scale-105 z-10" : ""
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            {plan.highlight && (
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 bg-lime-500 text-black text-xs px-3 py-1 rounded-full uppercase font-semibold">
                {plan.tag}
              </div>
            )}

            {/* Glowing Icon */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-[#1f1f3a] flex items-center justify-center text-2xl text-lime-300 border-2 border-indigo-700 shadow-inner shadow-indigo-500/30">
                <div className="mt-3">{plan.icon}</div>
              </div>
              <div className="absolute inset-0 rounded-full spin-slow border-t-2 border-indigo-400 border-opacity-30">
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-white rounded-full blur-md -translate-x-1/2" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{plan.tier}</h3>
            <p className="text-indigo-300 mb-4 text-sm">{plan.description}</p>
            <div className="text-4xl font-extrabold mb-4">
              {plan.price}
              <span className="text-lg font-medium text-indigo-400">{plan.frequency}</span>
            </div>
            <ul className="text-sm text-left space-y-3 mb-6 text-indigo-100">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={
                    feature.included
                      ? "text-lime-400"
                      : "text-red-500"
                  }>
                    {feature.included ? "✔" : "✖"}
                  </span>
                  {feature.label}
                </li>
              ))}
            </ul>
            <button className="bg-indigo-600 hover:bg-indigo-500 transition-all text-white font-semibold py-2 px-6 rounded-full">
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
