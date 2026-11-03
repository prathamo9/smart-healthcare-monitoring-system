import React, { useState } from 'react';
import {
  Settings,
  Server,
  Bell,
  Cpu,
  RefreshCw,
  Trash2,
  Save,
  CheckCircle2,
  Watch,
  Activity,
  Wind,
  Droplet,
  Database,
  Sliders,
} from 'lucide-react';
import { useHealthData } from '../hooks/useHealthData';
import { useToast } from '../components/common/Toast';
import { defaultSettings } from '../data/mockData';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const { resetToDemo, generateSimulatedData } = useHealthData();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('healthpulse_app_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('healthpulse_app_settings', JSON.stringify(newSettings));
    showToast('System configuration saved', 'success');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all vitals to default reference data (78 bpm, 120/80 mmHg, 0.06 risk)?')) {
      await resetToDemo();
      showToast('Restored default clinical baseline records', 'info');
    }
  };

  const handleGenerateData = async () => {
    await generateSimulatedData(14);
    showToast('Generated 14 days of realistic telemetry records', 'success');
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all local data and preferences?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-navy-900/90 p-6 rounded-3xl border border-navy-800 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">System Settings & Backend Hook</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure telemetry sensors, mock FastAPI connectivity, and algorithmic alert thresholds.
          </p>
        </div>

        <button
          onClick={() => saveSettings(settings)}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Card 1: FastAPI Backend & Mock Service Layer */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>FastAPI Backend Connection Readiness</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Mock Service Active
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            The frontend service layer (<code>healthService.ts</code>) is architected for drop-in FastAPI integration. Toggle between local in-memory simulation and your live REST endpoints.
          </p>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Architecture Pipeline Mode</label>
                <select
                  value={settings.apiMode}
                  onChange={(e) =>
                    setSettings({ ...settings, apiMode: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
                >
                  <option value="mock">In-Memory Mock Service (Offline Demo)</option>
                  <option value="fastapi">FastAPI REST Server (http://localhost:8000)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">FastAPI Server Base Endpoint</label>
                <input
                  type="text"
                  value={settings.apiBaseUrl}
                  onChange={(e) => setSettings({ ...settings, apiBaseUrl: e.target.value })}
                  placeholder="http://localhost:8000/api"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">Simulated REST Latency</span>
                <span className="font-mono text-cyan-400 font-bold">{settings.simulatedLatency} ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="1200"
                step="50"
                value={settings.simulatedLatency}
                onChange={(e) =>
                  setSettings({ ...settings, simulatedLatency: Number(e.target.value) })
                }
                className="w-full accent-cyan-400 bg-slate-200 dark:bg-navy-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Simulates real-world round-trip network transmission times.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Connected Telemetry Devices */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <Watch className="w-4 h-4" />
            <span>Simulated Connected Biomedical Hardware</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Watch className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Apple Watch / WearOS</div>
                  <div className="text-[10px] text-slate-400 font-mono">Continuous PPG Heart Rate</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.connectedDevices.smartwatch}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    connectedDevices: { ...settings.connectedDevices, smartwatch: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-electric-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">BLE Pulse Oximeter</div>
                  <div className="text-[10px] text-slate-400 font-mono">Continuous SpO2 Saturation</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.connectedDevices.pulseOximeter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    connectedDevices: { ...settings.connectedDevices, pulseOximeter: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Wireless Omron BP Cuff</div>
                  <div className="text-[10px] text-slate-400 font-mono">Oscillometric Systolic / Diastolic</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.connectedDevices.bloodPressureCuff}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    connectedDevices: { ...settings.connectedDevices, bloodPressureCuff: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Droplet className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Continuous Glucose Monitor (CGM)</div>
                  <div className="text-[10px] text-slate-400 font-mono">Dexcom / FreeStyle Libre</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.connectedDevices.glucometer}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    connectedDevices: { ...settings.connectedDevices, glucometer: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>
          </div>
        </div>

        {/* Card 3: Alert Thresholds */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Physiologic Alarm Triggers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Tachycardia Alert (&gt; bpm)</label>
              <input
                type="number"
                value={settings.alertThresholds.maxHeartRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertThresholds: { ...settings.alertThresholds, maxHeartRate: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Hypertension Alert (&gt; mmHg)</label>
              <input
                type="number"
                value={settings.alertThresholds.maxSystolic}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertThresholds: { ...settings.alertThresholds, maxSystolic: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Desaturation Alert (&lt; %)</label>
              <input
                type="number"
                value={settings.alertThresholds.minSpo2}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertThresholds: { ...settings.alertThresholds, minSpo2: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Demo Data Management */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>Synthetic Demo Data Controls</span>
          </h3>

          <p className="text-xs text-slate-400 mb-5">
            Reset or dynamically generate synthetic longitudinal patient data to demonstrate telemetry visualization and AI stratification.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Reset to Reference (78 bpm / 0.06 Risk)</span>
            </button>

            <button
              onClick={handleGenerateData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Generate 14 Days Historical Data</span>
            </button>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Local Storage</span>
            </button>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="inline" />
    </div>
  );
};
