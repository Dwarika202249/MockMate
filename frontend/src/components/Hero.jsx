import { Link } from "react-router-dom";
import {
  FaMicrophone,
  FaCheckCircle,
  FaStar,
  FaBriefcase,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative bg-[#0e031a] text-center py-32 px-4 sm:px-8 lg:px-32 overflow-hidden">
      {/* Desktop Floating Cards */}
      <>
        {/* Interview Passed */}
        <div
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
    left-1 top-24 lg:left-64 lg:top-32
    animate-floatSlow shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaCheckCircle className="text-green-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Interview Passed</p>
            <p className="text-gray-500 text-xs">95% Success Rate</p>
          </div>
        </div>

        {/* Top Rated */}
        <div
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
    left-1 bottom-12 lg:left-80 lg:bottom-28
    animate-floatSlow2 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaStar className="text-purple-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Top Rated</p>
            <p className="text-gray-500 text-xs">4.9/5 Rating</p>
          </div>
        </div>

        {/* Live Interview */}
        <div
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
    right-1 top-24 lg:right-80 lg:top-28
    animate-floatSlow shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaMicrophone className="text-blue-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Live Interview</p>
            <p className="text-gray-500 text-xs">Real-time AI Chat</p>
          </div>
        </div>

        {/* Personalized Prep */}
        <div
          className="hidden lg:flex absolute z-10 bg-[#201d33] text-white rounded-xl px-4 py-3 items-start space-x-3 
    right-1 bottom-12 lg:right-80 lg:bottom-32
    animate-floatSlow2 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
        >
          <FaBriefcase className="text-orange-500 text-2xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Personalized Prep</p>
            <p className="text-gray-500 text-xs">Custom Sessions</p>
          </div>
        </div>
      </>

      {/* Hero Text */}
      <h5 className="uppercase tracking-wide text-xs font-bold bg-indigo-900 text-white px-12 py-2 sm:mb-8 rounded-full inline-block">
        MockMate: Your interview mate
      </h5>

      <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
        Don’t Just Prepare, <br />
        <span className="text-white font-extrabold">
          Dominate Your Interviews
        </span>
        <br />
        <span className="text-purple-600">With AI</span>
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-base text-gray-500">
        Practice with AI-powered mock interviews, Level up your interview game,
        and land your dream job with real-time voice-to-voice conversations.
      </p>

      <Link
        to="/dashboard"
        className="mt-8 inline-flex items-center justify-center bg-[#ddc510] hover:bg-[#f5b507] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
      >
        Start Free Interview →
      </Link>
      {/* Floating Cards - Mobile Grid & Desktop Floating */}
      <div className="lg:hidden mt-10 grid grid-cols-2 gap-4 max-w-md mx-auto">
        {/* Card 1 */}
        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaCheckCircle className="text-green-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Interview Passed</p>
            <p className="text-gray-500 text-xs">95% Success Rate</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaStar className="text-purple-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Top Rated</p>
            <p className="text-gray-500 text-xs">4.9/5 Rating</p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaMicrophone className="text-blue-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Live Interview</p>
            <p className="text-gray-500 text-xs">Real-time AI Chat</p>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-[#201d33] text-white rounded-xl px-4 py-3 flex items-start space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <FaBriefcase className="text-orange-500 text-xl" />
          <div className="text-left text-sm">
            <p className="font-semibold">Personalized Prep</p>
            <p className="text-gray-500 text-xs">Custom Sessions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
