import React from 'react';
import { LucideIcon, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { HealthStatusBadge } from './HealthStatusBadge';
import { HealthMetricStatus } from '../../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  status: HealthMetricStatus;
  statusLabel?: string;
  icon: LucideIcon;
  subtext?: string;
  referenceRange: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  isPulseAnimated?: boolean;
  accentColor?: 'rose' | 'cyan' | 'blue' | 'amber' | 'emerald' | 'purple';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  status,
  statusLabel,
  icon: Icon,
  subtext,
  referenceRange,
  trend = 'stable',
  trendValue,
  isPulseAnimated = false,
  accentColor = 'cyan',
  onClick,
}) => {
  // Border and accent styling
  const accentBorderMap = {
    rose: 'hover:border-rose-500/40 group-hover:text-rose-400',
    cyan: 'hover:border-cyan-500/40 group-hover:text-cyan-400',
    blue: 'hover:border-blue-500/40 group-hover:text-blue-400',
    amber: 'hover:border-amber-500/40 group-hover:text-amber-400',
    emerald: 'hover:border-emerald-500/40 group-hover:text-emerald-400',
    purple: 'hover:border-purple-500/40 group-hover:text-purple-400',
  };

  const iconBgMap = {
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-navy-900/90 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-sm hover:shadow-xl dark:shadow-glass hover:-translate-y-0.5 transition-all duration-300 ${accentBorderMap[accentColor]} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Top row: Icon, Title, and Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${iconBgMap[accentColor]}`}
          >
            <Icon
              className={`w-5 h-5 ${isPulseAnimated ? 'animate-heartbeat text-rose-500' : ''}`}
            />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {title}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Ref: {referenceRange}
            </span>
          </div>
        </div>
        <HealthStatusBadge status={status} label={statusLabel} size="sm" />
      </div>

      {/* Main value display */}
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
          {value}
        </span>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {unit}
        </span>
      </div>

      {/* Bottom metadata row */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
          {subtext || 'Normal physiologic range'}
        </span>
        {trendValue && (
          <div className="flex items-center gap-1 font-medium">
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
            {trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span
              className={
                trend === 'up'
                  ? 'text-amber-400'
                  : trend === 'down'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
