import React from 'react';

interface HealthStatusBadgeProps {
  status: 'normal' | 'warning' | 'danger' | 'info' | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const HealthStatusBadge: React.FC<HealthStatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showPulse = true,
}) => {
  const normalized = status.toLowerCase();

  const isNormal = normalized === 'normal' || normalized === 'low' || normalized === 'optimal';
  const isWarning = normalized === 'warning' || normalized === 'moderate' || normalized === 'elevated';
  const isDanger = normalized === 'danger' || normalized === 'high' || normalized === 'critical' || normalized === 'abnormal';

  let config = {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    dot: 'bg-emerald-400',
    pulse: 'bg-emerald-400/40',
    defaultLabel: 'Normal',
  };

  if (isWarning) {
    config = {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400',
      pulse: 'bg-amber-400/40',
      defaultLabel: 'Warning',
    };
  } else if (isDanger) {
    config = {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      dot: 'bg-rose-400',
      pulse: 'bg-rose-400/40',
      defaultLabel: 'High Risk',
    };
  } else if (normalized === 'info') {
    config = {
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      dot: 'bg-cyan-400',
      pulse: 'bg-cyan-400/40',
      defaultLabel: 'Info',
    };
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]} transition-all`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pulse}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
