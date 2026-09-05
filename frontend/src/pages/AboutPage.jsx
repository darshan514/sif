import React from 'react';
import { motion } from 'framer-motion';

export const AboutPage = () => {
  const techStack = [
    {
      name: 'React 19 & Vite',
      category: 'Frontend UI Framework',
      desc: 'Blazing fast single-page app architecture with modern component design and dynamic state hooks.',
      icon: 'code',
    },
    {
      name: 'FastAPI Backend',
      category: 'Python Async Server',
      desc: 'High-throughput ASGI server handling POST /predict endpoints with sub-150ms execution speed.',
      icon: 'dns',
    },
    {
      name: 'PyTorch & Transformers',
      category: 'Deep Learning Core',
      desc: 'Hugging Face PyTorch model engine running fine-tuned DistilBERT classification head.',
      icon: 'memory',
    },
    {
      name: 'Tailwind & Framer Motion',
      category: 'Styling & Micro-Animations',
      desc: 'Utility-first CSS styling paired with physics-based fluid transitions and glassmorphism elements.',
      icon: 'layers',
    },
  ];

  const futureScope = [
    {
      title: 'Batch CSV Analysis',
      desc: 'Ingest multi-thousand line historical CSV logs for automated site-wide SIF auditing.',
      icon: 'upload_file',
    },
    {
      title: 'Generative LLM Explanation',
      desc: 'Integrate LLMs to generate site-specific Root Cause Analysis (RCA) and corrective actions.',
      icon: 'psychology',
    },
    {
      title: 'Image-Based Hazard Detection',
      desc: 'Computer vision models analyzing CCTV feeds for PPE non-compliance and work at height breaches.',
      icon: 'photo_camera',
    },
    {
      title: 'Speech-to-Text Voice Logs',
      desc: 'Allow field engineers to dictate safety observation reports hands-free via mobile speech recognition.',
      icon: 'mic',
    },
    {
      title: 'IoT Sensor Integration',
      desc: 'Connect real-time gas detectors and wearable heart-rate monitors directly to the SIF early warning telemetry.',
      icon: 'sensors',
    },
    {
      title: 'Enterprise Multi-Site Dashboard',
      desc: 'Centralized global dashboard providing multi-refinery comparisons, benchmark KPIs, and automated regulatory filing.',
      icon: 'corporate_fare',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 py-24 max-w-5xl mx-auto px-6 text-left"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-full px-4 py-1.5 shadow-sm">
          <span className="material-symbols-outlined text-[#FF5E3A] text-sm">article</span>
          <span className="font-body-md text-xs font-semibold text-slate-800">
            Industrial Safety AI Whitepaper
          </span>
        </div>
        
        <h1 className="font-display-xl text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About SIF AI Architecture
        </h1>
        
        <p className="text-base text-slate-600 max-w-3xl">
          Learn how Serious Injury & Fatality precursor analysis combined with DistilBERT NLP transforms workplace safety across heavy industrial organizations.
        </p>
      </div>

      {/* Problem Statement & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="w-full bg-white/60 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 backdrop-blur-xl space-y-3">
          <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
          <h3 className="font-bold text-lg text-slate-900">Problem Statement</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Serious Injuries & Fatalities (SIF)</strong> represent critical, life-altering workplace events (falls from height, toxic gas release, electrical flash). Traditional safety reporting buries these high-hazard precursor signals under routine housekeeping logs.
          </p>
        </div>

        <div className="w-full bg-white/60 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 backdrop-blur-xl space-y-3">
          <span className="material-symbols-outlined text-3xl text-amber-500">crisis_alert</span>
          <h3 className="font-bold text-lg text-slate-900">Why SIF Prediction Matters</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            A <strong>SIF Precursor</strong> is a high-hazard situation where minor changes in circumstance or missing controls could lead directly to a fatality. Early AI identification allows safety teams to intervene before an incident occurs.
          </p>
        </div>

        <div className="w-full bg-white/60 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 backdrop-blur-xl space-y-3">
          <span className="material-symbols-outlined text-3xl text-[#FF5E3A]">auto_awesome</span>
          <h3 className="font-bold text-lg text-slate-900">How DistilBERT Works</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            DistilBERT is a lightweight transformer model (66M parameters). It tokenizes observation narratives and uses multi-head attention to detect subtle semantic risk patterns, outputting calibrated probability scores in real time.
          </p>
        </div>
      </div>

      {/* End-to-End Workflow Diagram */}
      <div className="w-full bg-white/60 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#FF5E3A] text-2xl">account_tree</span>
          <h2 className="font-display-xl text-xl font-extrabold text-slate-900">
            End-to-End System Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-center">
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-sm space-y-1">
            <span className="material-symbols-outlined text-[#FF5E3A]">description</span>
            <p className="font-extrabold text-xs text-slate-900">User Input</p>
            <p className="text-[10px] text-slate-500">Incident Narrative</p>
          </div>

          <div className="text-slate-400 font-bold text-lg hidden sm:block">↓</div>

          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-sm space-y-1">
            <span className="material-symbols-outlined text-blue-600">dns</span>
            <p className="font-extrabold text-xs text-slate-900">FastAPI</p>
            <p className="text-[10px] text-slate-500">POST /predict</p>
          </div>

          <div className="text-slate-400 font-bold text-lg hidden sm:block">↓</div>

          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-sm space-y-1">
            <span className="material-symbols-outlined text-purple-600">memory</span>
            <p className="font-extrabold text-xs text-slate-900">DistilBERT</p>
            <p className="text-[10px] text-slate-500">PyTorch NLP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center pt-2">
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-sm space-y-1">
            <span className="material-symbols-outlined text-amber-600">analytics</span>
            <p className="font-extrabold text-xs text-slate-900">Risk Classification</p>
            <p className="text-[10px] text-slate-500">SIF vs Non-SIF</p>
          </div>

          <div className="text-slate-400 font-bold text-lg hidden sm:block">↓</div>

          <div className="p-4 rounded-2xl bg-[#FF5E3A]/10 border border-[#FF5E3A]/30 shadow-sm space-y-1">
            <span className="material-symbols-outlined text-[#FF5E3A]">health_and_safety</span>
            <p className="font-extrabold text-xs text-slate-900">Safety Insights</p>
            <p className="text-[10px] text-slate-500">PPE, Actions & PDF</p>
          </div>
        </div>
      </div>

      {/* Technology Stack Specifications */}
      <div className="space-y-4">
        <h2 className="font-display-xl text-xl font-bold text-slate-900">
          Technology Stack Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {techStack.map((tech, idx) => (
            <div key={idx} className="w-full bg-white/60 rounded-3xl border border-white/80 p-5 backdrop-blur-xl flex items-start gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
              <div className="p-3 rounded-2xl bg-white border border-white/90 text-[#FF5E3A] shrink-0 shadow-sm">
                <span className="material-symbols-outlined">{tech.icon}</span>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{tech.name}</h4>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{tech.category}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Scope */}
      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5E3A]/10 text-[#FF5E3A] text-xs font-bold">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            <span>Platform Roadmap</span>
          </div>
          <h2 className="font-display-xl text-2xl font-extrabold text-slate-900">
            Future Scope & Enterprise Extensions
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Next-generation safety intelligence features designed for global energy and manufacturing operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {futureScope.map((item, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-white/60 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default AboutPage;

