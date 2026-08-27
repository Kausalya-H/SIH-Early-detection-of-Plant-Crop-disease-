import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { FarmerLayout } from './components/layout/FarmerLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScanCropPage } from './pages/ScanCropPage';
import { ScanResultPage } from './pages/ScanResultPage';
import { ScanReportsPage } from './pages/ScanReportsPage';
import { MyFarmsPage } from './pages/MyFarmsPage';
import { FarmDetailPage } from './pages/FarmDetailPage';
import { AlertsPage } from './pages/AlertsPage';
import { AdvisoryPage } from './pages/AdvisoryPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Farmer Authentication */}
            <Route path="/farmer/login" element={<LoginPage />} />

            {/* Farmer Portal Shell Layout */}
            <Route path="/farmer" element={<FarmerLayout />}>
              <Route index element={<Navigate to="/farmer/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="scan" element={<ScanCropPage />} />
              <Route path="scan/:id" element={<ScanResultPage />} />
              <Route path="reports" element={<ScanReportsPage />} />
              <Route path="farms" element={<MyFarmsPage />} />
              <Route path="farms/:id" element={<FarmDetailPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="advisory" element={<AdvisoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Root redirect to Farmer Portal Dashboard */}
            <Route path="/" element={<Navigate to="/farmer/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
