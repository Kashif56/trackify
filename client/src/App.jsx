import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

// Core Pages
import LandingPage from './pages/core/LandingPage';
import FeaturesPage from './pages/core/FeaturesPage';
import PricingPage from './pages/core/PricingPage';
import ContactPage from './pages/core/ContactPage';

// Auth Pages
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import VerifyEmail from './pages/users/VerifyEmail';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import ExpensesPage from './pages/dashboard/ExpensesPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { tokens } = useSelector((state) => state.user);
  return tokens ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <HelmetProvider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
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
      </Routes>
    </HelmetProvider>
  );
}

export default App;
