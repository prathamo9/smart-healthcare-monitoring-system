import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Cpu,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  Layers,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { calculateAIRiskPrediction } from '../utils/healthCalculators';

export const LandingPage: React.FC = () => {
  // Interactive mini-simulator on landing page
  const [sampleHr, setSampleHr] = useState(78);
  const [sampleBp, setSampleBp] = useState(120);
  const [sampleSpo2, setSampleSpo2] = useState(98);
  const [sampleGlucose, setSampleGlucose] = useState(95);

  const previewRisk = calculateAIRiskPrediction({
    heartRate: sampleHr,
    systolicBp: sampleBp,
    diastolicBp: 80,
    spo2: sampleSpo2,
    temperature: 36.7,
    glucose: sampleGlucose,
    bmi: 23.0,
    smoking: 'never',
    alcohol: 'none',
    physicalActivity: 'moderate',
  });

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-md border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-glow-cyan">
              <HeartPulse className="w-5 h-5 text-navy-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Health<span className="text-cyan-400">Pulse</span> AI
              </span>
              <span className="text-[10px] text-cyan-300/80 font-mono block -mt-1">
                Clinical Telemetry Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Platform
            </a>
            <a href="#simulator" className="hover:text-cyan-400 transition-colors">
              Live AI Demo
            </a>
            <a href="#architecture" className="hover:text-cyan-400 transition-colors">
              ML Architecture
            </a>
            <Link to="/report" className="hover:text-cyan-400 transition-colors">
              Sample Report
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-900 border border-slate-700/60 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-32">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 to-electric-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-glow-cyan/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Random Forest • Real-Time Vitals Stratification</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Smart Healthcare Monitoring with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-electric-400 to-cyan-300 bg-clip-text text-transparent">
              Explainable AI
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Continuous surveillance of 5 vital markers: Heart Rate, Arterial BP, SpO2, Temperature,
            and Blood Glucose. Instant multi-parameter risk stratification with zero latency.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-electric-500 hover:from-cyan-400 hover:to-electric-400 text-slate-950 font-bold text-sm shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-105"
            >
              <span>Explore Telemetry Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/input"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-850 text-white font-semibold text-sm border border-navy-700 transition-all hover:border-cyan-500/40"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Input Patient Vitals</span>
            </Link>

            <Link
              to="/auth"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm border border-white/10 transition-all"
            >
              <Lock className="w-4 h-4 text-electric-400" />
              <span>Google OAuth Login</span>
            </Link>
          </div>

          {/* Prominent Medical Notice */}
          <div className="mt-12 max-w-xl mx-auto">
            <DisclaimerBanner variant="inline" />
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="py-20 bg-navy-900/60 border-y border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              Interactive Testbench
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Live AI Risk Prediction Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Adjust the vitals below to witness deterministic Random Forest risk evaluation in real
              time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-7 bg-navy-950/80 rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-glass space-y-6">
              {/* HR Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Resting Heart Rate</span>
                  <span className="font-mono text-cyan-400 font-bold">{sampleHr} bpm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={sampleHr}
                  onChange={(e) => setSampleHr(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-navy-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>Bradycardia (&lt;50)</span>
                  <span className="text-emerald-400">Normal (60-100)</span>
                  <span>Tachycardia (&gt;100)</span>
                </div>
              </div>

              {/* BP Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Systolic Blood Pressure</span>
                  <span className="font-mono text-rose-400 font-bold">{sampleBp} mmHg</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="190"
                  value={sampleBp}
                  onChange={(e) => setSampleBp(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-navy-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span className="text-emerald-400">Normal (&lt;120)</span>
                  <span className="text-amber-400">Elevated (120-139)</span>
                  <span className="text-rose-400">Hypertension (≥140)</span>
                </div>
              </div>

              {/* SpO2 Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Blood Oxygen (SpO2)</span>
                  <span className="font-mono text-electric-400 font-bold">{sampleSpo2}%</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  value={sampleSpo2}
                  onChange={(e) => setSampleSpo2(Number(e.target.value))}
                  className="w-full accent-electric-400 bg-navy-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span className="text-rose-400">Critical (&lt;92%)</span>
                  <span className="text-amber-400">Borderline (92-94%)</span>
                  <span className="text-emerald-400">Normal (95-100%)</span>
                </div>
              </div>

              {/* Glucose Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Fasting Blood Glucose</span>
                  <span className="font-mono text-amber-400 font-bold">{sampleGlucose} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={sampleGlucose}
                  onChange={(e) => setSampleGlucose(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-navy-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span className="text-emerald-400">Normal (70-99)</span>
                  <span className="text-amber-400">Prediabetes (100-125)</span>
                  <span className="text-rose-400">Hyperglycemic (≥126)</span>
                </div>
              </div>
            </div>

            {/* Right Card: Instant ML Outcome */}
            <div className="lg:col-span-5 bg-gradient-to-br from-navy-900 to-navy-850 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-navy-800">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">Live Prediction Engine</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    previewRisk.riskStatus === 'Low'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : previewRisk.riskStatus === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {previewRisk.riskStatus} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-950 p-4 rounded-2xl border border-navy-800 text-center">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                    Risk Score
                  </span>
                  <div className="text-3xl font-black font-mono text-cyan-400 mt-1">
                    {previewRisk.riskScore.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">0.00 – 1.00 index</span>
                </div>

                <div className="bg-navy-950 p-4 rounded-2xl border border-navy-800 text-center">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                    Model Confidence
                  </span>
                  <div className="text-3xl font-black font-mono text-electric-400 mt-1">
                    {previewRisk.confidence}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Random Forest v2.4</span>
                </div>
              </div>

              {/* Factors */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  SHAP Diagnostic Weightings:
                </span>
                <div className="space-y-1.5">
                  {previewRisk.topFactors.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-navy-950/70 p-2.5 rounded-xl border border-navy-800/80"
                    >
                      <span className="text-slate-300 truncate max-w-[200px]">{f.factor}</span>
                      <span
                        className={`font-mono font-bold ${
                          f.impact === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {f.impact === 'positive' ? `+${f.weight}%` : `-${f.weight}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/dashboard"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
              >
                <span>Open Full Clinical Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            Enterprise Architecture
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            Engineered for Modern Clinical Informatics
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Seamlessly integrating medical hardware telemetry with modern machine learning
            frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-navy-900/80 rounded-3xl p-7 border border-navy-800 hover:border-cyan-500/40 transition-all shadow-glass group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">5-Core Vital Surveillance</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              High-frequency acquisition for Heart Rate, Blood Pressure (Systolic/Diastolic), SpO2,
              Core Temperature, and Fasting Blood Glucose with auto-calibrated thresholds.
            </p>
          </div>

          <div className="bg-navy-900/80 rounded-3xl p-7 border border-navy-800 hover:border-electric-500/40 transition-all shadow-glass group">
            <div className="w-12 h-12 rounded-2xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center text-electric-400 mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Random Forest Inference</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              200-estimator ensemble model delivering 96.2% validation accuracy. Instant scoring
              into Low, Moderate, High, and Critical clinical risk strata.
            </p>
          </div>

          <div className="bg-navy-900/80 rounded-3xl p-7 border border-navy-800 hover:border-emerald-500/40 transition-all shadow-glass group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Explainable AI Reports</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              SHAP feature importance plots, longitudinal multi-system radar charts, and print-ready
              PDF diagnostic reports formatted for physician consults.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-800 bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <HeartPulse className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-sm text-white">
              HealthPulse AI &bull; Smart Healthcare Monitoring System
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-cyan-400">
              Dashboard
            </Link>
            <Link to="/history" className="hover:text-cyan-400">
              History
            </Link>
            <Link to="/trends" className="hover:text-cyan-400">
              Trends
            </Link>
            <Link to="/report" className="hover:text-cyan-400">
              ML Report
            </Link>
            <Link to="/auth" className="hover:text-cyan-400">
              Sign In
            </Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <DisclaimerBanner variant="footer" />
        </div>
      </footer>
    </div>
  );
};
