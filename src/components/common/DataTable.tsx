import React, { useState } from 'react';
import { VitalsReading } from '../../types';
import { HealthStatusBadge } from './HealthStatusBadge';
import { Eye, Trash2, Search, Filter, ExternalLink, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DataTableProps {
  readings: VitalsReading[];
  onDelete?: (id: string) => void;
  title?: string;
  limit?: number;
  showViewAllLink?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  readings,
  onDelete,
  title = 'Recent Health Readings',
  limit,
  showViewAllLink = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReading, setSelectedReading] = useState<VitalsReading | null>(null);

  const displayedList = React.useMemo(() => {
    let list = readings;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.dateStr.toLowerCase().includes(q) ||
          r.timestamp.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q) ||
          r.riskStatus.toLowerCase().includes(q)
      );
    }
    if (limit) {
      list = list.slice(0, limit);
    }
    return list;
  }, [readings, searchTerm, limit]);

  return (
    <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass">
      {/* Table Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-navy-800 text-cyan-400 border border-navy-700">
              {readings.length} total
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized clinical telemetry records
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by date or status..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          {showViewAllLink && (
            <Link
              to="/history"
              className="text-xs text-cyan-500 hover:text-cyan-400 font-semibold flex items-center gap-1 whitespace-nowrap"
            >
              <span>View History</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-navy-800 text-slate-400 dark:text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3 px-3">Date / Timestamp</th>
              <th className="py-3 px-3">Heart Rate</th>
              <th className="py-3 px-3">Blood Pressure</th>
              <th className="py-3 px-3">SpO2</th>
              <th className="py-3 px-3">Temp</th>
              <th className="py-3 px-3">Glucose</th>
              <th className="py-3 px-3">AI Risk</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60 text-slate-700 dark:text-slate-300">
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No health telemetry records matched your criteria.
                </td>
              </tr>
            ) : (
              displayedList.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40 transition-colors group"
                >
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {row.dateStr}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{row.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {row.heartRate}
                    </span>{' '}
                    <span className="text-slate-400">bpm</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {row.systolicBp}/{row.diastolicBp}
                    </span>{' '}
                    <span className="text-slate-400">mmHg</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {row.spo2}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {row.temperature}°C
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {row.glucose}
                    </span>{' '}
                    <span className="text-slate-400">mg/dL</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <HealthStatusBadge
                      status={
                        row.riskStatus === 'Low'
                          ? 'normal'
                          : row.riskStatus === 'Moderate'
                          ? 'warning'
                          : 'danger'
                      }
                      label={`${row.riskStatus} (${row.riskScore.toFixed(2)})`}
                      size="sm"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                      <button
                        onClick={() => setSelectedReading(row)}
                        title="View Detailed Snapshot"
                        className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Snapshot Modal */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-navy-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-base">Reading Snapshot</h4>
              </div>
              <button
                onClick={() => setSelectedReading(null)}
                className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-navy-950 p-3 rounded-xl border border-navy-800">
                <span className="text-slate-400">Captured At:</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {selectedReading.timestamp} ({selectedReading.dateStr})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[11px]">Heart Rate</div>
                  <div className="text-lg font-bold font-mono text-rose-400">
                    {selectedReading.heartRate} bpm
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[11px]">Blood Pressure</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {selectedReading.systolicBp}/{selectedReading.diastolicBp}
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[11px]">SpO2 Saturation</div>
                  <div className="text-lg font-bold font-mono text-electric-400">
                    {selectedReading.spo2}%
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[11px]">Body Temp</div>
                  <div className="text-lg font-bold font-mono text-amber-400">
                    {selectedReading.temperature}°C
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[11px]">Blood Glucose</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {selectedReading.glucose} mg/dL
                  </div>
                </div>
                <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                  <div className="text-slate-400 text-[11px]">BMI</div>
                  <div className="text-lg font-bold font-mono text-purple-400">
                    {selectedReading.bmi || 23.0}
                  </div>
                </div>
              </div>

              <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800">
                <div className="flex items-center justify-between mb-1.5">
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
                <div className="text-slate-300">
                  Risk Score: <strong>{selectedReading.riskScore}</strong> | Confidence:{' '}
                  <strong>{selectedReading.confidence}%</strong> | Model:{' '}
                  <strong>{selectedReading.modelName}</strong>
                </div>
                {selectedReading.notes && (
                  <div className="mt-2 pt-2 border-t border-navy-800 text-slate-400 italic">
                    "{selectedReading.notes}"
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReading(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
