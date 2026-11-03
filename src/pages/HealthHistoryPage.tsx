import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { useHealthData } from '../hooks/useHealthData';
import { useToast } from '../components/common/Toast';
import { HealthStatusBadge } from '../components/common/HealthStatusBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { VitalsReading } from '../types';

export const HealthHistoryPage: React.FC = () => {
  const { history, deleteReading } = useHealthData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'hr' | 'bp' | 'risk'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedReading, setSelectedReading] = useState<VitalsReading | null>(null);

  const filtered = React.useMemo(() => {
    let list = [...history];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.dateStr.toLowerCase().includes(q) ||
          r.timestamp.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q) ||
          r.riskStatus.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter((r) => r.riskStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? b.timestamp.localeCompare(a.timestamp)
          : a.timestamp.localeCompare(b.timestamp);
      }
      if (sortBy === 'hr') {
        valA = a.heartRate;
        valB = b.heartRate;
      } else if (sortBy === 'bp') {
        valA = a.systolicBp;
        valB = b.systolicBp;
      } else if (sortBy === 'risk') {
        valA = a.riskScore;
        valB = b.riskScore;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return list;
  }, [history, search, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'date' | 'hr' | 'bp' | 'risk') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      showToast('No records to export', 'warning');
      return;
    }

    const headers = [
      'ID',
      'Timestamp',
      'DateStr',
      'HeartRate(bpm)',
      'SystolicBP(mmHg)',
      'DiastolicBP(mmHg)',
      'SpO2(%)',
      'Temp(C)',
      'Glucose(mg/dL)',
      'BMI',
      'RiskScore',
      'RiskStatus',
      'Confidence(%)',
      'Model',
      'Notes',
    ];

    const rows = history.map((r) => [
      r.id,
      `"${r.timestamp}"`,
      `"${r.dateStr}"`,
      r.heartRate,
      r.systolicBp,
      r.diastolicBp,
      r.spo2,
      r.temperature,
      r.glucose,
      r.bmi || 23.0,
      r.riskScore,
      r.riskStatus,
      r.confidence,
      `"${r.modelName}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `healthpulse_telemetry_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported complete clinical history to CSV', 'success');
  };

  const handleDelete = async (id: string) => {
    await deleteReading(id);
    showToast('Record deleted from clinical store', 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-navy-900/90 p-6 rounded-3xl border border-navy-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Clinical Telemetry Audit History
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete retrospective audit log of all recorded biosignals and algorithmic predictions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-navy-900/90 rounded-2xl p-4 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search date, notes, or status..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Risk Filter:</span>
          </span>
          {['all', 'low', 'moderate', 'high', 'critical'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-navy-950 text-slate-500 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-navy-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-3 cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center gap-1">
                    <span>Date / Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('hr')}
                  className="py-3 px-3 cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center gap-1">
                    <span>Heart Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('bp')}
                  className="py-3 px-3 cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center gap-1">
                    <span>Blood Pressure</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">SpO2</th>
                <th className="py-3 px-3">Body Temp</th>
                <th className="py-3 px-3">Fasting Glucose</th>
                <th
                  onClick={() => toggleSort('risk')}
                  className="py-3 px-3 cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center gap-1">
                    <span>AI Risk Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60 text-slate-700 dark:text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No clinical telemetry records match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-navy-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.dateStr}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.timestamp}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {item.heartRate}
                      </span>{' '}
                      <span className="text-slate-400">bpm</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {item.systolicBp}/{item.diastolicBp}
                      </span>{' '}
                      <span className="text-slate-400">mmHg</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {item.spo2}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {item.temperature}°C
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {item.glucose}
                      </span>{' '}
                      <span className="text-slate-400">mg/dL</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <HealthStatusBadge
                        status={
                          item.riskStatus === 'Low'
                            ? 'normal'
                            : item.riskStatus === 'Moderate'
                            ? 'warning'
                            : 'danger'
                        }
                        label={`${item.riskStatus} (${item.riskScore.toFixed(2)})`}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedReading(item)}
                          title="View Snapshot"
                          className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Displaying <strong>{filtered.length}</strong> of <strong>{history.length}</strong> total
            telemetry entries
          </span>
          <span className="font-mono text-[11px] text-cyan-400">Encrypted Clinical Store</span>
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-navy-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <h4 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Clinical Telemetry Snapshot</span>
              </h4>
              <button
                onClick={() => setSelectedReading(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex justify-between items-center">
                <span className="text-slate-400">Captured At:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {selectedReading.timestamp} ({selectedReading.dateStr})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[10px]">Heart Rate</div>
                  <div className="text-lg font-bold font-mono text-rose-400">
                    {selectedReading.heartRate} bpm
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[10px]">Blood Pressure</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {selectedReading.systolicBp}/{selectedReading.diastolicBp}
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[10px]">SpO2</div>
                  <div className="text-lg font-bold font-mono text-electric-400">
                    {selectedReading.spo2}%
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[10px]">Temperature</div>
                  <div className="text-lg font-bold font-mono text-amber-400">
                    {selectedReading.temperature}°C
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[10px]">Glucose</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {selectedReading.glucose} mg/dL
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[10px]">BMI</div>
                  <div className="text-lg font-bold font-mono text-purple-400">
                    {selectedReading.bmi || 23.0}
                  </div>
                </div>
              </div>

              <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">AI Risk Assessment:</span>
                  <HealthStatusBadge
                    status={
                      selectedReading.riskStatus === 'Low'
                        ? 'normal'
                        : selectedReading.riskStatus === 'Moderate'
                        ? 'warning'
                        : 'danger'
                    }
                    label={`${selectedReading.riskStatus} Risk`}
                  />
                </div>
                <div className="text-slate-300 font-mono text-xs">
                  Score: {selectedReading.riskScore.toFixed(2)} &bull; Confidence:{' '}
                  {selectedReading.confidence}% &bull; Model: {selectedReading.modelName}
                </div>
                {selectedReading.notes && (
                  <p className="mt-2 text-slate-400 italic">"{selectedReading.notes}"</p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReading(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <DisclaimerBanner variant="inline" />
    </div>
  );
};
