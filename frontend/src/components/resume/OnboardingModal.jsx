import { motion } from "framer-motion";

const OnboardingModal = ({ onClose, onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg shadow p-6 w-11/12 max-w-xl">
        <h3 className="text-2xl font-bold text-indigo-900">How this interview works</h3>
        <p className="mt-3 text-gray-700">
          Ye prototype demo hai. Click <strong>Start</strong> to begin. Speak naturally — mic will capture your answer and AI will give short feedback.
        </p>
        <ul className="mt-3 list-disc list-inside text-gray-700">
          <li>Left pane: avatars + question + controls</li>
          <li>Right pane: live chat transcript and AI feedback</li>
          <li>End automatically when all questions are done or click <em>End</em></li>
        </ul>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Close</button>
          <button onClick={onStart} className="px-4 py-2 rounded bg-indigo-600 text-white">Start</button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
