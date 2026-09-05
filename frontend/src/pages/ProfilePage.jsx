import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePredictions } from '../context/PredictionContext';
import { motion } from 'framer-motion';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser, isSafetyOfficer, logout } = useAuth();
  const { history } = usePredictions();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const myHistory = isSafetyOfficer ? history : history;
  const totalReports = myHistory.length;
  const sifCount = myHistory.filter(h => h.prediction === 'SIF').length;

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, name, department, phone });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-24 max-w-4xl mx-auto px-6 text-left space-y-8"
    >
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display-xl text-2xl sm:text-3xl font-extrabold text-slate-900">
                {user?.name || 'User Profile'}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                isSafetyOfficer
                  ? 'bg-[#FF5E3A]/10 text-[#FF5E3A] border-[#FF5E3A]/30'
                  : 'bg-blue-500/10 text-blue-800 border-blue-300'
              }`}>
                {isSafetyOfficer ? '🛡 Safety Officer' : '👷 Employee'}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {user?.email} • Joined SIF AI Enterprise Platform
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="px-5 py-2.5 rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Logout</span>
        </button>
      </div>

      {/* User Information Card */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF5E3A]">badge</span>
            <span>Enterprise Identity Details</span>
          </h3>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 shadow-sm"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FF5E3A] text-white font-extrabold text-xs shadow-md"
            >
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Identity Role</span>
              <p className="font-extrabold text-sm text-slate-900">{isSafetyOfficer ? 'Safety Officer' : 'Employee'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                {isSafetyOfficer ? 'Safety Officer ID' : 'Employee ID'}
              </span>
              <p className="font-mono font-extrabold text-sm text-slate-900">
                {isSafetyOfficer ? (user?.officerId || 'SO-108') : (user?.employeeId || 'EMP-9042')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Department</span>
              <p className="font-extrabold text-sm text-slate-900">{user?.department || 'Industrial Safety Ops'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                {isSafetyOfficer ? 'Designation Title' : 'Company'}
              </span>
              <p className="font-extrabold text-sm text-slate-900">
                {isSafetyOfficer ? (user?.designation || 'Chief Safety Inspector') : (user?.company || 'OIL / ONGC')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Phone Number</span>
              <p className="font-extrabold text-sm text-slate-900">{user?.phone || '+91 98765 43210'}</p>
            </div>

            {isSafetyOfficer && (
              <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Biometric Face Status</span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 font-extrabold text-[11px] border border-emerald-300">
                    ✓ Face Registered
                  </span>
                  <button
                    onClick={() => navigate('/face-register')}
                    className="text-[11px] font-bold text-[#FF5E3A] hover:underline"
                  >
                    Re-scan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activity Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-white/60 border border-white/80 backdrop-blur-xl shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Activity Summary</span>
          <p className="text-2xl font-extrabold text-slate-900">{totalReports} Reports Logged</p>
          <p className="text-xs text-slate-600 font-medium">Total safety observations submitted across shifts</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/60 border border-white/80 backdrop-blur-xl shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SIF Risk Findings</span>
          <p className="text-2xl font-extrabold text-red-600">{sifCount} High Risk Logs</p>
          <p className="text-xs text-slate-600 font-medium">Critical hazard precursor observations identified</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
