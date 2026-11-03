import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { VitalsReading, RiskPrediction } from '../types';
import { healthService } from '../services/healthService';
import { calculateAIRiskPrediction } from '../utils/healthCalculators';

interface HealthDataContextType {
  history: VitalsReading[];
  latest: VitalsReading | null;
  prediction: RiskPrediction | null;
  isLoading: boolean;
  addReading: (entry: Omit<VitalsReading, 'id' | 'timestamp' | 'dateStr' | 'riskScore' | 'confidence' | 'riskStatus' | 'modelName'>) => Promise<VitalsReading>;
  deleteReading: (id: string) => Promise<void>;
  resetToDemo: () => Promise<void>;
  generateSimulatedData: (count?: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<VitalsReading[]>([]);
  const [latest, setLatest] = useState<VitalsReading | null>(null);
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await healthService.getHistory();
      setHistory(data);
      const latestReading = data[0] || null;
      setLatest(latestReading);

      if (latestReading) {
        const pred = calculateAIRiskPrediction({
          heartRate: latestReading.heartRate,
          systolicBp: latestReading.systolicBp,
          diastolicBp: latestReading.diastolicBp,
          spo2: latestReading.spo2,
          temperature: latestReading.temperature,
          glucose: latestReading.glucose,
          bmi: latestReading.bmi,
          smoking: latestReading.smoking,
          alcohol: latestReading.alcohol,
          physicalActivity: latestReading.physicalActivity,
        });
        setPrediction(pred);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addReading = async (entry: Omit<VitalsReading, 'id' | 'timestamp' | 'dateStr' | 'riskScore' | 'confidence' | 'riskStatus' | 'modelName'>) => {
    const created = await healthService.submitVitals(entry);
    await refresh();
    return created;
  };

  const deleteReading = async (id: string) => {
    await healthService.deleteReading(id);
    await refresh();
  };

  const resetToDemo = async () => {
    await healthService.resetToDemoData();
    await refresh();
  };

  const generateSimulatedData = async (count = 10) => {
    await healthService.generateRandomHistoricalData(count);
    await refresh();
  };

  return (
    <HealthDataContext.Provider
      value={{
        history,
        latest,
        prediction,
        isLoading,
        addReading,
        deleteReading,
        resetToDemo,
        generateSimulatedData,
        refresh,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
