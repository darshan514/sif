import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FaceScanner from '../components/auth/FaceScanner';
import { motion } from 'framer-motion';

const ANGLE_INSTRUCTIONS = [
  'Look Straight Ahead at the Camera',
  'Turn Face Slightly to the Left',
  'Turn Face Slightly to the Right',
  'Tilt Head Slightly Upward',
];

export const FaceRegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, registerFace } = useAuth();

  const officerId = location.state?.officerId || user?.officerId || 'SO-108';

  const [currentStep, setCurrentStep] = useState(1);
  const [collectedVectors, setCollectedVectors] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCaptureStep = async (embeddings, err) => {
    if (err || !embeddings || embeddings.length === 0) {
      setErrorMsg(err || 'No human face detected in target oval. Please position your face inside the target.');
      return;
    }

    setErrorMsg(null);
    const newVectors = [...collectedVectors, embeddings];
    setCollectedVectors(newVectors);

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate averaged embedding vector
      const vectorLen = newVectors[0].length;
      const averaged = new Array(vectorLen).fill(0);

      for (let i = 0; i < vectorLen; i++) {
        let sum = 0;
        for (let v = 0; v < newVectors.length; v++) {
          sum += newVectors[v][i];
        }
        averaged[i] = sum / newVectors.length;
      }

      try {
        await registerFace(officerId, averaged);
        setIsDone(true);
        setTimeout(() => {
          navigate('/officer-dashboard');
        }, 1800);
      } catch (err) {
        setErrorMsg('Failed to store facial biometrics. Please retry.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-24 max-w-xl mx-auto px-6 text-left"
    >
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5E3A]/10 text-[#FF5E3A] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">face_3</span>
          </div>
          <h1 className="font-display-xl text-2xl font-extrabold text-slate-900">
            Safety Officer Biometric Face Setup
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Registering Officer ID: <span className="font-mono font-bold text-slate-900">{officerId}</span>
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Biometric Registration Progress</span>
            <span>{currentStep} / 4 Steps</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full bg-[#FF5E3A] rounded-full"
              initial={{ width: '25%' }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {isDone ? (
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-300 text-emerald-950 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Biometric Profile Created!</h3>
            <p className="text-xs text-slate-600 font-medium">
              Facial embeddings stored securely. Redirecting to Safety Officer Executive Dashboard...
            </p>
          </div>
        ) : (
          <FaceScanner
            onCapture={handleCaptureStep}
            label={ANGLE_INSTRUCTIONS[currentStep - 1]}
            isMultiStep={true}
            stepNumber={currentStep}
          />
        )}

      </div>
    </motion.div>
  );
};

export default FaceRegisterPage;
