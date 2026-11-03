import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  History,
  TrendingUp,
  ShieldAlert,
  FileText,
  User,
  Settings,
  HeartPulse,
  LogOut,
  ChevronRight,
  ExternalLink,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Health Data Input', path: '/input', icon: Activity, badge: 'New' },
    { name: 'Health History', path: '/history', icon: History },
    { name: 'Health Trends', path: '/trends', icon: TrendingUp },
    { name: 'Risk Analysis', path: '/risk', icon: ShieldAlert },
    { name: 'ML Report', path: '/report', icon: FileText },
    { name: 'Patient Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-900 border-r border-navy-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-navy-800">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-glow-cyan transition-transform group-hover:scale-105">
              <HeartPulse className="w-5 h-5 text-navy-950 font-bold" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">
                Health<span className="text-cyan-400">Pulse</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mt-1">
                AI Biosystems
              </span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Clinical Telemetry
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-electric-500/10 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              )}
            </NavLink>
          ))}

          <div className="pt-4 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            System
          </div>
          <NavLink
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-navy-850"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>Public Landing Page</span>
            </div>
          </NavLink>
        </div>

        {/* User Mini Profile Card & Logout */}
        <div className="p-3 border-t border-navy-800 bg-navy-950/60">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-navy-850 transition-colors">
            <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                }
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-cyan-400/40 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Dr. Pratham'}
                </p>
                <p className="text-[10px] text-cyan-400 font-mono truncate">
                  {user?.provider === 'google' ? 'Google Authenticated' : 'Physician Mode'}
                </p>
              </div>
            </NavLink>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
