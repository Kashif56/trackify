import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, Lock, Key, Globe } from 'lucide-react';
import paymentService from '../../../api/paymentService';

const PayPalGatewayForm = () => {
  const [formData, setFormData] = useState({
    client_id: '',
    client_secret: '',
    mode: 'sandbox', // Default to sandbox mode
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.client_id) {
      newErrors.client_id = 'Client ID is required';
    }
    
    if (!formData.client_secret) {
      newErrors.client_secret = 'Client Secret is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare gateway data
      const gatewayData = {
        gateway_name: 'paypal',
        is_active: true,
        is_default: true,
        credentials: {
          client_id: formData.client_id,
          client_secret: formData.client_secret,
          mode: formData.mode,
        }
      };
      
      // Create payment gateway
      await paymentService.createPaymentGateway(gatewayData);
      
      toast.success('PayPal gateway connected successfully');
      
      // Reset form
      setFormData({
        client_id: '',
        client_secret: '',
        mode: 'sandbox',
      });
      
      // Refresh the page to show the new gateway
      window.location.reload();
    } catch (error) {
      console.error('Error connecting PayPal gateway:', error);
      toast.error('Failed to connect PayPal gateway: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Globe className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              You can find your API credentials in your PayPal Developer Dashboard under 
              <a href="https://developer.paypal.com/dashboard/applications/sandbox" target="_blank" rel="noopener noreferrer" className="font-medium underline"> My Apps & Credentials</a>.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="client_id"
            value={formData.client_id}
            onChange={handleInputChange}
            placeholder="Enter your PayPal Client ID"
            className={`w-full pl-10 pr-4 py-3 border ${errors.client_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm transition-colors`}
          />
        </div>
        {errors.client_id && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.client_id}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="client_secret"
            value={formData.client_secret}
            onChange={handleInputChange}
            placeholder="Enter your PayPal Client Secret"
            className={`w-full pl-10 pr-4 py-3 border ${errors.client_secret ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm transition-colors`}
          />
        </div>
        {errors.client_secret && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.client_secret}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
        <div className="relative">
          <select
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm"
          >
            <option value="sandbox">Sandbox (Testing)</option>
            <option value="live">Live (Production)</option>
          </select>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Use Sandbox for testing and Live for processing real transactions.
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full inline-flex justify-center items-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-[#F97316] hover:bg-[#EA580C]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] transition-colors`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            'Connect PayPal Account'
          )}
        </button>
      </div>
    </form>
  );
};

export default PayPalGatewayForm;
