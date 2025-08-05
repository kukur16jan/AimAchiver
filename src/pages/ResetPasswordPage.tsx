import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!password || !confirm) {
      setError('Please fill in both fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://aim-achiever-backend.vercel.app/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Reset failed.');
      }
    } catch {
      setError('Server error.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200">
      <div className="relative w-full max-w-md p-8 border border-blue-100 shadow-2xl bg-white/90 rounded-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 mb-2 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M16 8v8l5 3" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="mb-1 text-2xl font-bold text-blue-700">Reset Your Password</h2>
          <p className="max-w-xs text-sm text-center text-gray-500">Enter your new password below. Make sure it's strong and secure!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-blue-50"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              minLength={6}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="p-2 text-sm text-red-600 rounded bg-red-50">{error}</div>}
          {success && <div className="p-2 text-sm text-green-700 rounded bg-green-50">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white rounded-lg shadow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="absolute left-0 right-0 flex justify-center -bottom-8">
          <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Aim Achiever</span>
        </div>
      </div>
    </div>
  );
}
