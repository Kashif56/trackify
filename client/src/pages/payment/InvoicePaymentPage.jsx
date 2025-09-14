import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import invoiceService from '../../api/invoiceService';
import paymentService from '../../api/paymentService';
import InvoiceTemplate from '../../components/Dashboard/InvoiceTemplate';
import logo from '../../assets/logo.svg';

/**
 * InvoicePaymentPage Component
 * 
 * A dedicated page for clients to pay invoices online.
 * This page is publicly accessible via a unique link.
 */
const InvoicePaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for invoice and payment data
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  
  // Check for success or cancel query params
  const queryParams = new URLSearchParams(location.search);
  const paymentSuccess = queryParams.get('payment_success');
  const paymentCancelled = queryParams.get('payment_cancelled');
  const sessionId = queryParams.get('session_id');
  
  // Fetch invoice on component mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getInvoiceById(id);
        setInvoice(data);
        
        // Check if there's an existing payment
        try {
          const paymentInfo = await paymentService.getPublicPaymentInfo(id);
          setPaymentStatus(paymentInfo.status);
        } catch (err) {
          console.log('No payment info found');
        }
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch invoice');
        toast.error('Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchInvoice();
    }
  }, [id]);
  
  // Handle payment success or cancel
  useEffect(() => {
    if (paymentSuccess === 'true' && sessionId) {
      toast.success('Payment successful! The invoice has been marked as paid.');
      // Refresh invoice data to get updated status
      invoiceService.getInvoiceById(id).then(data => {
        setInvoice(data);
        setPaymentStatus('completed');
      });
    } else if (paymentCancelled === 'true') {
      toast.info('Payment was cancelled.');
    }
  }, [paymentSuccess, paymentCancelled, sessionId, id]);
  
  // Handle payment button click
  const handlePayNow = async () => {
    try {
      setPaymentLoading(true);
      
      // Create success and cancel URLs
      const origin = window.location.origin;
      const successUrl = `${origin}/payment/${id}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/payment/${id}?payment_cancelled=true`;
      
      // Create payment session
      const result = await paymentService.createPaymentSession(id, successUrl, cancelUrl);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      // Store payment ID for future reference
      setPaymentId(result.payment_id);
      
      // Redirect to checkout URL
      window.location.href = result.checkout_url;
      
    } catch (err) {
      toast.error(err.message || 'Failed to create payment session');
    } finally {
      setPaymentLoading(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#F97316] mx-auto" />
          <p className="mt-4 text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Navbar */}
      <nav className="py-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={logo} alt="Trackify Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Trackify</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoice_number}</h1>
            <div className="mt-1">
              <PaymentStatusBadge status={invoice.status} paymentStatus={paymentStatus} />
            </div>
          </div>
          
          {/* Payment Button */}
          {invoice.status !== 'paid' && paymentStatus !== 'completed' && (
            <div className="mt-4 md:mt-0">
              <button
                onClick={handlePayNow}
                disabled={paymentLoading}
                className={`px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-md transition-colors flex items-center ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Payment Success Message */}
          {(invoice.status === 'paid' || paymentStatus === 'completed') && (
            <div className="mt-4 md:mt-0 bg-green-50 text-green-700 px-4 py-3 rounded-md flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Payment Complete</span>
            </div>
          )}
        </div>
        
        {/* Invoice Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <InvoiceTemplate 
            invoice={invoice}
            user={invoice.user}
            client={invoice.client_details}
            darkMode={false}
            showThemeToggle={false}
            bankDetails={{
              accountName: invoice.user?.company_name || 'Your Company Account',
              accountNumber: invoice.user?.bank_account || 'XXXX-XXXX-XXXX-XXXX',
              bankName: invoice.user?.bank_name || 'Your Bank Name',
              swiftCode: invoice.user?.swift_code || 'SWIFTCODE',
              routingNumber: invoice.user?.routing_number || '123456789'
            }}
            actions={null}
          />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by <a href="/" className="text-[#F97316] hover:text-[#EA580C] font-medium">Trackify</a></p>
        </div>
      </div>
    </div>
  );
};

// Helper component for payment status badge
const PaymentStatusBadge = ({ status, paymentStatus }) => {
  // If we have a payment status, use that instead of invoice status
  const displayStatus = paymentStatus || status;
  
  let bgColor = '';
  let textColor = '';
  let icon = null;
  
  switch(displayStatus?.toLowerCase()) {
    case 'paid':
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      break;
    case 'pending':
    case 'processing':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      icon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
      break;
    case 'unpaid':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      icon = <CreditCard className="w-4 h-4 mr-1" />;
      break;
    case 'failed':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  // Format the display text
  let displayText = displayStatus;
  if (displayStatus === 'completed') displayText = 'Paid';
  else if (displayStatus === 'processing') displayText = 'Processing';
  
  return (
    <span className={`${bgColor} ${textColor} text-sm font-medium px-3 py-1 rounded-full flex items-center inline-flex`}>
      {icon}
      {displayText ? displayText.charAt(0).toUpperCase() + displayText.slice(1) : 'Unknown'}
    </span>
  );
};

export default InvoicePaymentPage;
