import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

// Lazy loading views
const Login = React.lazy(() => import('./views/auth/Login'));
const Register = React.lazy(() => import('./views/auth/Register'));
const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const JobSearch = React.lazy(() => import('./views/jobs/JobSearch'));
const ResumeHub = React.lazy(() => import('./views/resume/ResumeHub'));
const ApplicationTracker = React.lazy(() => import('./views/applications/ApplicationTracker'));
const AdminPanel = React.lazy(() => import('./views/admin/AdminPanel'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="jobs" element={<JobSearch />} />
        <Route path="resume" element={<ResumeHub />} />
        <Route path="applications" element={<ApplicationTracker />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <AppRoutes />
      </React.Suspense>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
