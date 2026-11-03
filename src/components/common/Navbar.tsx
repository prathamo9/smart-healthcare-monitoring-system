import React from 'react';
import { Menu, Plus, Radio, Shield, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Telemetry Dashboard', subtitle: 'Real-time multi-vital surveillance & AI diagnosis' };
      case '/input':
        return { title: 'Health Data Input', subtitle: 'Clinical intake & dynamic ML risk stratification' };
      case '/history':
        return { title: 'Health Records History', subtitle: 'Searchable clinical logs & retrospective audit' };
      case '/trends':
        return { title: 'Longitudinal Health Trends', subtitle: 'Multi-parameter variance & correlation analysis' };
      case '/risk':
        return { title: 'Clinical Risk Stratification', subtitle: 'Cardiovascular, metabolic & multi-system radar index' };
      case '/report':
        return { title: 'AI Clinical Diagnostic Report', subtitle: 'Random Forest model explainability & SHAP factors' };
      case '/profile':
        return { title: 'Patient Profile', subtitle: 'Demographics, medical history & clinical contacts' };
      case '/settings':
        return { title: 'System Settings', subtitle: 'Telemetry thresholds, units & mock FastAPI connection' };
      default:
        return { title: 'HealthPulse AI', subtitle: 'Advanced Agentic Healthcare System' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 h-16 bg-navy-950/80 backdrop-blur-md border-b border-navy-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="lg:hidden p-2 rounded-xl bg-navy-900 border border-navy-800 text-slate-300 hover:text-cyan-400 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block mt-1 font-mono">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Live Status, Notifications, and Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Telemetry live status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-medium">Live Telemetry</span>
        </div>

        {/* Quick Log Vitals Button */}
        <Link
          to="/input"
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-glow-cyan active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Add Vitals</span>
        </Link>

        {/* Notification Dropdown */}
        <NotificationDropdown />

        {/* Profile Avatar Button */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-navy-900 border border-navy-800 hover:border-cyan-500/40 transition-all"
        >
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
            }
            alt="Avatar"
            className="w-7 h-7 rounded-lg object-cover border border-cyan-400/40"
          />
          <span className="hidden lg:inline text-xs font-medium text-slate-200">
            {user?.name ? user.name.split(' ')[0] : 'Profile'}
          </span>
        </Link>
      </div>
    </header>
  );
};
