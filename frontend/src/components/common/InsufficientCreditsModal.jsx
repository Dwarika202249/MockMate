import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const InsufficientCreditsModal = ({ show, onClose, required, balance, interviewType }) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    onClose();
    navigate('/dashboard'); // Will open purchase modal from dashboard
  };

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-red-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-red-500/30"
      >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="bg-red-500/20 rounded-full p-6"
              >
                <FaExclamationTriangle className="text-5xl text-red-400" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Insufficient Credits
            </h2>
            <p className="text-gray-300 mb-6">
              You need <span className="font-bold text-yellow-400">{required} credits</span> to start this {interviewType} interview, 
              but you only have <span className="font-bold text-red-400">{balance} credits</span> remaining.
            </p>

            {/* Credit Info */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Your Balance:</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <FaCoins className="text-yellow-400" />
                  {balance} credits
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Required:</span>
                <span className="text-red-400 font-bold">{required} credits</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-white/10">
                <span className="text-gray-400">Shortage:</span>
                <span className="text-orange-400 font-bold">{required - balance} credits</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
              >
                <FaCoins />
                Purchase Credits
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {show && createPortal(modalContent, document.body)}
    </AnimatePresence>
  );
};

export default InsufficientCreditsModal;
