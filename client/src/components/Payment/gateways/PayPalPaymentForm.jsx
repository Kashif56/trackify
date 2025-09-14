import React, { useState, useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Loader2, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import paymentService from '../../../api/paymentService';

const PayPalPaymentForm = ({ invoice, gatewayInfo, onSuccess, onError, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  
  // Get user's currency preference from Redux store
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencyCode = userCurrency === 'pkr' ? 'PKR' : 'USD';

  useEffect(() => {
    // Create a payment session when the component mounts
    const createPaymentSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create a payment session using the centralized API with currency
        const response = await paymentService.createPaymentSession(
          invoice.id,
          window.location.href, // Success URL (we'll handle this in the component)
          window.location.href, // Cancel URL (we'll handle this in the component)
          userCurrency.toLowerCase() // Pass the user's currency preference
        );
        
        setSessionData(response);
      } catch (error) {
        setError(error.message || 'Failed to initialize payment');
        onError(error.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    if (invoice && gatewayInfo) {
      createPaymentSession();
    }
  }, [invoice, gatewayInfo, onError]);

  const handleCreateOrder = () => {
    // Return the order ID from the session data
    return Promise.resolve(sessionData.order_id);
  };

  const handleApprove = async (data) => {
    try {
      setLoading(true);
      
      // Capture the payment using the centralized API
      const response = await paymentService.capturePayment(
        sessionData.payment_id,
        data.orderID
      );
      
      // Update the payment status
      await paymentService.updatePaymentStatus(
        sessionData.payment_id,
        'completed',
        data.orderID
      );
      
      onSuccess(response);
    } catch (error) {
      setError(error.message || 'Failed to capture payment');
      onError(error.message || 'Failed to capture payment');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    setError(err.message || 'PayPal payment error');
    onError(err.message || 'PayPal payment error');
  };

  const handleCancel = () => {
    setError('Payment was cancelled');
    onError('Payment was cancelled');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
        <span className="ml-3 text-gray-600">Initializing payment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
        <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!sessionData || !gatewayInfo.client_id) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>Unable to initialize PayPal payment. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PayPalScriptProvider options={{ 
        "client-id": gatewayInfo.client_id,
        currency: currencyCode || 'USD'
      }}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay'
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={handleError}
          onCancel={handleCancel}
        />
      </PayPalScriptProvider>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PayPalPaymentForm;
