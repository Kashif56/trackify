import React from 'react';
import { X } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import { useSelector } from 'react-redux';

const ReceiptModal = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Payment Receipt</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          {/* Company Logo & Info */}
          <div className="flex justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg text-primary">Trackify</h3>
              <p className="text-gray-600 text-sm">Your Financial Partner</p>
            </div>
            <div className="mb-6 flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(payment.status)}`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
          </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">Receipt #{payment.id.substring(0, 8)}</p>
              <p className="text-gray-600 text-sm">Date: {formatDate(payment.created_at)}</p>
            </div>
          </div>

          {/* Payment Status */}
          

          {/* Payment Details */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-3 font-medium text-gray-700">Invoice Number</td>
                  <td className="px-6 py-3">{payment.invoice_number || 'N/A'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-3 font-medium text-gray-700">Client</td>
                  <td className="px-6 py-3">{payment.client_name || 'N/A'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-3 font-medium text-gray-700">Amount</td>
                  <td className="px-6 py-3 font-medium">{formatCurrency(payment.amount, userCurrency)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-3 font-medium text-gray-700">Payment Method</td>
                  <td className="px-6 py-3">{payment.payment_method || 'Card'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-3 font-medium text-gray-700">Payment Date</td>
                  <td className="px-6 py-3">{payment.payment_date ? formatDate(payment.payment_date) : 'N/A'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-3 font-medium text-gray-700">Gateway</td>
                  <td className="px-6 py-3">{payment.gateway_name.charAt(0).toUpperCase() + payment.gateway_name.slice(1)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-3 font-medium text-gray-700">Transaction ID</td>
                  <td className="px-6 py-3 font-mono text-xs">{payment.gateway_payment_id || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional Info */}
          {payment.error_message && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">Error Message:</p>
              <p className="text-red-600 text-sm">{payment.error_message}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>Thank you for your business!</p>
            <p className="mt-1">This is an electronically generated receipt.</p>
          </div>

    
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
