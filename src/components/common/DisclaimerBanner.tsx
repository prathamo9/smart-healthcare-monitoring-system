import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DisclaimerBannerProps {
  variant?: 'inline' | 'card' | 'footer' | 'prominent';
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  variant = 'card',
  className = '',
}) => {
  const disclaimerText =
    'AI-generated risk assessment is for educational/research purposes and is not a medical diagnosis.';

  if (variant === 'footer') {
    return (
      <div className={`py-4 text-center border-t border-slate-800 text-xs text-slate-400 ${className}`}>
        <p className="flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>{disclaimerText} Always consult a qualified healthcare professional.</span>
        </p>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <div
        className={`p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-3 shadow-lg ${className}`}
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p className="font-semibold text-amber-300">Clinical Research Notice</p>
          <p className="mt-0.5">{disclaimerText}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`px-3.5 py-2.5 rounded-lg bg-navy-900/80 border border-cyan-500/20 text-slate-300 flex items-center gap-2.5 text-xs backdrop-blur-sm ${className}`}
    >
      <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
      <span className="leading-snug">{disclaimerText}</span>
    </div>
  );
};
