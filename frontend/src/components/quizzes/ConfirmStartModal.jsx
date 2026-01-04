import React, { useEffect, useState } from 'react';
import CreditsService from '../../services/CreditsService';

const ConfirmStartModal = ({ quiz, onConfirm, onCancel }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await CreditsService.getCredits();
        if (mounted) setBalance(res.balance);
      } catch (err) {
        console.error('Failed to fetch credits', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gradient-to-br from-white/3 to-white/5 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-white/5">
        <h3 className="text-lg font-semibold text-white mb-2">Start Premium Quiz</h3>
        <p className="text-gray-300 mb-4">This quiz costs <strong className="text-white">{quiz.creditCost}</strong> credits to reserve. Credits will be committed when you submit the quiz.</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="text-sm text-gray-300">Your current balance</div>
            <div className="mt-1 font-bold text-white">{balance ?? '—'} credits</div>
          </div>
          <div className={`px-3 py-2 rounded-full text-sm ${balance !== null && balance >= quiz.creditCost ? 'bg-green-600/20 text-green-200' : 'bg-rose-600/20 text-rose-200'}`}>{balance !== null && balance >= quiz.creditCost ? 'Sufficient' : 'Insufficient'}</div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
          <button onClick={onConfirm} disabled={loading || (balance !== null && balance < quiz.creditCost)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">Confirm & Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStartModal;