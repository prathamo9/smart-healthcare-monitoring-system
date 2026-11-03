import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('pratham@healthpulse.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Dr. Pratham');

  const { loginWithGoogle, loginWithEmail, loginAsGuest, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      showToast('Authenticated via Google OAuth session successfully!', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to initialize Google authentication', 'error');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    try {
      await loginWithEmail(email);
      showToast(isRegister ? 'Account created successfully!' : 'Signed in successfully!', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Authentication error', 'error');
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      showToast('Logged in as Guest Clinician with demo records', 'info');
      navigate('/dashboard');
    } catch {
      showToast('Guest mode failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-glow-cyan transition-transform group-hover:scale-105">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-2xl tracking-tight text-white block">
              Health<span className="text-cyan-400">Pulse</span> AI
            </span>
            <span className="text-xs font-mono text-cyan-300/80 block">
              Smart Telemetry Gateway
            </span>
          </div>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-2xl dark:shadow-glass text-slate-900 dark:text-white">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isRegister ? 'Create Telemetry Account' : 'Clinician & Patient Access'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isRegister
              ? 'Join the AI-assisted smart healthcare network'
              : 'Sign in to access real-time vital streams and AI risk forecasts'}
          </p>
        </div>

        {/* 1. Google OAuth Simulation Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:bg-navy-800 dark:text-white dark:border-navy-700 dark:hover:bg-navy-750 font-semibold text-xs transition-all shadow-sm group active:scale-[0.99]"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-navy-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-white dark:bg-navy-900 px-3 text-slate-400">Or with email credentials</span>
          </div>
        </div>

        {/* 2. Credentials Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Smith"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.org"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 hover:from-cyan-400 hover:to-electric-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            <span>{isRegister ? 'Create Account' : 'Sign In with Credentials'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 3. One-Click Guest Access */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-800">
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-navy-950 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Instant Guest Demo Access</span>
          </button>
        </div>

        {/* Toggle Register / Sign In */}
        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>
            {isRegister ? 'Already registered for telemetry?' : "Don't have an account yet?"}{' '}
          </span>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-cyan-500 hover:text-cyan-400 font-semibold underline underline-offset-2 ml-1"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </div>
      </div>

      {/* Bottom Medical Notice */}
      <div className="max-w-md w-full mt-6 relative z-10">
        <DisclaimerBanner variant="inline" />
      </div>
    </div>
  );
};
