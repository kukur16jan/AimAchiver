import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AcceptPeerPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`https://aim-achiever-backend.vercel.app/api/peers/accept/${token}`)
      .then(async res => {
        if (res.redirected) {
          setStatus('success');
          setMessage('Peer invitation accepted! Redirecting to your peers page...');
          setTimeout(() => navigate('/peers'), 2000);
        } else if (res.ok) {
          setStatus('success');
          setMessage('Peer invitation accepted! Redirecting to your peers page...');
          setTimeout(() => navigate('/peers'), 2000);
        } else {
          const data = await res.json();
          setStatus('error');
          setMessage(data.message || 'Invalid or expired invitation.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Server error. Please try again later.');
      });
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200">
      <div className="flex flex-col items-center w-full max-w-md p-8 border border-blue-100 shadow-2xl bg-white/90 rounded-2xl">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M10 16l4 4 8-8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-blue-700">Peer Invitation</h2>
        <p className="mb-4 text-center text-gray-600">
          {status === 'pending' && 'Accepting your invitation...'}
          {status === 'success' && message}
          {status === 'error' && <span className="text-red-600">{message}</span>}
        </p>
        {status === 'success' && <div className="font-semibold text-green-600">Success!</div>}
        {status === 'error' && <div className="font-semibold text-red-600">Failed</div>}
      </div>
    </div>
  );
}
