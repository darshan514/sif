import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-24 max-w-md mx-auto px-6 text-left"
    >
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5E3A]/10 text-[#FF5E3A] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">key</span>
          </div>
          <h1 className="font-display-xl text-2xl font-extrabold text-slate-900">
            Reset Work Password
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Enter your enterprise email to receive password recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-300 text-emerald-950 text-center space-y-3">
            <span className="material-symbols-outlined text-3xl text-emerald-600">mark_email_read</span>
            <h4 className="font-extrabold text-sm text-slate-900">Recovery Email Sent!</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We sent a password reset link to <code className="font-mono text-slate-900 font-bold">{email}</code>. Please check your inbox.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 px-6 py-2.5 rounded-full bg-slate-900 text-white font-extrabold text-xs"
            >
              Return to Login
            </Link>
          </div>
        ) : (
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
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5E3A]/40"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#FF5E3A] hover:bg-[#ff4820] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Send Recovery Link</span>
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-200/60 text-center text-xs text-slate-500 font-medium">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-[#FF5E3A] hover:underline">
            Back to login
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
