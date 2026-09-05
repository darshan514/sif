import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const TREND_DATA = [
  { day: 'Mon', sif: 12, nonSif: 45 },
  { day: 'Tue', sif: 19, nonSif: 52 },
  { day: 'Wed', sif: 15, nonSif: 61 },
  { day: 'Thu', sif: 24, nonSif: 48 },
  { day: 'Fri', sif: 28, nonSif: 74 },
  { day: 'Sat', sif: 14, nonSif: 38 },
  { day: 'Sun', sif: 9, nonSif: 29 },
];

export const IncidentTrendChart = () => {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              Weekly Observation Trend
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              7-Day comparative volume
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-300">
          +14.2% Logged
        </span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSif" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5E3A" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="#FF5E3A" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNonSif" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '0.75rem',
                color: '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              }}
            />
            <Area type="monotone" dataKey="nonSif" name="Non-SIF" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNonSif)" />
            <Area type="monotone" dataKey="sif" name="SIF High Risk" stroke="#FF5E3A" fillOpacity={1} fill="url(#colorSif)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentTrendChart;
