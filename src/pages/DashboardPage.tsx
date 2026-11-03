import React from 'react';
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  Droplet,
  RefreshCw,
  Plus,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from '../components/common/MetricCard';
import { PredictionCard } from '../components/common/PredictionCard';
import { ChartCard } from '../components/common/ChartCard';
import { DataTable } from '../components/common/DataTable';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useHealthData } from '../hooks/useHealthData';
import { useToast } from '../components/common/Toast';
import {
  getHeartRateStatus,
  getBloodPressureStatus,
  getSpo2Status,
  getTemperatureStatus,
  getGlucoseStatus,
} from '../utils/healthCalculators';

export const DashboardPage: React.FC = () => {
  const { history, latest, prediction, isLoading, refresh, deleteReading } = useHealthData();
  const { showToast } = useToast();

  // Reference fallback defaults if no readings exist
  const hr = latest ? latest.heartRate : 78;
  const sysBp = latest ? latest.systolicBp : 120;
  const diaBp = latest ? latest.diastolicBp : 80;
  const spo2 = latest ? latest.spo2 : 98;
  const temp = latest ? latest.temperature : 36.7;
  const glucose = latest ? latest.glucose : 95;

  const hrStatus = getHeartRateStatus(hr);
  const bpStatus = getBloodPressureStatus(sysBp, diaBp);
  const spo2Status = getSpo2Status(spo2);
  const tempStatus = getTemperatureStatus(temp);
  const glucoseStatus = getGlucoseStatus(glucose);

  const handleRefresh = async () => {
    await refresh();
    showToast('Telemetry stream refreshed & re-synchronized', 'info');
  };

  const handleDelete = async (id: string) => {
    await deleteReading(id);
    showToast('Record deleted from clinical store', 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Banner / Hero Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-5 sm:p-6 rounded-3xl border border-navy-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Patient Vitals Surveillance
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Live Edge Node
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Displaying continuous biosignals and algorithmic risk classifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700/60 text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Vitals</span>
          </button>

          <Link
            to="/input"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Telemetry</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Heart Rate */}
        <MetricCard
          title="Heart Rate"
          value={hr}
          unit="bpm"
          status={hrStatus.status}
          statusLabel={hrStatus.label}
          icon={Heart}
          subtext={hrStatus.text}
          referenceRange="60 - 100 bpm"
          trend="stable"
          trendValue="78 bpm avg"
          isPulseAnimated={true}
          accentColor="rose"
        />

        {/* Blood Pressure */}
        <MetricCard
          title="Blood Pressure"
          value={`${sysBp}/${diaBp}`}
          unit="mmHg"
          status={bpStatus.status}
          statusLabel={bpStatus.label}
          icon={Activity}
          subtext={bpStatus.text}
          referenceRange="120/80 mmHg"
          trend="down"
          trendValue="-2 mmHg"
          accentColor="cyan"
        />

        {/* SpO2 */}
        <MetricCard
          title="SpO2 Saturation"
          value={spo2}
          unit="%"
          status={spo2Status.status}
          statusLabel={spo2Status.label}
          icon={Wind}
          subtext={spo2Status.text}
          referenceRange="95 - 100%"
          trend="stable"
          trendValue="Optimal"
          accentColor="blue"
        />

        {/* Body Temperature */}
        <MetricCard
          title="Body Temp"
          value={temp}
          unit="°C"
          status={tempStatus.status}
          statusLabel={tempStatus.label}
          icon={Thermometer}
          subtext={tempStatus.text}
          referenceRange="36.1 - 37.2°C"
          trend="stable"
          trendValue="Normothermia"
          accentColor="amber"
        />

        {/* Fasting Glucose */}
        <MetricCard
          title="Blood Glucose"
          value={glucose}
          unit="mg/dL"
          status={glucoseStatus.status}
          statusLabel={glucoseStatus.label}
          icon={Droplet}
          subtext={glucoseStatus.text}
          referenceRange="70 - 99 mg/dL"
          trend="down"
          trendValue="Fasting"
          accentColor="emerald"
        />
      </div>

      {/* Main Grid: AI/ML Prediction Card & Interactive Health Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: AI/ML Prediction Card (5 cols on lg) */}
        <div className="lg:col-span-5">
          <PredictionCard
            prediction={prediction}
            onReevaluate={handleRefresh}
            isLoading={isLoading}
          />
        </div>

        {/* Right: Interactive Health Trend Chart (7 cols on lg) */}
        <div className="lg:col-span-7">
          <ChartCard data={history} />
        </div>
      </div>

      {/* Recent Health Readings Table */}
      <div>
        <DataTable
          readings={history}
          onDelete={handleDelete}
          title="Recent Health Telemetry Checkpoints"
          limit={6}
          showViewAllLink={true}
        />
      </div>

      {/* Medical Notice Disclaimer */}
      <DisclaimerBanner variant="inline" />
    </div>
  );
};
