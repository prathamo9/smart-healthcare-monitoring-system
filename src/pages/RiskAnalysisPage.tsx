import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Heart,
  Droplet,
  Wind,
  Flame,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { HealthStatusBadge } from '../components/common/HealthStatusBadge';
import { calculateAIRiskPrediction } from '../utils/healthCalculators';

export const RiskAnalysisPage: React.FC = () => {
  const { latest, prediction } = useHealthData();

  // What-If Simulator state initialized from current patient vitals
  const [simBp, setSimBp] = useState<number>(latest ? latest.systolicBp : 120);
  const [simGlucose, setSimGlucose] = useState<number>(latest ? latest.glucose : 95);
  const [simHr, setSimHr] = useState<number>(latest ? latest.heartRate : 78);
  const [simActivity, setSimActivity] = useState<any>(latest ? latest.physicalActivity : 'moderate');
  const [simSmoking, setSimSmoking] = useState<any>(latest ? latest.smoking : 'never');

  const simulatedPrediction = calculateAIRiskPrediction({
    heartRate: simHr,
    systolicBp: simBp,
    diastolicBp: 80,
    spo2: 98,
    temperature: 36.7,
    glucose: simGlucose,
    bmi: 23.0,
    smoking: simSmoking,
    alcohol: 'none',
    physicalActivity: simActivity,
  });

  // Radar chart data comparing baseline vs simulated/optimal
  const radarData = React.useMemo(() => {
    const scores = prediction?.radarScores || {
      cardiovascular: 88,
      metabolic: 92,
      respiratory: 96,
      lifestyle: 85,
      thermal: 98,
      autonomic: 90,
    };

    const simScores = simulatedPrediction.radarScores;

    return [
      { subject: 'Cardiovascular', current: scores.cardiovascular, simulated: simScores.cardiovascular, fullMark: 100 },
      { subject: 'Metabolic', current: scores.metabolic, simulated: simScores.metabolic, fullMark: 100 },
      { subject: 'Respiratory', current: scores.respiratory, simulated: simScores.respiratory, fullMark: 100 },
      { subject: 'Lifestyle', current: scores.lifestyle, simulated: simScores.lifestyle, fullMark: 100 },
      { subject: 'Thermal', current: scores.thermal, simulated: simScores.thermal, fullMark: 100 },
      { subject: 'Autonomic', current: scores.autonomic, simulated: simScores.autonomic, fullMark: 100 },
    ];
  }, [prediction, simulatedPrediction]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="bg-navy-900/90 p-6 rounded-3xl border border-navy-800 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Multi-System Clinical Risk Stratification
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic decomposition of cardiovascular, metabolic, pulmonary, and autonomic risk
            vectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <HealthStatusBadge
            status={
              prediction?.riskStatus === 'Low'
                ? 'normal'
                : prediction?.riskStatus === 'Moderate'
                ? 'warning'
                : 'danger'
            }
            label={`${prediction?.riskStatus || 'Low'} Risk Classification`}
            size="md"
          />
        </div>
      </div>

      {/* Grid: Radar Analysis (5 cols) & System Breakdown (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Radar Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-navy-900/90 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Systemic Health Radar</h3>
              <p className="text-xs text-slate-400">Baseline vs What-If Simulator (0-100)</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-navy-950 px-2 py-1 rounded-md border border-navy-800">
              6-Axis Hexagon
            </span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar
                  name="Current Vitals"
                  dataKey="current"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.4}
                />
                <Radar
                  name="What-If Simulator"
                  dataKey="simulated"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1329',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Current Health</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Simulated Target</span>
            </div>
          </div>
        </div>

        {/* 4 Organ-System Risk Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Cardiovascular Risk */}
          <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Cardiovascular Health Index</h4>
                  <span className="text-xs text-slate-400 font-mono">
                    BP {latest?.systolicBp || 120}/{latest?.diastolicBp || 80} mmHg &bull; HR{' '}
                    {latest?.heartRate || 78} bpm
                  </span>
                </div>
              </div>
              <HealthStatusBadge status="normal" label="Low Risk" size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Arterial compliance and resting pulsatile index indicate minimal risk of atherosclerotic
              or ischemic events over a 5-year longitudinal trajectory.
            </p>
          </div>

          {/* 2. Metabolic Risk */}
          <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Metabolic & Glycemic Regulation</h4>
                  <span className="text-xs text-slate-400 font-mono">
                    Glucose {latest?.glucose || 95} mg/dL &bull; BMI {latest?.bmi || 23.0}
                  </span>
                </div>
              </div>
              <HealthStatusBadge status="normal" label="Optimal" size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Fasting blood sugar is maintained within the ideal non-diabetic range (&lt;100 mg/dL).
              Insulin sensitivity index aligns with favorable metabolic longevity.
            </p>
          </div>

          {/* 3. Pulmonary / Respiratory */}
          <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Respiratory Oxygenation Reserve</h4>
                  <span className="text-xs text-slate-400 font-mono">
                    SpO2 {latest?.spo2 || 98}% &bull; Temp {latest?.temperature || 36.7}°C
                  </span>
                </div>
              </div>
              <HealthStatusBadge status="normal" label="Normal" size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Peripheral capillary oxygenation exhibits steady alveolar diffusion without signs of
              restrictive or obstructive hypoxemia.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive "What-If" Health Risk Simulator */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                "What-If" Lifestyle & Clinical Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Adjust lifestyle interventions to simulate predictive changes in your overall AI risk score.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Simulated Score:</span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {simulatedPrediction.riskScore.toFixed(2)}
            </span>
            <HealthStatusBadge
              status={
                simulatedPrediction.riskStatus === 'Low'
                  ? 'normal'
                  : simulatedPrediction.riskStatus === 'Moderate'
                  ? 'warning'
                  : 'danger'
              }
              label={simulatedPrediction.riskStatus}
              size="sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
          {/* Slider 1: Systolic BP */}
          <div className="bg-navy-950/70 p-4 rounded-2xl border border-navy-800">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-300 font-semibold">Systolic BP</span>
              <span className="font-mono text-cyan-400 font-bold">{simBp} mmHg</span>
            </div>
            <input
              type="range"
              min="90"
              max="170"
              value={simBp}
              onChange={(e) => setSimBp(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-navy-800 h-2 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Optimal: 110-120</span>
          </div>

          {/* Slider 2: Glucose */}
          <div className="bg-navy-950/70 p-4 rounded-2xl border border-navy-800">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-300 font-semibold">Fasting Glucose</span>
              <span className="font-mono text-amber-400 font-bold">{simGlucose} mg/dL</span>
            </div>
            <input
              type="range"
              min="70"
              max="180"
              value={simGlucose}
              onChange={(e) => setSimGlucose(Number(e.target.value))}
              className="w-full accent-amber-400 bg-navy-800 h-2 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Optimal: 70-99</span>
          </div>

          {/* Select: Physical Activity */}
          <div className="bg-navy-950/70 p-4 rounded-2xl border border-navy-800">
            <span className="text-xs text-slate-300 font-semibold block mb-2">
              Physical Exercise
            </span>
            <select
              value={simActivity}
              onChange={(e) => setSimActivity(e.target.value)}
              className="w-full p-2 text-xs rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none"
            >
              <option value="sedentary">Sedentary (&lt;30 min/wk)</option>
              <option value="light">Light (30-90 min/wk)</option>
              <option value="moderate">Moderate (90-150 min/wk)</option>
              <option value="high">High (&gt;150 min/wk)</option>
            </select>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Reduces risk by up to -0.05
            </span>
          </div>

          {/* Select: Smoking Status */}
          <div className="bg-navy-950/70 p-4 rounded-2xl border border-navy-800">
            <span className="text-xs text-slate-300 font-semibold block mb-2">Smoking Status</span>
            <select
              value={simSmoking}
              onChange={(e) => setSimSmoking(e.target.value)}
              className="w-full p-2 text-xs rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none"
            >
              <option value="never">Non-Smoker (Never)</option>
              <option value="former">Former Smoker</option>
              <option value="occasional">Occasional Smoker</option>
              <option value="daily">Daily Smoker</option>
            </select>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Smoking elevates risk by +0.18
            </span>
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="bg-navy-950/40 p-4 rounded-2xl border border-navy-800/80">
          <span className="text-xs font-bold text-white block mb-2">
            Targeted Preventive Recommendations:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
            {simulatedPrediction.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 bg-navy-900/60 p-2.5 rounded-xl border border-navy-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="inline" />
    </div>
  );
};
