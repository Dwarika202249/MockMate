import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#0e031a] text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#ffffff] mb-4">
          Crack Your <span className="text-purple-500">Next Interview</span> with Confidence
        </h2>
        <p className="text-[#c0c8f8] text-lg mb-8">
          Join thousands of job seekers & techies who used MockMate’s AI mock interviews to land their dream roles.
        </p>
        <div className="flex justify-center items-center gap-4 mb-4">
          <Link
                  to="/dashboard"
                  className="inline-flex items-center text-white bg-[#5E3BEE] hover:bg-[#4526cb] font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
                >
                  Start Free Trial <AiOutlineArrowRight size={18} />
                </Link>
          <Link
                  to="/dashboard"
                  className="bg-[#ddc510] hover:bg-[#f5b507] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm"
                >
                  Schedule Demo
                </Link>
        </div>
        <p className="text-sm text-[#faffb5]">
          No card required • 30-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
