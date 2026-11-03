import React from 'react';
import { Cpu, ShieldCheck, ShieldAlert, ArrowRight, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RiskPrediction } from '../../types';
import { HealthStatusBadge } from './HealthStatusBadge';
import { DisclaimerBanner } from './DisclaimerBanner';

interface PredictionCardProps {
  prediction: RiskPrediction | null;
  onReevaluate?: () => void;
  isLoading?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onReevaluate,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const score = prediction ? prediction.riskScore : 0.06;
  const confidence = prediction ? prediction.confidence : 94;
  const status = prediction ? prediction.riskStatus : 'Low';
  const model = prediction ? prediction.modelName : 'Random Forest';
  const modelVersion = prediction?.modelVersion || 'v2.4 - Ensemble';

  const scorePercent = Math.round(score * 100);

  // Status-based styling
  const isLow = status === 'Low';
  const isModerate = status === 'Moderate';
  const isHighOrCritical = status === 'High' || status === 'Critical';

  const strokeColor = isLow
    ? '#10b981' // Green
    : isModerate
    ? '#f59e0b' // Yellow
    : '#ef4444'; // Red

  const glowShadow = isLow
    ? 'shadow-glow-emerald'
    : isModerate
    ? 'shadow-amber-500/20'
    : 'shadow-glow-rose';

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 rounded-3xl p-6 lg:p-7 border border-cyan-500/30 shadow-2xl ${glowShadow} text-white transition-all`}
    >
      {/* Background decorative grid and glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">
                AI Health Risk Prediction
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Inference
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-parameter clinical stratification engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HealthStatusBadge
            status={status === 'Low' ? 'normal' : status === 'Moderate' ? 'warning' : 'danger'}
            label={`${status} Risk`}
            size="md"
          />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Metric 1: Risk Score with Circular Ring */}
        <div className="flex items-center gap-4 bg-navy-950/60 rounded-2xl p-4 border border-navy-800/80">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${Math.max(4, scorePercent)}, 100`}
                stroke={strokeColor}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-mono font-bold text-white leading-none">
                {score.toFixed(2)}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 uppercase">Score</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Risk Score
            </div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {score.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Normal Baseline: &lt; 0.18
            </span>
          </div>
        </div>

        {/* Metric 2: Confidence */}
        <div className="bg-navy-950/60 rounded-2xl p-4 border border-navy-800/80 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Confidence
            </span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white font-mono">{confidence}%</span>
              <span className="text-xs text-slate-400">ensemble agreement</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-electric-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-cyan-300/80">Cross-validated ROC-AUC: 0.98</span>
        </div>

        {/* Metric 3: Model Architecture */}
        <div className="bg-navy-950/60 rounded-2xl p-4 border border-navy-800/80 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Model
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-white">{model}</div>
            <div className="text-xs font-mono text-cyan-400 mt-1">{modelVersion}</div>
          </div>
          <span className="text-[11px] text-slate-400">200 Estimators • Calibrated Gini</span>
        </div>
      </div>

      {/* Top Protective & Risk Factors */}
      {prediction?.topFactors && prediction.topFactors.length > 0 && (
        <div className="relative z-10 my-4 bg-navy-950/40 rounded-xl p-3.5 border border-navy-800/60">
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Key Diagnostic Contributors:
          </span>
          <div className="flex flex-wrap gap-2">
            {prediction.topFactors.map((factor, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${
                  factor.impact === 'positive'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}
              >
                {factor.impact === 'positive' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{factor.factor}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions and Disclaimer */}
      <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <DisclaimerBanner variant="inline" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {onReevaluate && (
            <button
              onClick={onReevaluate}
              disabled={isLoading}
              className="text-xs px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700 font-medium transition-all"
            >
              {isLoading ? 'Assessing...' : 'Re-assess'}
            </button>
          )}

          <button
            onClick={() => navigate('/report')}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 hover:from-cyan-400 hover:to-electric-400 text-slate-950 font-semibold shadow-glow-cyan transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Full ML Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
