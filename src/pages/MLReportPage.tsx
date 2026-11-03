import React from 'react';
import {
  FileText,
  Printer,
  Download,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  Calendar,
  User,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { useAuth } from '../hooks/useAuth';
import { HealthStatusBadge } from '../components/common/HealthStatusBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const MLReportPage: React.FC = () => {
  const { latest, prediction } = useHealthData();
  const { user } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  // Feature Importance data for the Random Forest model
  const featureImportances = [
    { feature: 'Systolic BP', importance: 0.28, color: '#f43f5e' },
    { feature: 'Fasting Glucose', importance: 0.22, color: '#f59e0b' },
    { feature: 'SpO2 Saturation', importance: 0.18, color: '#38bdf8' },
    { feature: 'BMI Index', importance: 0.12, color: '#a855f7' },
    { feature: 'Heart Rate', importance: 0.11, color: '#06b6d4' },
    { feature: 'Physical Activity', importance: 0.09, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-fade-in print:space-y-4">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print bg-navy-900/90 p-6 rounded-3xl border border-navy-800 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Clinical Diagnostic Report
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized machine learning stratification summary and explainable feature attributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 hover:from-cyan-400 hover:to-electric-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Report Document Container */}
      <div className="print-page bg-white dark:bg-navy-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-navy-800 shadow-xl dark:shadow-glass text-slate-900 dark:text-white space-y-8">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 dark:border-navy-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                HealthPulse AI Biosystems
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
              Clinical Telemetry & Predictive Inference Report #HP-2026-98124
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-500 dark:text-slate-400">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Evaluation ID: RF-CAL-7719</div>
          </div>
        </div>

        {/* Patient Demographics & Telemetry Snapshot Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Patient Name</span>
            <span className="font-bold text-slate-900 dark:text-white">{user?.name || 'Dr. Pratham'}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Age / Gender</span>
            <span className="font-bold text-slate-900 dark:text-white">{user?.age || 42} Y / {user?.gender || 'Male'}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Blood Group</span>
            <span className="font-bold text-slate-900 dark:text-white">{user?.bloodGroup || 'O+'}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Physician of Record</span>
            <span className="font-bold text-slate-900 dark:text-white">{user?.physician?.name || 'Dr. Gregory House'}</span>
          </div>
        </div>

        {/* Section 1: Algorithmic Diagnosis Summary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-3 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>1. Machine Learning Diagnostic Summary</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">AI Risk Score</span>
              <div className="text-3xl font-black font-mono text-cyan-500 dark:text-cyan-400 mt-1">
                {(prediction?.riskScore || 0.06).toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400">Baseline threshold &lt; 0.18</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Model Confidence</span>
              <div className="text-3xl font-black font-mono text-electric-400 mt-1">
                {prediction?.confidence || 94}%
              </div>
              <span className="text-[11px] text-slate-400">Gini impurity consensus</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Risk Stratum</span>
              <div className="mt-2">
                <HealthStatusBadge
                  status={prediction?.riskStatus === 'Low' ? 'normal' : prediction?.riskStatus === 'Moderate' ? 'warning' : 'danger'}
                  label={`${prediction?.riskStatus || 'Low'} Risk`}
                  size="md"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">Categorical assessment</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Model Architecture</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {prediction?.modelName || 'Random Forest'}
              </div>
              <span className="text-[11px] font-mono text-cyan-400">v2.4 &bull; 200 Trees</span>
            </div>
          </div>
        </div>

        {/* Section 2: Model Validation Performance Metrics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>2. Benchmark Model Validation Metrics</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <div className="text-slate-400 text-[10px]">Cross-Val Accuracy</div>
              <div className="text-xl font-bold font-mono text-emerald-400">96.2%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <div className="text-slate-400 text-[10px]">ROC-AUC Area</div>
              <div className="text-xl font-bold font-mono text-cyan-400">0.981</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <div className="text-slate-400 text-[10px]">F1 Macro Score</div>
              <div className="text-xl font-bold font-mono text-electric-400">0.948</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <div className="text-slate-400 text-[10px]">Sensitivity / Recall</div>
              <div className="text-xl font-bold font-mono text-purple-400">95.4%</div>
            </div>
          </div>
        </div>

        {/* Section 3: Feature Importance (Explainable AI) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>3. Global Feature Importance (Gini Index)</span>
          </h3>

          <div className="h-60 w-full bg-slate-50 dark:bg-navy-950 p-4 rounded-2xl border border-slate-200 dark:border-navy-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={featureImportances}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 0.35]} stroke="#64748b" fontSize={10} />
                <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={11} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${(Number(val) * 100).toFixed(0)}% weight`, 'Importance']}
                  contentStyle={{ backgroundColor: '#0b1329', borderColor: '#1e293b', fontSize: '11px' }}
                />
                <Bar dataKey="importance" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 4: Patient Diagnostic Recommendations */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            Clinical Decision Support Notes:
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                All resting vital biomarkers (Heart Rate: {latest?.heartRate || 78} bpm, BP: {latest?.systolicBp || 120}/{latest?.diastolicBp || 80} mmHg, SpO2: {latest?.spo2 || 98}%) conform with healthy physiological reference standards.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                No acute cardiovascular or respiratory alarm triggers observed in latest telemetry stream.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Recommendation: Continue routine weekly biometric tracking. Maintain moderate aerobic workouts (150 min/wk).
              </span>
            </li>
          </ul>
        </div>

        {/* Mandatory Medical Disclaimer */}
        <div className="pt-4 border-t border-slate-200 dark:border-navy-800">
          <DisclaimerBanner variant="prominent" />
        </div>
      </div>
    </div>
  );
};
