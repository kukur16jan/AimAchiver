import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PeersPage from './pages/PeersPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Layout/Navbar';
import LoadingSpinner from './components/UI/LoadingSpinner';
import LandingPage from './pages/LandingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AcceptPeerPage from './pages/AcceptPeerPage';
import PeersWhoAddedMePage from './pages/PeersWhoAddedMePage';
import PeerDashboardPage from './pages/PeerDashboardPage';
import MyPeerCommentsPage from './pages/MyPeerCommentsPage';

function ProtectedAppContent() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to landing page, but preserve attempted URL for possible redirect after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="flex justify-between min-h-screen p-1 bg-slate-50">
      <Navbar />
      <main className="w-full px-2 pt-6 sm:w-10/12">
        <Routes>
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="peers" element={<PeersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/peers-who-added-me" element={<PeersWhoAddedMePage />} />
          <Route path="/my-peer-comments" element={<MyPeerCommentsPage />} />
          <Route path="/peer-dashboard/:peerId" element={<PeerDashboardPage />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/peers/accept/:token" element={<AcceptPeerPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedAppContent />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;