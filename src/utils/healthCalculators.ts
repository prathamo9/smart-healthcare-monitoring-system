import { HealthMetricStatus, RiskStatus, RiskPrediction, VitalsReading, SmokingStatus, AlcoholStatus, ActivityLevel } from '../types';

/**
 * Metric normal ranges & status determination
 */
export function getHeartRateStatus(bpm: number): { status: HealthMetricStatus; label: string; text: string } {
  if (bpm >= 60 && bpm <= 100) {
    return { status: 'normal', label: 'Normal', text: 'Optimal resting heart rate' };
  } else if ((bpm >= 50 && bpm < 60) || (bpm > 100 && bpm <= 115)) {
    return { status: 'warning', label: 'Borderline', text: bpm < 60 ? 'Mild Bradycardia' : 'Mild Tachycardia' };
  } else {
    return { status: 'danger', label: 'Abnormal', text: bpm < 50 ? 'Significant Bradycardia' : 'High Tachycardia' };
  }
}

export function getBloodPressureStatus(systolic: number, diastolic: number): { status: HealthMetricStatus; label: string; text: string } {
  if (systolic < 120 && diastolic < 80) {
    return { status: 'normal', label: 'Normal', text: 'Optimal arterial pressure' };
  } else if (systolic <= 129 && diastolic < 80) {
    return { status: 'warning', label: 'Elevated', text: 'Elevated blood pressure' };
  } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return { status: 'warning', label: 'Stage 1 HTN', text: 'Stage 1 Hypertension' };
  } else {
    return { status: 'danger', label: 'Stage 2 HTN', text: 'Hypertension Stage 2 or Crisis' };
  }
}

export function getSpo2Status(spo2: number): { status: HealthMetricStatus; label: string; text: string } {
  if (spo2 >= 95) {
    return { status: 'normal', label: 'Normal', text: 'Optimal blood oxygen saturation' };
  } else if (spo2 >= 92 && spo2 < 95) {
    return { status: 'warning', label: 'Mild Hypoxia', text: 'Slightly reduced oxygen saturation' };
  } else {
    return { status: 'danger', label: 'Low SpO2', text: 'Critical hypoxemia risk' };
  }
}

export function getTemperatureStatus(tempC: number): { status: HealthMetricStatus; label: string; text: string } {
  if (tempC >= 36.1 && tempC <= 37.2) {
    return { status: 'normal', label: 'Normal', text: 'Normothermia' };
  } else if ((tempC >= 37.3 && tempC <= 37.9) || (tempC >= 35.5 && tempC < 36.1)) {
    return { status: 'warning', label: 'Low Grade', text: tempC > 37.2 ? 'Low-grade pyrexia' : 'Mild hypothermia' };
  } else {
    return { status: 'danger', label: 'Fever/Chills', text: tempC > 37.9 ? 'High Fever' : 'Hypothermia' };
  }
}

export function getGlucoseStatus(glucose: number): { status: HealthMetricStatus; label: string; text: string } {
  if (glucose >= 70 && glucose <= 99) {
    return { status: 'normal', label: 'Normal', text: 'Normal fasting blood glucose' };
  } else if ((glucose >= 100 && glucose <= 125) || (glucose >= 60 && glucose < 70)) {
    return { status: 'warning', label: 'Prediabetes', text: glucose > 99 ? 'Impaired fasting glucose' : 'Borderline hypoglycemia' };
  } else {
    return { status: 'danger', label: 'Abnormal', text: glucose > 125 ? 'Hyperglycemia / Diabetes range' : 'Hypoglycemia' };
  }
}

/**
 * Calculate BMI
 */
export function calculateBMI(heightCm: number, weightKg: number): { bmi: number; category: string; status: HealthMetricStatus } {
  if (!heightCm || !weightKg || heightCm <= 0) return { bmi: 0, category: 'N/A', status: 'normal' };
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  
  if (bmi < 18.5) return { bmi, category: 'Underweight', status: 'warning' };
  if (bmi < 25.0) return { bmi, category: 'Normal weight', status: 'normal' };
  if (bmi < 30.0) return { bmi, category: 'Overweight', status: 'warning' };
  return { bmi, category: 'Obesity class', status: 'danger' };
}

/**
 * Simulated Random Forest AI Risk Prediction Engine
 * Computes deterministic clinical risk stratification based on multi-parameter vitals & lifestyle
 */
export function calculateAIRiskPrediction(params: {
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  spo2: number;
  temperature: number;
  glucose: number;
  bmi: number;
  smoking: SmokingStatus;
  alcohol: AlcoholStatus;
  physicalActivity: ActivityLevel;
}): RiskPrediction {
  let riskScore = 0.04; // Baseline healthy risk score
  const topFactors: RiskPrediction['topFactors'] = [];
  const recommendations: string[] = [];

  // Blood Pressure Impact (Framingham weighting)
  if (params.systolicBp >= 140 || params.diastolicBp >= 90) {
    riskScore += 0.32;
    topFactors.push({
      factor: 'Hypertension (Elevated BP)',
      impact: 'negative',
      weight: 32,
      description: `Systolic ${params.systolicBp} / Diastolic ${params.diastolicBp} indicates hypertension stage 2.`
    });
    recommendations.push('Schedule clinical blood pressure check and consider ambulatory BP monitoring.');
  } else if (params.systolicBp >= 130 || params.diastolicBp >= 85) {
    riskScore += 0.15;
    topFactors.push({
      factor: 'Prehypertension',
      impact: 'negative',
      weight: 15,
      description: `Systolic ${params.systolicBp} mmHg is in the elevated/stage 1 range.`
    });
    recommendations.push('Reduce dietary sodium intake and practice daily cardiovascular exercise.');
  } else {
    topFactors.push({
      factor: 'Blood Pressure Optimal',
      impact: 'positive',
      weight: 20,
      description: `${params.systolicBp}/${params.diastolicBp} mmHg within optimal healthy cardiovascular baseline.`
    });
  }

  // Glucose Impact
  if (params.glucose >= 140) {
    riskScore += 0.28;
    topFactors.push({
      factor: 'Hyperglycemia',
      impact: 'negative',
      weight: 28,
      description: `Fasting blood glucose ${params.glucose} mg/dL suggests significant metabolic dysregulation.`
    });
    recommendations.push('Request an HbA1c laboratory assessment and consult an endocrinologist.');
  } else if (params.glucose >= 105) {
    riskScore += 0.12;
    topFactors.push({
      factor: 'Impaired Fasting Glucose',
      impact: 'negative',
      weight: 12,
      description: `Glucose ${params.glucose} mg/dL is moderately elevated above 99 mg/dL.`
    });
    recommendations.push('Monitor post-meal blood sugar and limit refined carbohydrates.');
  } else {
    topFactors.push({
      factor: 'Glucose Regulation',
      impact: 'positive',
      weight: 15,
      description: `${params.glucose} mg/dL shows healthy glycemic control.`
    });
  }

  // SpO2 Impact
  if (params.spo2 < 93) {
    riskScore += 0.35;
    topFactors.push({
      factor: 'Hypoxemia Risk',
      impact: 'negative',
      weight: 35,
      description: `SpO2 ${params.spo2}% is critically low.`
    });
    recommendations.push('Seek immediate medical attention for persistent low blood oxygen saturation.');
  } else if (params.spo2 < 95) {
    riskScore += 0.12;
    topFactors.push({
      factor: 'Mild Sub-optimal Oxygenation',
      impact: 'negative',
      weight: 12,
      description: `SpO2 ${params.spo2}% is slightly below ideal 95-100% threshold.`
    });
  } else {
    topFactors.push({
      factor: 'Oxygen Saturation Normal',
      impact: 'positive',
      weight: 10,
      description: `SpO2 ${params.spo2}% indicates robust respiratory gas exchange.`
    });
  }

  // Heart Rate Impact
  if (params.heartRate > 105 || params.heartRate < 48) {
    riskScore += 0.14;
    topFactors.push({
      factor: params.heartRate > 105 ? 'Tachycardia' : 'Marked Bradycardia',
      impact: 'negative',
      weight: 14,
      description: `Resting heart rate ${params.heartRate} bpm is outside normal 60-100 bpm boundaries.`
    });
  }

  // BMI Impact
  if (params.bmi >= 30) {
    riskScore += 0.12;
    topFactors.push({
      factor: 'Elevated BMI (Obesity Range)',
      impact: 'negative',
      weight: 12,
      description: `BMI ${params.bmi} contributes to longitudinal cardiometabolic stress.`
    });
    recommendations.push('Incorporate structured dietary management and progressive strength workouts.');
  } else if (params.bmi >= 25) {
    riskScore += 0.05;
  }

  // Lifestyle Factors
  if (params.smoking === 'daily') {
    riskScore += 0.18;
    topFactors.push({
      factor: 'Daily Tobacco Exposure',
      impact: 'negative',
      weight: 18,
      description: 'Significantly accelerates vascular stiffness and atherogenesis.'
    });
    recommendations.push('Utilize smoking cessation counseling and nicotine-replacement therapies.');
  } else if (params.smoking === 'occasional') {
    riskScore += 0.08;
  }

  if (params.physicalActivity === 'sedentary') {
    riskScore += 0.08;
    topFactors.push({
      factor: 'Sedentary Lifestyle',
      impact: 'negative',
      weight: 8,
      description: 'Lack of regular physical activity impairs vascular endothelium and metabolic rate.'
    });
    recommendations.push('Aim for 150 minutes of moderate aerobic activity (e.g. brisk walking) weekly.');
  } else if (params.physicalActivity === 'high' || params.physicalActivity === 'moderate') {
    riskScore = Math.max(0.02, riskScore - 0.05);
    topFactors.push({
      factor: 'Active Physical Regimen',
      impact: 'positive',
      weight: 15,
      description: 'Regular physical activity provides robust cardiovascular protection.'
    });
  }

  // Clamping score
  const finalScore = parseFloat(Math.min(0.99, Math.max(0.02, riskScore)).toFixed(2));
  
  // Risk Status Categorization
  let riskStatus: RiskStatus = 'Low';
  if (finalScore >= 0.70) riskStatus = 'Critical';
  else if (finalScore >= 0.40) riskStatus = 'High';
  else if (finalScore >= 0.18) riskStatus = 'Moderate';
  else riskStatus = 'Low';

  // Confidence calculation (simulation of Random Forest ensemble agreement)
  const confidence = Math.round(92 + (1 - Math.abs(finalScore - 0.5) * 0.2) * 6);

  if (recommendations.length === 0) {
    recommendations.push('Maintain consistent sleep schedule (7-8 hours nightly).');
    recommendations.push('Keep up routine hydration and balanced whole-food nutritional habits.');
    recommendations.push('Continue periodic bi-weekly health vitals logging.');
  }

  // Multi-system radar scores (0 to 100, where 100 is optimal health)
  const cardiovascular = Math.max(10, Math.min(100, Math.round(100 - (params.systolicBp - 110) * 1.2 - (params.heartRate > 80 ? (params.heartRate - 80) * 1.5 : 0))));
  const metabolic = Math.max(10, Math.min(100, Math.round(100 - (params.glucose - 85) * 1.1 - (params.bmi > 24 ? (params.bmi - 24) * 4 : 0))));
  const respiratory = Math.max(15, Math.min(100, Math.round(params.spo2 >= 95 ? 95 + (params.spo2 - 95) : params.spo2 * 0.95)));
  const lifestyle = params.physicalActivity === 'high' ? 95 : params.physicalActivity === 'moderate' ? 82 : params.physicalActivity === 'light' ? 65 : 45;
  const thermal = params.temperature >= 36.3 && params.temperature <= 37.0 ? 98 : 75;
  const autonomic = Math.max(20, Math.min(100, 100 - Math.abs(params.heartRate - 72) * 1.5));

  return {
    riskScore: finalScore,
    confidence: Math.min(99, Math.max(88, confidence)),
    riskStatus,
    modelName: 'Random Forest',
    modelVersion: 'v2.4 - Ensemble Classifier',
    topFactors,
    recommendations,
    radarScores: {
      cardiovascular,
      metabolic,
      respiratory,
      lifestyle: params.smoking === 'daily' ? lifestyle - 30 : lifestyle,
      thermal,
      autonomic: Math.round(autonomic)
    }
  };
}
