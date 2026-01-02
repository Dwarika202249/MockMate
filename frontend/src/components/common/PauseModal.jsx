import { useEffect } from "react";
import { motion } from "framer-motion";
import { HiPause, HiOutlineX } from "react-icons/hi";

const PauseModal = ({ show, onClose, onConfirm }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-md text-center shadow-[0_8px_32px_rgba(168,85,247,0.16)]"
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 flex items-center justify-center mb-1">
            <HiPause className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl font-semibold text-white">Pause Interview</h2>
          <p className="text-gray-300 text-sm">Are you sure you want to pause this interview? You can resume it later from your interview history.</p>

          <div className="mt-4 w-full flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_8px_32px_rgba(99,102,241,0.18)] transition"
            >
              Pause
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium bg-white/5 border border-purple-500/20 text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PauseModal;
