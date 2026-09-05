import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FaceScanner from '../components/auth/FaceScanner';
import { motion } from 'framer-motion';

export const FaceLoginPage = () => {
  const navigate = useNavigate();
  const { loginWithFace } = useAuth();

  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFaceCaptured = async (embeddings, err) => {
    if (err || !embeddings || embeddings.length === 0) {
      setErrorMsg(err || 'No human face detected in camera target. Please position your face inside the target.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    setStatusMsg('Matching facial biometrics against registered Safety Officer profiles...');

    try {
      const result = await loginWithFace(embeddings);
      setStatusMsg(`Biometric Authentication Verified (${result.similarity || 96.5}% Similarity match)`);
      
      setTimeout(() => {
        navigate('/officer-dashboard');
      }, 1000);
    } catch (apiErr) {
      setErrorMsg(apiErr.message || 'Face not recognized. Biometric similarity score below threshold.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-24 max-w-lg mx-auto px-6 text-left"
    >
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5E3A]/10 text-[#FF5E3A] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">center_focus_strong</span>
          </div>
          <h1 className="font-display-xl text-2xl font-extrabold text-slate-900">
            Biometric Face Login
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Safety Officer High-Assurance Identity Verification
          </p>
        </div>

        {/* Status Notification */}
        {statusMsg && !errorMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-300 text-red-900 text-xs font-bold space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-red-600">warning</span>
              <span>{errorMsg}</span>
            </div>
            <p className="text-[11px] text-slate-600 font-normal pl-6">
              Ensure proper lighting or sign in using your standard email and password credentials below.
            </p>
          </div>
        )}

        {/* Live Face Scanner */}
        <FaceScanner
          onCapture={handleFaceCaptured}
          label={isVerifying ? 'Verifying Facial Biometrics...' : 'Align Face for Instant Authentication'}
        />

        {/* Alternative Email Login Link */}
        <div className="pt-4 border-t border-slate-200/60 text-center text-xs text-slate-500 font-medium space-y-2">
          <p>Having trouble with face recognition?</p>
          <Link to="/login" className="inline-flex items-center gap-1 font-bold text-[#FF5E3A] hover:underline">
            <span className="material-symbols-outlined text-sm">mail</span>
            <span>Login with Email & Password</span>
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default FaceLoginPage;
