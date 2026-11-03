import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Heart,
  Wind,
  Thermometer,
  Droplet,
  Scale,
  Ruler,
  Cigarette,
  Wine,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { useHealthData } from '../hooks/useHealthData';
import { useToast } from '../components/common/Toast';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { HealthStatusBadge } from '../components/common/HealthStatusBadge';
import {
  calculateBMI,
  calculateAIRiskPrediction,
  getHeartRateStatus,
  getBloodPressureStatus,
  getSpo2Status,
  getTemperatureStatus,
  getGlucoseStatus,
} from '../utils/healthCalculators';
import { SmokingStatus, AlcoholStatus, ActivityLevel } from '../types';

export const HealthInputPage: React.FC = () => {
  const { addReading } = useHealthData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form states with default reference values
  const [heartRate, setHeartRate] = useState<number | string>(78);
  const [systolicBp, setSystolicBp] = useState<number | string>(120);
  const [diastolicBp, setDiastolicBp] = useState<number | string>(80);
  const [spo2, setSpo2] = useState<number | string>(98);
  const [temperature, setTemperature] = useState<number | string>(36.7);
  const [glucose, setGlucose] = useState<number | string>(95);
  const [height, setHeight] = useState<number | string>(178);
  const [weight, setWeight] = useState<number | string>(73);
  const [smoking, setSmoking] = useState<SmokingStatus>('never');
  const [alcohol, setAlcohol] = useState<AlcoholStatus>('none');
  const [physicalActivity, setPhysicalActivity] = useState<ActivityLevel>('moderate');
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonSymptoms = [
    'Fatigue / Lethargy',
    'Dizziness / Vertigo',
    'Shortness of Breath',
    'Chest Tightness',
    'Headache',
    'Palpitations',
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  // Live BMI calculation
  const bmiInfo = calculateBMI(Number(height), Number(weight));

  // Live dynamic ML preview
  const livePrediction = calculateAIRiskPrediction({
    heartRate: Number(heartRate) || 75,
    systolicBp: Number(systolicBp) || 120,
    diastolicBp: Number(diastolicBp) || 80,
    spo2: Number(spo2) || 98,
    temperature: Number(temperature) || 36.7,
    glucose: Number(glucose) || 95,
    bmi: bmiInfo.bmi,
    smoking,
    alcohol,
    physicalActivity,
  });

  // Presets for rapid testing
  const applyPreset = (preset: 'normal' | 'hypertensive' | 'critical') => {
    if (preset === 'normal') {
      setHeartRate(78);
      setSystolicBp(120);
      setDiastolicBp(80);
      setSpo2(98);
      setTemperature(36.7);
      setGlucose(95);
      setHeight(178);
      setWeight(73);
      setSmoking('never');
      setAlcohol('none');
      setPhysicalActivity('moderate');
      setSelectedSymptoms([]);
      setNotes('Routine normal healthy baseline assessment.');
      showToast('Loaded Optimal Healthy Reference preset', 'info');
    } else if (preset === 'hypertensive') {
      setHeartRate(92);
      setSystolicBp(144);
      setDiastolicBp(94);
      setSpo2(96);
      setTemperature(37.1);
      setGlucose(118);
      setHeight(175);
      setWeight(88);
      setSmoking('occasional');
      setAlcohol('moderate');
      setPhysicalActivity('light');
      setSelectedSymptoms(['Headache', 'Fatigue / Lethargy']);
      setNotes('Elevated blood pressure following intense work week.');
      showToast('Loaded Stage 2 Hypertension preset', 'warning');
    } else if (preset === 'critical') {
      setHeartRate(118);
      setSystolicBp(168);
      setDiastolicBp(104);
      setSpo2(91);
      setTemperature(38.6);
      setGlucose(165);
      setHeight(170);
      setWeight(96);
      setSmoking('daily');
      setAlcohol('heavy');
      setPhysicalActivity('sedentary');
      setSelectedSymptoms(['Shortness of Breath', 'Chest Tightness', 'Dizziness / Vertigo']);
      setNotes('Acute fever, hypoxemia, and hypertensive crisis.');
      showToast('Loaded Acute Critical Anomaly preset', 'error');
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    const hrNum = Number(heartRate);
    if (isNaN(hrNum) || hrNum < 35 || hrNum > 220) {
      errs.heartRate = 'Heart rate must be between 35 and 220 bpm';
    }

    const sysNum = Number(systolicBp);
    if (isNaN(sysNum) || sysNum < 60 || sysNum > 260) {
      errs.systolicBp = 'Systolic BP must be between 60 and 260 mmHg';
    }

    const diaNum = Number(diastolicBp);
    if (isNaN(diaNum) || diaNum < 40 || diaNum > 160) {
      errs.diastolicBp = 'Diastolic BP must be between 40 and 160 mmHg';
    }

    if (sysNum && diaNum && sysNum <= diaNum) {
      errs.systolicBp = 'Systolic BP must exceed Diastolic BP';
    }

    const spo2Num = Number(spo2);
    if (isNaN(spo2Num) || spo2Num < 70 || spo2Num > 100) {
      errs.spo2 = 'SpO2 must be between 70% and 100%';
    }

    const tempNum = Number(temperature);
    if (isNaN(tempNum) || tempNum < 32 || tempNum > 44) {
      errs.temperature = 'Temperature must be between 32.0°C and 44.0°C';
    }

    const gluNum = Number(glucose);
    if (isNaN(gluNum) || gluNum < 40 || gluNum > 450) {
      errs.glucose = 'Blood glucose must be between 40 and 450 mg/dL';
    }

    const hNum = Number(height);
    if (isNaN(hNum) || hNum < 60 || hNum > 250) {
      errs.height = 'Height must be between 60 and 250 cm';
    }

    const wNum = Number(weight);
    if (isNaN(wNum) || wNum < 25 || wNum > 300) {
      errs.weight = 'Weight must be between 25 and 300 kg';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please rectify highlighted clinical validation errors', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReading({
        heartRate: Number(heartRate),
        systolicBp: Number(systolicBp),
        diastolicBp: Number(diastolicBp),
        spo2: Number(spo2),
        temperature: Number(temperature),
        glucose: Number(glucose),
        height: Number(height),
        weight: Number(weight),
        bmi: bmiInfo.bmi,
        smoking,
        alcohol,
        physicalActivity,
        symptoms: selectedSymptoms,
        notes: notes.trim() || undefined,
      });

      showToast('New clinical telemetry record ingested & AI analyzed!', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to ingest vitals telemetry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Quick Presets */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-navy-900/90 p-6 rounded-3xl border border-navy-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Clinical Vitals Intake Form
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Input physical telemetry parameters to execute automated Random Forest risk stratification.
          </p>
        </div>

        {/* Rapid Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-1">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all"
          >
            Normal (78 bpm)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('hypertensive')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
          >
            Hypertension
          </button>
          <button
            type="button"
            onClick={() => applyPreset('critical')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all"
          >
            Critical Risk
          </button>
        </div>
      </div>

      {/* Main Grid: Form (8 cols) and Live Preview (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white space-y-6"
        >
          {/* Section 1: Core Vitals */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>1. Cardiovascular & Telemetry Vitals</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Heart Rate */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Heart Rate <span className="text-slate-400 font-normal font-mono">(bpm)</span>
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" />
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="78"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  />
                </div>
                {errors.heartRate && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.heartRate}</p>
                )}
              </div>

              {/* Systolic BP */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Systolic BP <span className="text-slate-400 font-normal font-mono">(mmHg)</span>
                </label>
                <div className="relative">
                  <Activity className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(e.target.value)}
                    placeholder="120"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  />
                </div>
                {errors.systolicBp && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.systolicBp}</p>
                )}
              </div>

              {/* Diastolic BP */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Diastolic BP <span className="text-slate-400 font-normal font-mono">(mmHg)</span>
                </label>
                <div className="relative">
                  <Activity className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="number"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(e.target.value)}
                    placeholder="80"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  />
                </div>
                {errors.diastolicBp && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.diastolicBp}</p>
                )}
              </div>

              {/* SpO2 */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Oxygen Saturation SpO2 <span className="text-slate-400 font-normal font-mono">(%)</span>
                </label>
                <div className="relative">
                  <Wind className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-electric-400" />
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="98"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  />
                </div>
                {errors.spo2 && <p className="text-[11px] text-rose-400 mt-1">{errors.spo2}</p>}
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Temperature <span className="text-slate-400 font-normal font-mono">(°C)</span>
                </label>
                <div className="relative">
                  <Thermometer className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="36.7"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  />
                </div>
                {errors.temperature && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.temperature}</p>
                )}
              </div>

              {/* Blood Glucose */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Blood Glucose <span className="text-slate-400 font-normal font-mono">(mg/dL)</span>
                </label>
                <div className="relative">
                  <Droplet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="number"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    placeholder="95"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  />
                </div>
                {errors.glucose && <p className="text-[11px] text-rose-400 mt-1">{errors.glucose}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Biometrics & BMI */}
          <div className="pt-4 border-t border-slate-100 dark:border-navy-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400 mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>2. Anthropometric Measurements & Auto-BMI</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Height <span className="text-slate-400 font-normal font-mono">(cm)</span>
                </label>
                <div className="relative">
                  <Ruler className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="178"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                {errors.height && <p className="text-[11px] text-rose-400 mt-1">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Weight <span className="text-slate-400 font-normal font-mono">(kg)</span>
                </label>
                <div className="relative">
                  <Scale className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="73"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                {errors.weight && <p className="text-[11px] text-rose-400 mt-1">{errors.weight}</p>}
              </div>

              {/* Computed BMI Display */}
              <div className="bg-slate-100 dark:bg-navy-950 p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Calculated BMI
                  </span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {bmiInfo.bmi > 0 ? bmiInfo.bmi : '--'}
                  </span>
                </div>
                <HealthStatusBadge
                  status={bmiInfo.status}
                  label={bmiInfo.category}
                  size="sm"
                  showPulse={false}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Lifestyle & Behavioral Indicators */}
          <div className="pt-4 border-t border-slate-100 dark:border-navy-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400 mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>3. Lifestyle & Behavioral Factors</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5">
                  <Cigarette className="w-3.5 h-3.5 text-slate-400" />
                  <span>Smoking Status</span>
                </label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value as SmokingStatus)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="never">Non-Smoker (Never)</option>
                  <option value="former">Former Smoker (&gt;1 yr quit)</option>
                  <option value="occasional">Occasional Smoker</option>
                  <option value="daily">Daily Smoker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alcohol Intake</span>
                </label>
                <select
                  value={alcohol}
                  onChange={(e) => setAlcohol(e.target.value as AlcoholStatus)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="none">None / Abstinent</option>
                  <option value="light">Light (&lt;3 drinks/wk)</option>
                  <option value="moderate">Moderate (3-7 drinks/wk)</option>
                  <option value="heavy">Heavy (&gt;7 drinks/wk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span>Physical Activity</span>
                </label>
                <select
                  value={physicalActivity}
                  onChange={(e) => setPhysicalActivity(e.target.value as ActivityLevel)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="sedentary">Sedentary (&lt;30 min/wk)</option>
                  <option value="light">Light (30-90 min/wk)</option>
                  <option value="moderate">Moderate (90-150 min/wk)</option>
                  <option value="high">High (&gt;150 min aerobic/wk)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Symptoms & Notes */}
          <div className="pt-4 border-t border-slate-100 dark:border-navy-800">
            <label className="block text-xs font-semibold mb-2">
              Reported Symptoms (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {commonSymptoms.map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedSymptoms.includes(sym)
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-50 dark:bg-navy-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-800 hover:text-slate-200'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Clinical Context / Patient Observations
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="E.g. Fasting morning routine before breakfast. Patient reports restful 8-hour sleep."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-400">
              Ingestion will immediately run Random Forest inference and persist to clinical records.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-electric-500 hover:from-cyan-400 hover:to-electric-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Evaluating & Ingesting...' : 'Save & Run AI Assessment'}</span>
            </button>
          </div>
        </form>

        {/* Live Side Preview Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 rounded-3xl p-6 border border-cyan-500/30 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm">Real-time ML Preview</span>
              </div>
              <HealthStatusBadge
                status={
                  livePrediction.riskStatus === 'Low'
                    ? 'normal'
                    : livePrediction.riskStatus === 'Moderate'
                    ? 'warning'
                    : 'danger'
                }
                label={`${livePrediction.riskStatus} Risk`}
                size="sm"
              />
            </div>

            <div className="my-5 text-center bg-navy-950/70 p-4 rounded-2xl border border-navy-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Predicted Risk Score
              </span>
              <div className="text-4xl font-black font-mono text-cyan-400 mt-1">
                {livePrediction.riskScore.toFixed(2)}
              </div>
              <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                {livePrediction.confidence}% Ensemble Confidence
              </span>
            </div>

            {/* Quick check breakdown */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Telemetry Impact Breakdown:
              </span>
              {livePrediction.topFactors.slice(0, 3).map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-navy-950/50 p-2 rounded-lg border border-navy-800/80 text-[11px]"
                >
                  <span className="truncate max-w-[170px] text-slate-300">{factor.factor}</span>
                  <span
                    className={`font-mono font-bold ${
                      factor.impact === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {factor.impact === 'positive' ? 'Protective' : `+${factor.weight}%`}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-navy-800 text-[11px] text-slate-400 italic">
              Model: Random Forest (v2.4 - Calibrated Gini)
            </div>
          </div>

          <DisclaimerBanner variant="inline" />
        </div>
      </div>
    </div>
  );
};
