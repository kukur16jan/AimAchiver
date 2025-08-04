import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  user: unknown;
  loginWithGoogle: () => void;
};

const AuthPage = () => {
  const { login, register, user, loginWithGoogle } = useAuth() as AuthContextType;
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!user && url.pathname === '/' && !localStorage.getItem('aimAchiever_user')) {
      loginWithGoogle();
    }
  }, []);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMsg('Password reset email sent! Check your inbox.');
      } else {
        setForgotMsg(data.error || 'Error sending reset email');
      }
    } catch {
      setForgotMsg('Error sending reset email');
    }
    setForgotLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email/username or password');
        } else {
          setError('');
        }
      } else {
        const regError = await register(formData.name, formData.email, formData.password);
        if (regError) {
          setError(regError);
          alert(regError);
        } else {
          setError('');
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
        }
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        {showForgot ? (
          <div className="p-8 bg-white border border-blue-100 shadow-xl rounded-2xl animate-fade-in">
            <div className="flex flex-col items-center mb-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#6366f1"/><path d="M7 10.5V9a5 5 0 0 1 10 0v1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><rect x="5" y="10.5" width="14" height="8" rx="2" fill="#fff"/><path d="M12 15.5v.01" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/><path d="M9 13.5a3 3 0 0 1 6 0" stroke="#6366f1" strokeWidth="1.5"/></svg>
              <h2 className="mt-2 text-2xl font-bold text-blue-700">Forgot your password?</h2>
              <p className="mt-1 text-center text-gray-500">Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleForgot} className="mt-4 space-y-4">
              <input
                type="email"
                className="w-full px-4 py-3 text-lg transition-all border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter your email address"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 text-lg font-semibold text-white transition-all rounded-lg shadow disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={forgotLoading}
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              {forgotMsg && <div className="mt-2 text-base font-medium text-center text-blue-600 animate-fade-in">{forgotMsg}</div>}
            </form>
            <button className="w-full mt-6 text-blue-600 underline transition-all hover:text-blue-800" onClick={() => setShowForgot(false)}>
              &larr; Back to Login
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Aim Achiever
              </h1>
              <p className="mt-2 text-gray-600">
                Transform your goals into daily achievements
              </p>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? 'Sign in to continue your journey'
                  : 'Start your productivity journey today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full py-3 pl-10 pr-4 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-10 pr-4 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-10 pr-12 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                  {error}
                </div>
              )}

              <button
                type="button"
                className="w-full text-blue-600 underline"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="flex flex-col items-center mt-4">
              <span className="mb-2 text-gray-400">or</span>
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
                className="flex items-center gap-2 px-4 py-2 transition-all bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 h-5" />
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
