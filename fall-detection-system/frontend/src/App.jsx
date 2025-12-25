// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
// Mock component for pages not built yet
const HistoryPage = () => <h2>Incident History</h2>;
// const SettingsPage = () => <h2>System Settings</h2>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đầu tiên khi vào web là Landing Page (Login) */}
        <Route path="/" element={<LandingPage />} />

        {/* Sau khi login xong sẽ vào Dashboard layout */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="settings" element={<SettingsPage />} />
          <Route index element={<Dashboard />} />
          <Route path="history" element={<HistoryPage />} />
          {/* <Route path="settings" element={<SettingsPage />} /> */}
        </Route>

        {/* Bắt lỗi 404: Quay về trang login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;