export type HealthMetricStatus = 'normal' | 'warning' | 'danger';

export type RiskStatus = 'Low' | 'Moderate' | 'High' | 'Critical';

export type SmokingStatus = 'never' | 'former' | 'occasional' | 'daily';
export type AlcoholStatus = 'none' | 'light' | 'moderate' | 'heavy';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high';

export interface VitalsReading {
  id: string;
  timestamp: string;
  dateStr: string;
  heartRate: number; // bpm (Normal: 60-100)
  systolicBp: number; // mmHg (Normal: 90-120)
  diastolicBp: number; // mmHg (Normal: 60-80)
  spo2: number; // % (Normal: 95-100)
  temperature: number; // °C (Normal: 36.1 - 37.2)
  glucose: number; // mg/dL (Normal: 70-99 fasting)
  height: number; // cm
  weight: number; // kg
  bmi: number;
  smoking: SmokingStatus;
  alcohol: AlcoholStatus;
  physicalActivity: ActivityLevel;
  symptoms: string[];
  notes?: string;
  
  // AI Prediction snapshot
  riskScore: number; // 0.00 to 1.00 (e.g. 0.06)
  confidence: number; // 0 to 100% (e.g. 94%)
  riskStatus: RiskStatus;
  modelName: string; // e.g. "Random Forest"
}

export interface RiskFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // percentage or impact score
  description: string;
}

export interface RiskPrediction {
  riskScore: number;
  confidence: number;
  riskStatus: RiskStatus;
  modelName: string;
  modelVersion: string;
  topFactors: RiskFactor[];
  recommendations: string[];
  radarScores: {
    cardiovascular: number;
    metabolic: number;
    respiratory: number;
    lifestyle: number;
    thermal: number;
    autonomic: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  physician: {
    name: string;
    clinic: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  provider?: 'google' | 'guest' | 'email';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  read: boolean;
}

export interface AppSettings {
  tempUnit: 'C' | 'F';
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'in';
  apiMode: 'mock' | 'fastapi';
  apiBaseUrl: string;
  simulatedLatency: number;
  connectedDevices: {
    smartwatch: boolean;
    pulseOximeter: boolean;
    bloodPressureCuff: boolean;
    glucometer: boolean;
  };
  alertThresholds: {
    maxHeartRate: number;
    minHeartRate: number;
    maxSystolic: number;
    minSpo2: number;
    maxGlucose: number;
  };
}
