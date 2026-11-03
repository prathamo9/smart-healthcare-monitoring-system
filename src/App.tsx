import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { HealthDataProvider } from './hooks/useHealthData';
import { ToastProvider } from './components/common/Toast';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { HealthInputPage } from './pages/HealthInputPage';
import { HealthHistoryPage } from './pages/HealthHistoryPage';
import { HealthTrendsPage } from './pages/HealthTrendsPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { MLReportPage } from './pages/MLReportPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HealthDataProvider>
          <ToastProvider>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Authenticated Dashboard Pages wrapped in DashboardLayout */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/input" element={<HealthInputPage />} />
                <Route path="/history" element={<HealthHistoryPage />} />
                <Route path="/trends" element={<HealthTrendsPage />} />
                <Route path="/risk" element={<RiskAnalysisPage />} />
                <Route path="/report" element={<MLReportPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ToastProvider>
        </HealthDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
