import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreditCancelPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/5 p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Payment Canceled</h2>
        <p className="text-gray-300 mb-4">Your payment was canceled or not completed. No charges were made.</p>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={() => navigate('/pricing')} className="px-6 py-3 rounded-lg bg-white/5 text-white">Back to Pricing</button>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default CreditCancelPage;
