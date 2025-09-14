import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import paymentService from '../../../api/paymentService';

// Initialize Stripe with the publishable key from gateway info
const getStripePromise = (publishable_key) => loadStripe(publishable_key);

// Card form component that uses Stripe Elements
const CheckoutForm = ({ invoice, sessionData, onSuccess, onError, onStart, onClose, currencySymbol }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      setErrorMessage('Payment system is still initializing. Please try again in a moment.');
      return;
    }

    // Notify parent component that payment is starting
    if (onStart) {
      onStart();
    }
    
    setLoading(true);
    setErrorMessage('');
    
    // Validate card element has input
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card information is required');
      setLoading(false);
      return;
    }

    try {
      // Use the payment session ID to complete the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(sessionData.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: invoice.client_details?.name || 'Client',
            email: invoice.client_details?.email || '',
          },
        },
      });
      
      // Handle specific Stripe errors with user-friendly messages
      if (error) {
        console.error('Stripe payment error:', error);
        
        // Map common Stripe errors to user-friendly messages
        const errorMessages = {
          'card_declined': 'Your card was declined. Please try another payment method.',
          'expired_card': 'Your card has expired. Please use another card.',
          'incorrect_cvc': 'The security code (CVC) is incorrect. Please check and try again.',
          'processing_error': 'An error occurred while processing your card. Please try again.',
          'insufficient_funds': 'Your card has insufficient funds. Please use another card.',
          'invalid_expiry_year': 'The expiration year is invalid. Please check and try again.',
          'invalid_expiry_month': 'The expiration month is invalid. Please check and try again.',
          'invalid_number': 'The card number is invalid. Please check and try again.',
          'invalid_cvc': 'The security code (CVC) is invalid. Please check and try again.',
        };
        
        const friendlyMessage = error.code ? errorMessages[error.code] : null;
        setErrorMessage(friendlyMessage || error.message || 'An error occurred with your payment. Please try again.');

        onError(friendlyMessage || error.message || 'An error occurred with your payment. Please try again.');
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded, update the payment status on the server
        await paymentService.updatePaymentStatus(sessionData.payment_id, 'completed', paymentIntent.id);
        onSuccess(paymentIntent);
      } else {
        // Payment requires additional action or failed
        setErrorMessage(`Payment status: ${paymentIntent.status}`);
        onError(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      const errorMessage = 'An unexpected error occurred while processing your payment. Please try again later.';
      setErrorMessage(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
          Card details
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Show platform fee information if applicable */}
      {sessionData && sessionData.platform_fee > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
          <h4 className="font-medium mb-1">Payment Processing Fee</h4>
          <div className="flex justify-between text-sm">
            <span>Invoice Amount:</span>
            <span>{currencySymbol}{parseFloat(invoice.total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Platform Fee ({sessionData.platform_fee_percentage}%):</span>
            <span>{currencySymbol}{parseFloat(sessionData.platform_fee).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium mt-1 pt-1 border-t border-blue-200">
            <span>Total Amount:</span>
            <span>{currencySymbol}{parseFloat(sessionData.total_with_fee).toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium rounded-md transition-colors flex items-center ${
            loading || !stripe ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {sessionData && sessionData.platform_fee > 0 ? 
                `${currencySymbol}${parseFloat(sessionData.total_with_fee).toFixed(2)}` : 
                `${currencySymbol}${parseFloat(invoice.total).toFixed(2)}`}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Stripe Payment Form Component
const StripePaymentForm = ({ invoice, gatewayInfo, onSuccess, onError, onStart, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  
  // Get user's currency preference from Redux store
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencySymbol = userCurrency === 'pkr' ? 'Rs ' : '$';
  const currencyCode = userCurrency === 'pkr' ? 'pkr' : 'usd';

  useEffect(() => {
    // Set up Stripe with the public key from gateway info
    
    if (gatewayInfo && gatewayInfo.publishable_key) {
      setStripePromise(getStripePromise(gatewayInfo.publishable_key));
    }
  }, [gatewayInfo]);

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
          currencyCode // Pass the user's currency preference
        );

        console.log('Payment session created:', response);
        
        // Verify client_secret exists in the response
        if (!response.client_secret) {
          throw new Error('Missing client_secret in payment session response');
        }
        
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!sessionData || !stripePromise) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>Unable to initialize payment. Please try again later.</span>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        invoice={invoice}
        sessionData={sessionData}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
        currencySymbol={currencySymbol}
      />
    </Elements>
  );
};

export default StripePaymentForm;
