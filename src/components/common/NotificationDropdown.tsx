import React, { useState } from 'react';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { initialNotifications } from '../../data/mockData';
import { NotificationItem } from '../../types';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'warning':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-2xl z-50 overflow-hidden text-slate-900 dark:text-white">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-800/60">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors ${
                      !item.read ? 'bg-cyan-500/[0.04]' : ''
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono ml-2 whitespace-nowrap">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-navy-950 text-center border-t border-slate-100 dark:border-navy-800 text-[11px] text-slate-400">
              Smart Healthcare Telemetry Alerts Active
            </div>
          </div>
        </>
      )}
    </div>
  );
};
