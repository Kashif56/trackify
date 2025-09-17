import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

// Error Handling Components
import ErrorBoundary from './components/errors/ErrorBoundary';
import NotFoundPage from './pages/errors/NotFoundPage';

// Test Components
import InvoiceTemplateTest from './components/Dashboard/InvoiceTemplateTest';

// Core Pages
import LandingPage from './pages/core/LandingPage';
import FeaturesPage from './pages/core/FeaturesPage';
import PricingPage from './pages/core/PricingPage';

// Auth Pages
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import VerifyEmail from './pages/users/VerifyEmail';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import ExpensesPage from './pages/dashboard/ExpensesPage';
import ClientsPage from './pages/dashboard/clients/ClientsPage';
import AnalyticsPage from './pages/dashboard/analytics/AnalyticsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import PaymentSettingsPage from './pages/dashboard/PaymentSettingsPage';

// Invoice Pages
import InvoicesPage from './pages/dashboard/invoices/InvoicesPage';
import AddInvoicePage from './pages/dashboard/invoices/AddInvoicePage';
import EditInvoicePage from './pages/dashboard/invoices/EditInvoicePage';
import InvoiceDetailPage from './pages/dashboard/invoices/InvoiceDetailPage';

// Payment Pages
import PaymentHistory from './pages/PaymentHistory';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { tokens } = useSelector((state) => state.user);
  return tokens ? children : <Navigate to="/login" />;
};

// Error Protected Route Component
const ErrorProtectedRoute = ({ children }) => {
  const { tokens } = useSelector((state) => state.user);
  return tokens ? (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  ) : (
    <Navigate to="/login" />
  );
};

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
       
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ErrorProtectedRoute>
            <Dashboard />
          </ErrorProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ErrorProtectedRoute>
            <ExpensesPage />
          </ErrorProtectedRoute>
        } />
        
        {/* Clients Route */}
        <Route path="/clients" element={
          <ErrorProtectedRoute>
            <ClientsPage />
          </ErrorProtectedRoute>
        } />
        
        {/* Analytics Route */}
        <Route path="/analytics" element={
          <ErrorProtectedRoute>
            <AnalyticsPage />
          </ErrorProtectedRoute>
        } />
        
        {/* Invoice Routes */}
        <Route path="/invoices" element={
          <ErrorProtectedRoute>
            <InvoicesPage />
          </ErrorProtectedRoute>
        } />
        <Route path="/invoices/add" element={
          <ErrorProtectedRoute>
            <AddInvoicePage />
          </ErrorProtectedRoute>
        } />
        <Route path="/invoices/:id" element={
          <ErrorProtectedRoute>
            <InvoiceDetailPage />
          </ErrorProtectedRoute>
        } />
        <Route path="/invoices/edit/:id" element={
          <ErrorProtectedRoute>
            <EditInvoicePage />
          </ErrorProtectedRoute>
        } />
        
        {/* Profile Route */}
        <Route path="/profile" element={
          <ErrorProtectedRoute>
            <ProfilePage />
          </ErrorProtectedRoute>
        } />
        
      
        
        {/* Payment Settings Route */}
        <Route path="/payment-settings" element={
          <ErrorProtectedRoute>
            <PaymentSettingsPage />
          </ErrorProtectedRoute>
        } />
        
        {/* Payment Routes */}
        <Route path="/payments" element={
          <ErrorProtectedRoute>
            <PaymentHistory />
          </ErrorProtectedRoute>
        } />
      
        
       
            {/* 404 Route - Must be last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
