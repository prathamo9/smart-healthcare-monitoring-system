import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-medium text-white transition-all transform animate-slide-up ${
              toast.type === 'success'
                ? 'bg-navy-900/95 border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-navy-900/95 border-rose-500/40 text-rose-300'
                : toast.type === 'warning'
                ? 'bg-navy-900/95 border-amber-500/40 text-amber-300'
                : 'bg-navy-900/95 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {toast.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
              <span className="leading-snug text-slate-100">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
