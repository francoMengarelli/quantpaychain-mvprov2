import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import Marketplace from '@/pages/Marketplace';
import TokenDetail from '@/pages/TokenDetail';
import CreateAsset from '@/pages/CreateAsset';
import Portfolio from '@/pages/Portfolio';
import Reports from '@/pages/Reports';
import PaymentSuccess from '@/pages/PaymentSuccess';
import EarningsTracker from '@/pages/EarningsTracker';
import AuthCallback from '@/pages/AuthCallback';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import '@/App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } />
            
            <Route path="/token/:id" element={
              <ProtectedRoute>
                <TokenDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/create-asset" element={
              <ProtectedRoute>
                <CreateAsset />
              </ProtectedRoute>
            } />
            
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            
            <Route path="/earnings" element={
              <ProtectedRoute>
                <EarningsTracker />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            
            <Route path="/payment-success" element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
