import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreditsService from '../../services/CreditsService';

const CreditSuccessPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const sessionId = params.get('session_id');

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('Processing your payment...');
  const [attemptsLeft, setAttemptsLeft] = useState(15);

  useEffect(() => {
    let mounted = true;
    let interval;
    let initialBalance = null;

    const refresh = async () => {
      try {
        const resp = await CreditsService.getCredits();
        if (!mounted) return;
        // first fetch sets baseline
        if (initialBalance === null) {
          initialBalance = resp.balance;
          setBalance(resp.balance);
          setMessage('Waiting for payment confirmation...');
        } else {
          setBalance(resp.balance);
          // If balance increased, payment credited
          if (resp.balance > initialBalance) {
            setLoading(false);
            setMessage('Payment complete — your credits have been updated.');
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Error fetching credits:', err);
        setMessage('Waiting for payment confirmation. If this takes too long, you may close this page and check credits in the dashboard later.');
      }
    };

    // run immediately
    refresh();
    // then poll every 2s up to attemptsLeft times
    interval = setInterval(() => {
      setAttemptsLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          setLoading(false);
          setMessage('Payment processed; if your credits did not update, please refresh your dashboard later.');
        } else {
          refresh();
        }
        return next;
      });
    }, 2000);

    return () => { mounted = false; clearInterval(interval); };
  }, [sessionId]);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/5 p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Payment Success</h2>
        <p className="text-gray-300 mb-4">Thank you for your purchase. Session: <span className="text-sm text-gray-400">{sessionId || '—'}</span></p>

        <div className="mb-4">
          {loading ? (
            <div className="flex items-center justify-center gap-4">
              <div className="loader-border w-10 h-10 rounded-full border-4 border-white/10 border-t-purple-400 animate-spin" />
              <div className="text-gray-300">{message}</div>
            </div>
          ) : (
            <>
              <div className="text-lg text-gray-300">{message}</div>
              <div className="mt-4 text-3xl font-bold text-white">Balance: {balance ?? '—'} credits</div>
            </>
          )}
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg bg-white/5 text-white">Go to Dashboard</button>
          <button onClick={() => { window.location.reload(); }} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Refresh</button>
        </div>
      </div>
    </div>
  );
};

export default CreditSuccessPage;
