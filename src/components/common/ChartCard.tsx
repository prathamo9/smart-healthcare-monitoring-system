import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { VitalsReading } from '../../types';
import { Activity, Calendar, Sliders } from 'lucide-react';

interface ChartCardProps {
  data: VitalsReading[];
  title?: string;
}

type MetricMode = 'vitals' | 'bp' | 'glucose';
type TimeRange = '24h' | '7d' | '30d';

export const ChartCard: React.FC<ChartCardProps> = ({
  data,
  title = 'Interactive Health Telemetry Trends',
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('vitals');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Filter and reverse data so it runs chronologically left-to-right
  const filteredData = React.useMemo(() => {
    let sliceCount = 7;
    if (timeRange === '24h') sliceCount = 4;
    else if (timeRange === '30d') sliceCount = 30;

    const slice = data.slice(0, Math.min(data.length, sliceCount));
    return [...slice].reverse().map((item) => ({
      ...item,
      shortTime: item.dateStr.split(',')[0],
      displayTime: item.timestamp.split(' ')[1] || item.timestamp,
    }));
  }, [data, timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900/95 border border-cyan-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-semibold text-slate-200 mb-1.5 pb-1 border-b border-navy-800">
            {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
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
    <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass">
      {/* Top Controls: Title, Metric Switcher, and Timeframe Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous biosignal monitoring & longitudinal variance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Metric Selector Tabs */}
          <div className="flex bg-slate-100 dark:bg-navy-950 p-1 rounded-xl border border-slate-200 dark:border-navy-800 text-xs">
            <button
              onClick={() => setMetricMode('vitals')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricMode === 'vitals'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              HR & SpO2
            </button>
            <button
              onClick={() => setMetricMode('bp')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricMode === 'bp'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setMetricMode('glucose')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricMode === 'glucose'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              Glucose
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex bg-slate-100 dark:bg-navy-950 p-1 rounded-xl border border-slate-200 dark:border-navy-800 text-xs">
            {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1.5 rounded-lg font-mono uppercase transition-all ${
                  timeRange === range
                    ? 'bg-navy-700 dark:bg-navy-800 text-cyan-400 font-bold border border-cyan-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Cyan gradient for HR */}
              <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>

              {/* Blue gradient for SpO2 */}
              <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>

              {/* Rose gradient for Systolic BP */}
              <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>

              {/* Violet gradient for Diastolic BP */}
              <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>

              {/* Amber gradient for Glucose */}
              <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="shortTime"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
              iconSize={8}
            />

            {metricMode === 'vitals' && (
              <>
                <Area
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate"
                  unit="bpm"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHr)"
                />
                <Area
                  type="monotone"
                  dataKey="spo2"
                  name="SpO2 Saturation"
                  unit="%"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSpo2)"
                />
              </>
            )}

            {metricMode === 'bp' && (
              <>
                <Area
                  type="monotone"
                  dataKey="systolicBp"
                  name="Systolic BP"
                  unit="mmHg"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSystolic)"
                />
                <Area
                  type="monotone"
                  dataKey="diastolicBp"
                  name="Diastolic BP"
                  unit="mmHg"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDiastolic)"
                />
              </>
            )}

            {metricMode === 'glucose' && (
              <Area
                type="monotone"
                dataKey="glucose"
                name="Blood Glucose"
                unit="mg/dL"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorGlucose)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span>
            Telemetry Sampling: <strong className="text-slate-200">Continuous 1Hz</strong>
          </span>
          <span>
            Signal Quality: <strong className="text-emerald-400">99.8% (Optimal)</strong>
          </span>
        </div>
        <span className="font-mono text-[11px] text-cyan-400">
          Showing {filteredData.length} checkpoints
        </span>
      </div>
    </div>
  );
};
