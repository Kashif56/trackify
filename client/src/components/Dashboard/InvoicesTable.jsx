import React from 'react';
import PropTypes from 'prop-types';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * InvoicesTable Component
 * 
 * A table component for displaying recent invoices on the dashboard.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.invoices - Array of invoice objects to display
 * @param {boolean} props.loading - Whether the data is loading
 * @param {Function} props.onViewInvoice - Function to call when view button is clicked
 * @param {Function} props.onEditInvoice - Function to call when edit button is clicked
 * @param {Function} props.onDeleteInvoice - Function to call when delete button is clicked
 * @param {Function} props.onDownloadInvoice - Function to call when download button is clicked
 */
const InvoicesTable = ({ 
  invoices = [], 
  loading = false,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadInvoice,
  isFullPage = false
}) => {
  // Get user's currency preference from Redux store
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  // Function to render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let bgColor = '';
    let textColor = '';
    
    switch(status.toLowerCase()) {
      case 'paid':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'unpaid':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'overdue':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
        </div>
        <div className="p-4 flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-lg font-semibold text-gray-800">
          {isFullPage ? 'Invoices' : 'Recent Invoices'}
        </h2>
        {isFullPage==false && (
          <Link to="/invoices" className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors duration-200 flex items-center gap-1">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th scope="col" className="px-6 py-4 font-medium text-gray-700">Invoice #</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-700">Client</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-700">Due Date</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-700">Amount</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-700">Status</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {invoice.client_name || 'Unknown Client'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {userCurrency === 'pkr' ? 'Rs ' : '$'}{parseFloat(invoice.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onViewInvoice && onViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditInvoice && onEditInvoice(invoice)}
                        className="text-[#F97316] hover:text-[#EA580C] p-1 rounded-full hover:bg-orange-50 transition-colors duration-200"
                        title="Edit Invoice"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownloadInvoice && onDownloadInvoice(invoice)}
                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50 transition-colors duration-200"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteInvoice && onDeleteInvoice(invoice)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td colSpan="6" className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No invoices found</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first invoice to start tracking your income</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

InvoicesTable.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      invoice_number: PropTypes.string.isRequired,
      total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      due_date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      client: PropTypes.shape({
        name: PropTypes.string
      })
    })
  ),
  loading: PropTypes.bool,
  onViewInvoice: PropTypes.func,
  onEditInvoice: PropTypes.func,
  onDeleteInvoice: PropTypes.func,
  onDownloadInvoice: PropTypes.func
};

export default InvoicesTable;
