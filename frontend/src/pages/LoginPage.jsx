import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [activeRole, setActiveRole] = useState('worker'); // 'worker' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg(null);
    try {
      const loggedUser = await login(email, password, activeRole);
      if (loggedUser.role === 'safety_officer' || loggedUser.role === 'admin') {
        navigate('/officer-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authenticate. Please check credentials.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-24 max-w-md mx-auto px-6 text-left"
    >
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5E3A]/10 text-[#FF5E3A] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h1 className="font-display-xl text-2xl font-extrabold text-slate-900">
            Enterprise Portal Login
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to access your SIF AI safety workbench
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl text-xs font-extrabold">
          <button
            type="button"
            onClick={() => { setActiveRole('worker'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'worker' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">engineering</span>
            <span>Employee</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('admin'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'admin' ? 'bg-[#FF5E3A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">shield_person</span>
            <span>Safety Officer</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Biometric Face Recognition Button for Safety Officers */}
        {activeRole === 'admin' && (
          <div className="p-4 rounded-2xl bg-[#FF5E3A]/10 border border-[#FF5E3A]/30 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-slate-900">
              <span className="material-symbols-outlined text-[#FF5E3A]">face_3</span>
              <span>Biometric Security Authentication</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/face-login')}
              className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">center_focus_strong</span>
              <span>Login using Face Recognition</span>
            </button>
          </div>
        )}

        {/* Email & Password Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Work Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeRole === 'admin' ? 'officer@sif.ai' : 'worker@sif.ai'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5E3A]/40 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-[#FF5E3A] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                key
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5E3A]/40 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-[#FF5E3A] hover:bg-[#ff4820] text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Logging In...' : `Login as ${activeRole === 'admin' ? 'Safety Officer' : 'Employee'}`}</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-200/60 text-center text-xs text-slate-500 font-medium">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="font-bold text-[#FF5E3A] hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default LoginPage;
