import React, { useRef, useEffect, useState } from 'react';
import { extractFaceEmbeddings } from '../../utils/faceRecognition';
import { motion } from 'framer-motion';

export const FaceScanner = ({ onCapture, label = 'Position Face Inside Oval', isMultiStep = false, stepNumber = 1 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });

        if (active) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasPermission(true);
        }
      } catch (err) {
        if (active) {
          console.error('Camera access error:', err);
          setErrorMsg('Camera permission denied or device camera unavailable.');
        }
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);

    setTimeout(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 300;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 300, 300);

      const result = extractFaceEmbeddings(canvas);
      setIsScanning(false);

      if (!result.hasFace) {
        if (onCapture) {
          onCapture(null, 'No human face detected in target oval. Please position your face inside the target.');
        }
        return;
      }

      if (onCapture) {
        onCapture(result.embedding, null);
      }
    }, 900);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Video Webcam Container */}
      <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-[#FF5E3A]/40 shadow-2xl bg-slate-900 flex items-center justify-center">
        
        {errorMsg ? (
          <div className="p-6 text-center text-xs text-red-400 space-y-2">
            <span className="material-symbols-outlined text-4xl text-red-500">videocam_off</span>
            <p className="font-bold">{errorMsg}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* Hidden Processing Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Oval Face Target Grid Overlay */}
            <div className="absolute inset-0 border-[3px] border-dashed border-[#FF5E3A]/60 rounded-full pointer-events-none flex items-center justify-center">
              <div className="w-48 h-60 border-2 border-white/80 rounded-[50%] opacity-75 shadow-inner" />
            </div>

            {/* Animated Laser Scanning Line */}
            {isScanning && (
              <motion.div
                initial={{ top: '10%' }}
                animate={{ top: '90%' }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5E3A] to-transparent shadow-[0_0_15px_#FF5E3A]"
              />
            )}
          </>
        )}
      </div>

      {/* Instructions & Step Info */}
      <div className="text-center space-y-1">
        {isMultiStep && (
          <span className="px-3 py-1 rounded-full bg-[#FF5E3A]/10 text-[#FF5E3A] text-[11px] font-extrabold uppercase tracking-wider">
            Biometric Angle {stepNumber} of 4
          </span>
        )}
        <h4 className="font-extrabold text-sm text-slate-900 mt-1">{label}</h4>
        <p className="text-xs text-slate-500 font-medium">Ensure your face is well-lit inside the oval target</p>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleScan}
        disabled={!hasPermission || isScanning}
        className="px-8 py-3.5 rounded-full bg-[#FF5E3A] hover:bg-[#ff4820] text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-base">center_focus_strong</span>
        <span>{isScanning ? 'Extracting Biometrics...' : 'Capture Biometric Frame'}</span>
      </button>

    </div>
  );
};

export default FaceScanner;
