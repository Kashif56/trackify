import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Download, Printer, Send, 
  CheckCircle, AlertCircle, Lock, CreditCard, Copy, Share2
} from 'lucide-react';
import PaymentModal from '../../../components/Payment/PaymentModal';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../layout/DashboardLayout';
import invoiceService from '../../../api/invoiceService';
import paymentService from '../../../api/paymentService';
import InvoiceTemplate from '../../../components/Dashboard/InvoiceTemplate';
import InvoicePDF from '../../../components/Dashboard/InvoicePDF';
import logo from '../../../assets/logo.svg';
import { renderStatusBadge } from '../../../utils/invoiceUtils.jsx';

/**
 * InvoiceDetailPage Component
 * 
 * A dedicated page for viewing invoice details with options to:
 * - Download as PDF
 * - Print
 * - Mark as paid
 * - Send reminder
 * - Edit invoice
 */
const InvoiceDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for invoice data
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasPaymentGateway, setHasPaymentGateway] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Check if invoice user has payment gateway configured
  useEffect(() => {
    const checkPaymentGateway = async () => {
      if (invoice && invoice.id) {
        try {
          const response = await paymentService.checkInvoiceGateway(invoice.id);
          setHasPaymentGateway(response.has_gateway);
        } catch (err) {
          console.error('Failed to check payment gateway:', err);
          setHasPaymentGateway(false);
        }
      }
    };
    
    if (invoice) {
      checkPaymentGateway();
    }
  }, [invoice]);
  
  // Fetch invoice on component mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getInvoiceById(id);
        console.log('Invoice data:', data);
        console.log('Invoice user data:', data.user);
        setInvoice(data);
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

  // Handle actions
  const handleMarkAsPaid = async () => {
    try {
      setLoading(true);
      await invoiceService.updateInvoice(id, { status: 'paid' });
      // Update the invoice in state
      setInvoice(prev => ({ ...prev, status: 'paid' }));
      toast.success(`Invoice ${invoice.invoice_number} marked as paid`);
    } catch (err) {
      toast.error(err.message || 'Failed to update invoice status');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = () => {
    // This would send an email reminder to the client
    toast.success(`Reminder sent to ${invoice.client.name}`);
  };

  const handleSharePaymentLink = () => {
    setShowShareModal(true);
  };
  
  const handleCopyPaymentLink = () => {
    const paymentLink = `${window.location.origin}/invoice/${invoice.id}`;
    navigator.clipboard.writeText(paymentLink);
    setCopySuccess(true);
    toast.success('Payment link copied to clipboard!');
    
    // Reset copy success message after 3 seconds
    setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
  };
  
  const handleOpenPaymentModal = () => {
    setPaymentError(null);
    setShowPaymentModal(true);
  };
  
  const handlePaymentSuccess = () => {
    // Update the invoice status after successful payment
    setInvoice(prev => ({ ...prev, status: 'paid' }));
    toast.success(`Invoice ${invoice.invoice_number} has been paid`);
    setShowPaymentModal(false);
    setPaymentLoading(false);
  };
  
  const handlePaymentError = (error) => {
    setPaymentError(error);
    toast.error(`Payment error: ${error}`);
    setPaymentLoading(false);
  };
  
  const handlePaymentStart = () => {
    setPaymentLoading(true);
    setPaymentError(null);
  };

  const handleDownload = async () => {
    try {
      setGeneratingPDF(true);
      toast.info(`Preparing invoice ${invoice.invoice_number} for download...`);
      
      // Generate PDF blob
      const blob = await pdf(
        <InvoicePDF 
          invoice={invoice} 
          user={invoice.user} 
          client={invoice.client_details}
          bankDetails={{
            accountName: invoice.user?.company_name || 'Your Company Account',
            accountNumber: invoice.user?.bank_account || 'XXXX-XXXX-XXXX-XXXX',
            bankName: invoice.user?.bank_name || 'Your Bank Name',
            swiftCode: invoice.user?.swift_code || 'SWIFTCODE',
            routingNumber: invoice.user?.routing_number || '123456789'
          }}
        />
      ).toBlob();
      
      // Save the PDF file
      saveAs(blob, `Invoice-${invoice.invoice_number}.pdf`);
      

    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Get user preferences for dark mode
  const darkMode = false
  
  // Get current user from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  // Check if the current user is the owner of the invoice
  const isOwner = user && invoice && user.id === invoice.user.id;
  
  // Determine if Pay Now button should be shown
  const showPayNowButton = invoice && 
                          invoice.status !== 'paid' && 
                          hasPaymentGateway && 
                          (!isAuthenticated || !isOwner);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Invoice</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/invoices')} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  // Determine which layout to use based on authentication and ownership
  if (isAuthenticated && isOwner) {
    // Full dashboard view for authenticated owner
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <button 
                onClick={() => navigate('/invoices')}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back to invoices"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoice #{invoice.invoice_number}</h1>
                <div className="mt-1 flex items-center">
                  <span className="text-gray-600 mr-3">Status:</span>
                  {renderStatusBadge(invoice.status)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {invoice.status !== 'paid' && (
                <button
                  onClick={handleMarkAsPaid}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors flex items-center"
                  aria-label="Mark invoice as paid"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Paid
                </button>
              )}
              {invoice.status !== 'paid' && (
                <button
                  onClick={handleSharePaymentLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors flex items-center"
                  aria-label="Share Invoice link"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Share Invoice Link
                </button>
              )}
              {invoice.status !== 'paid' && (
                <button
                  onClick={handleSendReminder}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors flex items-center"
                  aria-label="Send payment reminder"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminder
                </button>
              )}
              <button
                onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-md transition-colors flex items-center"
                aria-label="Edit invoice"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDownload}
                disabled={generatingPDF}
                className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors flex items-center ${generatingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Download invoice as PDF"
              >
                <Download className={`w-4 h-4 mr-2 ${generatingPDF ? 'animate-pulse' : ''}`} />
                {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors flex items-center"
                aria-label="Print invoice"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="pdf-container">
            <InvoiceTemplate 
              invoice={invoice}
              user={invoice.user}
              client={invoice.client_details}
              darkMode={darkMode}
              showThemeToggle={true}
              actions={null}
            />
          </div>
          
          {/* Payment Modal */}
          {showPaymentModal && invoice && (
            <PaymentModal
              invoice={invoice}
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onPaymentStart={handlePaymentStart}
            />
          )}
          
          {/* Share Payment Link Modal */}
          {showShareModal && (
            <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Share Payment Link</h3>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Share this Invoice link with your client to allow them to pay this invoice online.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center mb-6">
                  <div className="truncate flex-1 text-gray-700">
                    {`${window.location.origin}/invoice/${invoice.id}`}
                  </div>
                  <button
                    onClick={handleCopyPaymentLink}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Copy payment link"
                  >
                    {copySuccess ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleOpenPaymentModal}
                    className="w-full px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium rounded-md transition-colors flex items-center justify-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </button>
                  
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  } else {
    // Public view for non-authenticated users or non-owners
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Public Navbar */}
        <nav className="py-4 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center">
              <div className="flex items-center">
        
                <img src={logo} alt="Trackifye Logo" className="h-8 w-auto mr-2" />
               
              </div>
            </div>
          </div>
        </nav>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Limited header for public view */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-t-lg shadow-sm border border-gray-200 border-b-0">
            <div>
              <div className="flex items-center">
                {!isAuthenticated && (
                  <div className="mr-3 p-2 rounded-full bg-gray-100">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoice_number}</h1>
              </div>
              <div className="mt-1 flex items-center">
                <span className="text-gray-600 mr-3">Status:</span>
                {renderStatusBadge(invoice.status)}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {/* Show Pay Now button only if invoice is not paid and has payment gateway configured */}
              {showPayNowButton && (
                <button
                  onClick={handleOpenPaymentModal}
                  disabled={paymentLoading}
                  className={`px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-md transition-colors flex items-center ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-label="Pay invoice"
                >
                  {paymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </button>
              )}
              <button
                onClick={handleDownload}
                disabled={generatingPDF}
                className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors flex items-center ${generatingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Download invoice as PDF"
              >
                <Download className={`w-4 h-4 mr-2 ${generatingPDF ? 'animate-pulse' : ''}`} />
                {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors flex items-center"
                aria-label="Print invoice"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="pdf-container bg-whiterounded-b-lg shadow-sm border border-gray-200">
            <InvoiceTemplate 
              invoice={invoice}
              user={isOwner ? {...invoice.user, bank_account: user.bank_account} : invoice.user}
              client={invoice.client_details}
              darkMode={darkMode}
              showThemeToggle={false}
              actions={null}
            />
          </div>
          
          {/* Payment Modal */}
          {showPaymentModal && invoice && (
            <PaymentModal
              invoice={invoice}
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onPaymentStart={handlePaymentStart}
            />
          )}
          
          {/* Footer with subtle CTA */}
          {!isAuthenticated && (
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Powered by <a href="/" className="text-[#F97316] hover:text-[#EA580C] font-medium">Trackifye</a></p>
            </div>
          )}
        </div>
      </div>
  )}
};

export default InvoiceDetailPage;
