import { VitalsReading, RiskPrediction, AppSettings } from '../types';
import { initialVitalsHistory, defaultSettings } from '../data/mockData';
import { calculateAIRiskPrediction } from '../utils/healthCalculators';

const VITALS_STORAGE_KEY = 'healthpulse_vitals_history';
const SETTINGS_STORAGE_KEY = 'healthpulse_app_settings';

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class HealthService {
  private getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  private getStoredHistory(): VitalsReading[] {
    try {
      const stored = localStorage.getItem(VITALS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(initialVitalsHistory));
      return initialVitalsHistory;
    } catch {
      return initialVitalsHistory;
    }
  }

  private saveHistory(history: VitalsReading[]) {
    try {
      localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history to localStorage', e);
    }
  }

  /**
   * Fetch the most recent reading (for Dashboard widgets)
   */
  async getLatestReading(): Promise<VitalsReading> {
    const settings = this.getSettings();
    await delay(settings.simulatedLatency || 150);

    // If future FastAPI is active:
    // if (settings.apiMode === 'fastapi') {
    //   const res = await fetch(`${settings.apiBaseUrl}/vitals/latest`);
    //   return res.json();
    // }

    const history = this.getStoredHistory();
    return history[0] || initialVitalsHistory[0];
  }

  /**
   * Fetch complete or filtered vitals history
   */
  async getHistory(filters?: {
    search?: string;
    riskStatus?: string;
    timeRange?: '7d' | '14d' | '30d' | 'all';
  }): Promise<VitalsReading[]> {
    const settings = this.getSettings();
    await delay(settings.simulatedLatency || 200);

    let list = this.getStoredHistory();

    if (filters?.riskStatus && filters.riskStatus !== 'all') {
      list = list.filter((item) => item.riskStatus.toLowerCase() === filters.riskStatus?.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (item) =>
          item.notes?.toLowerCase().includes(q) ||
          item.dateStr.toLowerCase().includes(q) ||
          item.riskStatus.toLowerCase().includes(q)
      );
    }

    if (filters?.timeRange && filters.timeRange !== 'all') {
      const days = filters.timeRange === '7d' ? 7 : filters.timeRange === '14d' ? 14 : 30;
      list = list.slice(0, Math.min(list.length, days));
    }

    return list;
  }

  /**
   * Fetch a single reading by its ID
   */
  async getReadingById(id: string): Promise<VitalsReading | null> {
    const settings = this.getSettings();
    await delay(settings.simulatedLatency || 100);

    const history = this.getStoredHistory();
    return history.find((item) => item.id === id) || null;
  }

  /**
   * Request AI risk prediction from ML engine
   * (Ready for POST /api/predict in future FastAPI backend)
   */
  async predictRisk(params: {
    heartRate: number;
    systolicBp: number;
    diastolicBp: number;
    spo2: number;
    temperature: number;
    glucose: number;
    bmi: number;
    smoking: any;
    alcohol: any;
    physicalActivity: any;
  }): Promise<RiskPrediction> {
    const settings = this.getSettings();
    await delay(settings.simulatedLatency || 300);

    // If future FastAPI is active:
    // if (settings.apiMode === 'fastapi') {
    //   const res = await fetch(`${settings.apiBaseUrl}/predict`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(params),
    //   });
    //   return res.json();
    // }

    return calculateAIRiskPrediction(params);
  }

  /**
   * Ingest new patient vitals reading and automatically run AI prediction
   */
  async submitVitals(newEntry: Omit<VitalsReading, 'id' | 'timestamp' | 'dateStr' | 'riskScore' | 'confidence' | 'riskStatus' | 'modelName'>): Promise<VitalsReading> {
    const settings = this.getSettings();
    await delay(settings.simulatedLatency || 350);

    // Run prediction
    const prediction = await this.predictRisk({
      heartRate: newEntry.heartRate,
      systolicBp: newEntry.systolicBp,
      diastolicBp: newEntry.diastolicBp,
      spo2: newEntry.spo2,
      temperature: newEntry.temperature,
      glucose: newEntry.glucose,
      bmi: newEntry.bmi,
      smoking: newEntry.smoking,
      alcohol: newEntry.alcohol,
      physicalActivity: newEntry.physicalActivity,
    });

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = `Today, ${timeFormatted}`;

    const createdReading: VitalsReading = {
      ...newEntry,
      id: `rec-${Date.now()}`,
      timestamp: `${now.toISOString().split('T')[0]} ${timeFormatted}`,
      dateStr: dateFormatted,
      riskScore: prediction.riskScore,
      confidence: prediction.confidence,
      riskStatus: prediction.riskStatus,
      modelName: prediction.modelName,
    };

    const history = this.getStoredHistory();
    const updated = [createdReading, ...history];
    this.saveHistory(updated);

    return createdReading;
  }

  /**
   * Delete a reading by ID
   */
  async deleteReading(id: string): Promise<boolean> {
    const settings = this.getSettings();
    await delay(settings.simulatedLatency || 150);

    const history = this.getStoredHistory();
    const updated = history.filter((item) => item.id !== id);
    this.saveHistory(updated);
    return true;
  }

  /**
   * Reset data to the default reference demo values
   */
  async resetToDemoData(): Promise<void> {
    const settings = this.getSettings();
    await delay(settings.simulatedLatency || 200);
    this.saveHistory(initialVitalsHistory);
  }

  /**
   * Generate N random realistic daily records
   */
  async generateRandomHistoricalData(count: number = 14): Promise<void> {
    const newRecords: VitalsReading[] = [];
    const baseDate = new Date();

    for (let i = 0; i < count; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - (i + 1));
      
      const hr = Math.round(68 + Math.random() * 22);
      const sys = Math.round(112 + Math.random() * 20);
      const dia = Math.round(72 + Math.random() * 14);
      const spo2 = Math.round(96 + Math.random() * 3);
      const temp = parseFloat((36.4 + Math.random() * 0.7).toFixed(1));
      const glu = Math.round(85 + Math.random() * 28);
      const bmi = 23.2;

      const pred = calculateAIRiskPrediction({
        heartRate: hr,
        systolicBp: sys,
        diastolicBp: dia,
        spo2,
        temperature: temp,
        glucose: glu,
        bmi,
        smoking: 'never',
        alcohol: 'none',
        physicalActivity: 'moderate',
      });

      newRecords.push({
        id: `rec-sim-${Date.now()}-${i}`,
        timestamp: `${d.toISOString().split('T')[0]} 08:30 AM`,
        dateStr: `${i + 1} days ago, 08:30 AM`,
        heartRate: hr,
        systolicBp: sys,
        diastolicBp: dia,
        spo2,
        temperature: temp,
        glucose: glu,
        height: 178,
        weight: 73,
        bmi,
        smoking: 'never',
        alcohol: 'none',
        physicalActivity: 'moderate',
        symptoms: [],
        notes: `Simulated continuous bio-telemetry record #${i + 1}`,
        riskScore: pred.riskScore,
        confidence: pred.confidence,
        riskStatus: pred.riskStatus,
        modelName: pred.modelName,
      });
    }

    const current = this.getStoredHistory();
    this.saveHistory([...current, ...newRecords]);
  }
}

export const healthService = new HealthService();
