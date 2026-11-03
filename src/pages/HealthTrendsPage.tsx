import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Heart,
  Wind,
  Droplet,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const HealthTrendsPage: React.FC = () => {
  const { history } = useHealthData();
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');

  // Format and chronological order
  const chartData = React.useMemo(() => {
    let count = 14;
    if (timeRange === '7d') count = 7;
    if (timeRange === '30d') count = 30;

    const slice = history.slice(0, Math.min(history.length, count));
    return [...slice].reverse().map((item) => ({
      ...item,
      label: item.dateStr.split(',')[0],
      pulseRate: item.heartRate,
      systolic: item.systolicBp,
      diastolic: item.diastolicBp,
      oxygen: item.spo2,
      sugar: item.glucose,
    }));
  }, [history, timeRange]);

  // Aggregate summary statistics
  const stats = React.useMemo(() => {
    if (chartData.length === 0) {
      return { avgHr: 75, maxBp: 120, minSpo2: 98, avgGlucose: 95 };
    }
    const totalHr = chartData.reduce((acc, curr) => acc + curr.pulseRate, 0);
    const maxBp = Math.max(...chartData.map((d) => d.systolic));
    const minSpo2 = Math.min(...chartData.map((d) => d.oxygen));
    const totalGlu = chartData.reduce((acc, curr) => acc + curr.sugar, 0);

    return {
      avgHr: Math.round(totalHr / chartData.length),
      maxBp,
      minSpo2,
      avgGlucose: Math.round(totalGlu / chartData.length),
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900/95 border border-cyan-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-semibold text-slate-200 mb-1 border-b border-navy-800 pb-1">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="font-mono font-bold text-white">
                  {entry.value} {entry.unit || ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header with Date Range Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-navy-900/90 p-6 rounded-3xl border border-navy-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Longitudinal Health Trends & Biosignals
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-axis correlation of cardiovascular, pulmonary, and metabolic biomarkers.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-navy-950 p-1 rounded-xl border border-navy-800 text-xs">
          {(['7d', '14d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold uppercase transition-all ${
                timeRange === r
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r} Range
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-4 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white">{stats.avgHr}</span>
            <span className="text-xs text-slate-400">bpm</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Optimal resting range</span>
        </div>

        <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-4 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak Systolic BP</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white">{stats.maxBp}</span>
            <span className="text-xs text-slate-400">mmHg</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Upper threshold &lt; 135</span>
        </div>

        <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-4 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Minimum SpO2</span>
            <Wind className="w-4 h-4 text-electric-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white">{stats.minSpo2}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {stats.minSpo2 >= 95 ? 'Normal arterial gas' : 'Mild hypoxemia registered'}
          </span>
        </div>

        <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-4 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Fasting Glucose</span>
            <Droplet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white">{stats.avgGlucose}</span>
            <span className="text-xs text-slate-400">mg/dL</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Normal fasting threshold 70-99</span>
        </div>
      </div>

      {/* Chart 1: Dual-Axis Blood Pressure (Systolic & Diastolic) */}
      <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Blood Pressure Longitudinal Stability</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Systolic vs Diastolic variance with clinical pre-hypertension boundary lines
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Target: &lt;120 / &lt;80</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[60, 160]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Elevated (120)', fill: '#f59e0b', fontSize: 10 }} />
              <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Stage 2 HTN (140)', fill: '#ef4444', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic BP"
                unit="mmHg"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#f43f5e' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic BP"
                unit="mmHg"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#a855f7' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Heart Rate & SpO2 Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Heart Rate Timeline (bpm)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Resting pulse fluctuations</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hrArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[50, 110]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="pulseRate"
                  name="Heart Rate"
                  unit="bpm"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#hrArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Blood Glucose Dynamic Curve */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-amber-400" />
            <span>Blood Glucose Variations (mg/dL)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Glycemic stability curve</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[60, 140]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar
                  dataKey="sugar"
                  name="Blood Glucose"
                  unit="mg/dL"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="inline" />
    </div>
  );
};
