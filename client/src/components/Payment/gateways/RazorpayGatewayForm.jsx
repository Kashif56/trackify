import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, Lock, Key, Globe } from 'lucide-react';
import paymentService from '../../../api/paymentService';

const RazorpayGatewayForm = () => {
  const [formData, setFormData] = useState({
    key_id: '',
    key_secret: '',
    webhook_secret: '',
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
    
    if (!formData.key_id) {
      newErrors.key_id = 'Key ID is required';
    } else if (!formData.key_id.startsWith('rzp_')) {
      newErrors.key_id = 'Invalid Key ID format';
    }
    
    if (!formData.key_secret) {
      newErrors.key_secret = 'Key Secret is required';
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
        gateway_name: 'razorpay',
        is_active: true,
        is_default: true,
        credentials: {
          key_id: formData.key_id,
          key_secret: formData.key_secret,
          webhook_secret: formData.webhook_secret || null,
        }
      };
      
      // Create payment gateway
      await paymentService.createPaymentGateway(gatewayData);
      
      toast.success('Razorpay gateway connected successfully');
      
      // Reset form
      setFormData({
        key_id: '',
        key_secret: '',
        webhook_secret: '',
      });
      
      // Refresh the page to show the new gateway
      window.location.reload();
    } catch (error) {
      console.error('Error connecting Razorpay gateway:', error);
      toast.error('Failed to connect Razorpay gateway: ' + (error.response?.data?.message || 'Unknown error'));
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
              You can find your API keys in your Razorpay Dashboard under 
              <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="font-medium underline"> Settings &gt; API Keys</a>.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="key_id"
            value={formData.key_id}
            onChange={handleInputChange}
            placeholder="rzp_test_..."
            className={`w-full pl-10 pr-4 py-3 border ${errors.key_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm transition-colors`}
          />
        </div>
        {errors.key_id && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.key_id}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="key_secret"
            value={formData.key_secret}
            onChange={handleInputChange}
            placeholder="Enter your Key Secret"
            className={`w-full pl-10 pr-4 py-3 border ${errors.key_secret ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm transition-colors`}
          />
        </div>
        {errors.key_secret && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.key_secret}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret (Optional)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="webhook_secret"
            value={formData.webhook_secret}
            onChange={handleInputChange}
            placeholder="Enter your Webhook Secret"
            className={`w-full pl-10 pr-4 py-3 border ${errors.webhook_secret ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm transition-colors`}
          />
        </div>
        {errors.webhook_secret && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.webhook_secret}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          The webhook secret is used to verify that webhook events were sent by Razorpay.
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
            'Connect Razorpay Account'
          )}
        </button>
      </div>
    </form>
  );
};

export default RazorpayGatewayForm;
