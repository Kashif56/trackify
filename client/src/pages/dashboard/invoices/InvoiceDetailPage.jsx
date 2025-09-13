import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Download, Printer, Send, 
  CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../layout/DashboardLayout';
import invoiceService from '../../../api/invoiceService';
import InvoiceTemplate from '../../../components/Dashboard/InvoiceTemplate';
import InvoicePDF from '../../../components/Dashboard/InvoicePDF';
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

  // Fetch invoice on component mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getInvoiceById(id);
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
                onClick={handleSendReminder}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors flex items-center"
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
      </div>
    </DashboardLayout>
  );
};

export default InvoiceDetailPage;
