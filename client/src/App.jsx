import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

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

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <ExpensesPage />
          </ProtectedRoute>
        } />
        
        {/* Clients Route */}
        <Route path="/clients" element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        } />
        
        {/* Analytics Route */}
        <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        
        {/* Invoice Routes */}
        <Route path="/invoices" element={
          <ProtectedRoute>
            <InvoicesPage />
          </ProtectedRoute>
        } />
        <Route path="/invoices/add" element={
          <ProtectedRoute>
            <AddInvoicePage />
          </ProtectedRoute>
        } />
        <Route path="/invoices/:id" element={
          <ProtectedRoute>
            <InvoiceDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/invoices/edit/:id" element={
          <ProtectedRoute>
            <EditInvoicePage />
          </ProtectedRoute>
        } />
        
        {/* Profile Route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
      
        
        {/* Payment Settings Route */}
        <Route path="/payment-settings" element={
          <ProtectedRoute>
            <PaymentSettingsPage />
          </ProtectedRoute>
        } />
        
        {/* Payment Routes */}
        <Route path="/payments" element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        } />
      
        
       
      </Routes>
    </>
  );
}

export default App;
