import { motion } from 'framer-motion';
import { FaCoins, FaShoppingCart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCredits } from '../../redux/slices/creditsSlice';
import CreditPurchaseModal from './CreditPurchaseModal';

const CreditsBadge = () => {
  const dispatch = useDispatch();
  const { balance, showLowBalanceWarning } = useSelector((state) => state.credits);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCredits());
    }
  }, [dispatch, isAuthenticated]);

  const isLowBalance = balance <= 20;

  const handleClick = () => {
    setShowPurchaseModal(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
          isLowBalance
            ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
        }`}
      >
        <FaCoins className="text-yellow-300 text-lg" />
        <span className="text-white font-bold">{balance}</span>
        {isLowBalance && (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-xs text-white"
          >
            Low!
          </motion.span>
        )}
        <FaShoppingCart className="text-white text-sm ml-1" />
      </motion.div>

      <CreditPurchaseModal
        show={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        currentBalance={balance}
      />
    </>
  );
};

export default CreditsBadge;
