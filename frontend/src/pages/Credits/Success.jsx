import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import CreditsService from '../../services/CreditsService';
import { isAuthenticated } from '../../utils/auth';

const CreditSuccessPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const sessionId = params.get('session_id');

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('Processing your payment...');
  const [attemptsLeft, setAttemptsLeft] = useState(15);
  const [confirmed, setConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let mounted = true;
    let interval;
    let initialBalance = null;

    const refresh = async () => {
      try {
        // First try verify-session for immediate confirmation
        if (sessionId) {
          try {
            const verify = await fetch('/api/credits/verify-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) });
            const v = await verify.json();
            if (v && (v.status === 'credited' || v.status === 'already_credited')) {
              setBalance(v.balance);
              setLoading(false);
              setMessage('Payment confirmed — your credits have been updated.');
              setConfirmed(true);
              setCountdown(3);
              clearInterval(interval);
              return;
            }
          } catch (e) {
            // ignore verification errors and fall back to polling
          }
        }

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
            setConfirmed(true);
            setCountdown(3);
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

  // when confirmed, start countdown and navigate to homepage
  useEffect(() => {
    if (!confirmed) return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [confirmed, navigate]);

  // fallback: if we don't detect confirmation within 8s, redirect to homepage
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!confirmed) {
        navigate('/dashboard');
      }
    }, 8000);
    return () => clearTimeout(fallback);
  }, [confirmed, navigate]);

  const auth = isAuthenticated();

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/5 p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Payment Success</h2>
        <p className="text-gray-300 mb-4">Thank you for your purchase. Session: <span className="text-sm text-gray-400">{sessionId || '—'}</span></p>

        {!auth ? (
          <div className="mb-4">
            <div className="text-lg text-gray-300">You are not signed in.</div>
            <div className="text-sm text-gray-400 mt-2">Please <Link to={`/login?next=/credits/success?session_id=${sessionId || ''}`} className="text-purple-300 underline">sign in</Link> to claim your credits. After signing in, return to this page and click <strong>Refresh</strong>.</div>
            <div className="mt-4 text-sm text-gray-400">If you believe this is an error, contact support with your session ID.</div>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => navigate('/pricing')} className="px-6 py-3 rounded-lg bg-white/5 text-white">Back to Pricing</button>
              <button onClick={() => navigate('/login')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Sign in</button>
            </div>
          </div>
        ) : (
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
                {confirmed && (
                  <div className="mt-3 text-sm text-gray-400">Redirecting to dashboard in <span className="font-semibold text-white">{countdown}</span>s...</div>
                )}
              </>
            )}

            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg bg-white/5 text-white">Go to Dashboard</button>
              <button onClick={() => { window.location.reload(); }} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Refresh</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditSuccessPage;
