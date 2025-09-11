import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './pages/core/LandingPage';
import FeaturesPage from './pages/core/FeaturesPage';
import PricingPage from './pages/core/PricingPage';
import ContactPage from './pages/core/ContactPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
     
      </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
