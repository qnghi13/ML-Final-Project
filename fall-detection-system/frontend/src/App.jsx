import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Trang Login */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. CẤU HÌNH LAYOUT CHUNG (Không set path ở đây) */}
        {/* Route này chỉ có tác dụng bọc MainLayout cho các trang con bên trong */}
        <Route element={<MainLayout />}>
          
          {/* Đường dẫn: localhost:5173/dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Đường dẫn: localhost:5173/history (Tách riêng hẳn hoi) */}
          <Route path="/history" element={<HistoryPage />} />

          <Route path="/change-password" element={<ChangePasswordPage />} />

        </Route>

        {/* 3. Bắt lỗi 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;