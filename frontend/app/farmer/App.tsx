import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { SharedLoginPage } from './pages/SharedLoginPage';
import { FarmerLayout } from './components/layout/FarmerLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MyFarmsPage } from './pages/MyFarmsPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { AdvisoryPage } from './pages/AdvisoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { OfficerPortalPage } from './pages/OfficerPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Shared Unified Authentication Gateway for Farmer, Officer, and Admin */}
            <Route path="/" element={<SharedLoginPage />} />
            <Route path="/login" element={<SharedLoginPage />} />

            {/* 2. Protected Farmer Portal Routes */}
            <Route element={<ProtectedRoute requiredRole="FARMER" />}>
              <Route path="/farmer" element={<FarmerLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="farms" element={<MyFarmsPage />} />
                <Route path="diagnosis" element={<DiseaseDetectionPage />} />
                <Route path="disease-detection" element={<DiseaseDetectionPage />} />
                <Route path="advisory" element={<AdvisoryPage />} />
                <Route path="ai-assistant" element={<AdvisoryPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* 3. Protected Officer Command Portal Routes */}
            <Route element={<ProtectedRoute requiredRole="OFFICER" />}>
              <Route path="/officer" element={<OfficerPortalPage />} />
              <Route path="/officer/dashboard" element={<OfficerPortalPage />} />
              <Route path="/officer/risk-map" element={<OfficerPortalPage />} />
              <Route path="/officer/outbreaks" element={<OfficerPortalPage />} />
              <Route path="/officer/farms" element={<OfficerPortalPage />} />
              <Route path="/officer/alerts" element={<OfficerPortalPage />} />
            </Route>

            {/* 4. Protected Admin Central Portal Routes */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin" element={<AdminPortalPage />} />
              <Route path="/admin/dashboard" element={<AdminPortalPage />} />
              <Route path="/admin/ai-monitoring" element={<AdminPortalPage />} />
              <Route path="/admin/users" element={<AdminPortalPage />} />
              <Route path="/admin/audit-logs" element={<AdminPortalPage />} />
            </Route>

            {/* Catch-all redirect to shared root gateway */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
