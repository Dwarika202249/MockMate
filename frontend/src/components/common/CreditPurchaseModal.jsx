import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaTimes, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { createPortal } from 'react-dom';

const CreditPurchaseModal = ({ show, onClose, currentBalance }) => {
  const [selectedPack, setSelectedPack] = useState(null);
  const [processing, setProcessing] = useState(false);

  const creditPacks = [
    {
      id: 'basic',
      name: 'Basic Pack',
      credits: 200,
      price: 9.99,
      popular: false,
      interviews: '10 interviews'
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      credits: 500,
      price: 19.99,
      popular: true,
      interviews: '25 interviews',
      savings: '20% OFF'
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      credits: 1000,
      price: 34.99,
      popular: false,
      interviews: '50 interviews',
      savings: '30% OFF'
    }
  ];

  const handlePurchase = async () => {
    if (!selectedPack) return;
    
    setProcessing(true);
    // TODO: Integrate Stripe payment here
    setTimeout(() => {
      setProcessing(false);
      onClose();
    }, 2000);
  };

  if (!show) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
      >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between border-b border-purple-500/30">
            <div className="flex items-center gap-3">
              <FaCoins className="text-3xl text-yellow-300" />
              <div>
                <h2 className="text-2xl font-bold text-white">Purchase AI Credits</h2>
                <p className="text-purple-100 text-sm">Current Balance: <span className="font-bold">{currentBalance} credits</span></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p className="text-blue-200 text-sm">
                <FaCheckCircle className="inline mr-2 text-blue-400" />
                <strong>How it works:</strong> Each AI-powered interview costs 10-20 credits depending on type. 
                Purchase credit packs to continue practicing with unlimited AI feedback!
              </p>
            </div>

            {/* Credit Packs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {creditPacks.map((pack) => (
                <motion.div
                  key={pack.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPack(pack)}
                  className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all ${
                    selectedPack?.id === pack.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800/50 hover:border-purple-500/50'
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
                    <div className="mb-3">
                      <span className="text-4xl font-extrabold text-purple-400">{pack.credits}</span>
                      <span className="text-gray-400 ml-2">credits</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${pack.price}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{pack.interviews}</p>
                    {pack.savings && (
                      <span className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
                        {pack.savings}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Payment Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={!selectedPack || processing}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  selectedPack && !processing
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaCreditCard />
                {processing ? 'Processing...' : selectedPack ? `Purchase ${selectedPack.credits} Credits` : 'Select a Pack'}
              </button>
            </div>
          </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default CreditPurchaseModal;
