import React, { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import paymentService from '../../api/paymentService';
import StripePaymentForm from './gateways/StripePaymentForm';
import PayPalPaymentForm from './gateways/PayPalPaymentForm';

/**
 * Dynamic Payment Modal Component
 * 
 * This component adapts to different payment gateways based on what the invoice user has configured.
 * It loads the appropriate payment form component based on the gateway type.
 */
const PaymentModal = ({ invoice, isOpen, onClose, onPaymentSuccess, onPaymentError, onPaymentStart }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [gatewayInfo, setGatewayInfo] = useState(null);
  
  // Get user's currency preference from Redux store
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencySymbol = userCurrency === 'pkr' ? 'Rs ' : '$';

  // Fetch the available payment gateway for this invoice
  useEffect(() => {
    const fetchGatewayInfo = async () => {
      if (!isOpen || !invoice) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if invoice has payment gateway configured
        const checkResponse = await paymentService.checkInvoiceGateway(invoice.id);
        
        if (!checkResponse.has_gateway) {
          setError('No payment gateway configured for this invoice');
          if (onPaymentError) {
            onPaymentError('No payment gateway configured for this invoice');
          }
          setLoading(false);
          return;
        }
        
        // Get payment gateway info for this invoice
        const response = await paymentService.getInvoicePaymentGateway(invoice.id);
        setGatewayInfo(response);
      } catch (err) {
        setError(err.message || 'Failed to load payment options');
        if (onPaymentError) {
          onPaymentError(err.message || 'Failed to load payment options');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchGatewayInfo();
  }, [invoice, isOpen, onPaymentError]);

  const handlePaymentSuccess = (paymentResult) => {
    setPaymentCompleted(true);
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentResult);
    }
  };

  const handlePaymentError = (error) => {
    setError(error);
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  // Render the appropriate payment form based on gateway type
  const renderPaymentForm = () => {
    if (!gatewayInfo || !gatewayInfo.gateway_name) {
      return (
        <div className="text-center py-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Payment Not Available</h4>
          <p className="text-gray-600 mb-6">
            The invoice owner has not set up online payments yet.
          </p>
        </div>
      );
    }

    switch (gatewayInfo.gateway_name) {
      case 'stripe':
        return (
          <StripePaymentForm 
            invoice={invoice}
            gatewayInfo={gatewayInfo}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onStart={onPaymentStart}
            onClose={onClose}
          />
        );
      case 'paypal':
        return (
          <PayPalPaymentForm 
            invoice={invoice}
            gatewayInfo={gatewayInfo}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onStart={onPaymentStart}
            onClose={onClose}
          />
        );
      default:
        return (
          <div className="text-center py-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Unsupported Payment Method</h4>
            <p className="text-gray-600 mb-6">
              The payment method {gatewayInfo.gateway_name} is not supported yet.
            </p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {paymentCompleted ? 'Payment Successful' : 'Pay Invoice'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentCompleted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h4>
            <p className="text-gray-600 mb-6">
              Thank you for your payment. The invoice has been marked as paid.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Invoice #:</span>
                <span className="font-medium">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{currencySymbol}{invoice.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{invoice.user?.company_name || invoice.user?.username}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
                  <span className="ml-3 text-gray-600">Loading payment options...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              ) : (
                renderPaymentForm()
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
