
import ResumeUpload from "../../components/resume/ResumeUpload";
import { FiUpload, FiCheckCircle, FiAward } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const ResumePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* Hero / Info */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-[0_12px_48px_rgba(168,85,247,0.08)]">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 flex items-center justify-center">
                <FiUpload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">Upload & Review Your Resume</h1>
                <p className="text-gray-300 mt-2">Get automated parsing, skill extraction, and AI recommendations to prepare better interview questions tailored to your experience.</p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-purple-500/10 rounded-full px-3 py-2">
                    <FiCheckCircle className="text-green-400" />
                    <span className="text-sm text-gray-300">100 free credits on sign up</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-purple-500/10 rounded-full px-3 py-2">
                    <FiAward className="text-yellow-400" />
                    <span className="text-sm text-gray-300">AI-driven feedback</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <ResumeUpload />
            </div>
          </div>

          {/* Steps & How it Works */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-purple-500/10 rounded-lg">
              <div className="text-sm text-gray-300">Step 1</div>
              <div className="font-semibold text-white mt-1">Upload Resume</div>
              <div className="text-xs text-gray-400 mt-2">Drag and drop a PDF, we parse it for skills & experience.</div>
            </div>
            <div className="p-4 bg-white/5 border border-purple-500/10 rounded-lg">
              <div className="text-sm text-gray-300">Step 2</div>
              <div className="font-semibold text-white mt-1">Review & Edit</div>
              <div className="text-xs text-gray-400 mt-2">Clean up parsed fields, add missing skills or projects.</div>
            </div>
            <div className="p-4 bg-white/5 border border-purple-500/10 rounded-lg">
              <div className="text-sm text-gray-300">Step 3</div>
              <div className="font-semibold text-white mt-1">Start Mock Interview</div>
              <div className="text-xs text-gray-400 mt-2">Use your updated resume to generate role-specific questions.</div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-6 bg-white/5 backdrop-blur-xl border border-purple-500/10 rounded-lg">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2"><HiSparkles className="w-5 h-5 text-purple-300" /> Resume Tips</h3>
            <ul className="mt-3 space-y-2 text-gray-300 text-sm">
              <li>• Keep summaries concise and results-oriented (use metrics where possible).</li>
              <li>• Highlight technologies and tools used per role.</li>
              <li>• Add notable achievements and projects with links when possible.</li>
            </ul>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-5">
          <div className="sticky top-8 space-y-4">
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-[0_12px_48px_rgba(168,85,247,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">Profile Strength</div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">78%</div>
                </div>
                <div className="text-sm text-gray-400">Updated just now</div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Improve your skills, then run another analysis.</p>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-500/10 flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Analyze</button>
                <button className="flex-1 py-2 rounded-xl bg-white/5 border border-purple-500/10 text-white">Preview</button>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
              <h4 className="text-white font-semibold">Why use MockMate?</h4>
              <ul className="mt-3 text-sm text-gray-300 space-y-2">
                <li>• Role-specific questions generated from your resume</li>
                <li>• Real-time voice interviews & AI feedback</li>
                <li>• Track progress across sessions</li>
              </ul>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
              <h4 className="text-white font-semibold">Quick Actions</h4>
              <div className="mt-3 flex flex-col gap-3">
                <button className="py-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-400 text-white">Start Free Interview</button>
                <button className="py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Create Resume-Based Interview</button>
              </div>
            </div>

            <div className="p-4 text-xs text-gray-400">Need help? Contact us at <a href="mailto:support@mockmate.ai" className="text-purple-300 hover:underline">support@mockmate.ai</a></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResumePage;


