import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { FarmerLayout } from './components/layout/FarmerLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyFarmsPage } from './pages/MyFarmsPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Farmer Authentication */}
            <Route path="/farmer/login" element={<LoginPage />} />

            {/* Farmer Portal Shell & Pages */}
            <Route path="/farmer" element={<FarmerLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="farms" element={<MyFarmsPage />} />
              <Route path="diagnosis" element={<DiseaseDetectionPage />} />
              <Route path="disease-detection" element={<DiseaseDetectionPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Root redirects to Farmer Portal */}
            <Route path="/" element={<Navigate to="/farmer" replace />} />
            <Route path="*" element={<Navigate to="/farmer" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
