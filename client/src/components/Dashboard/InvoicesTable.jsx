import React from 'react';
import PropTypes from 'prop-types';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  onDownloadInvoice
}) => {
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
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
        <Link to="/invoices" className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">Invoice #</th>
              <th scope="col" className="px-4 py-3">Client</th>
              <th scope="col" className="px-4 py-3">Due Date</th>
              <th scope="col" className="px-4 py-3">Amount</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-4 py-3">
                    {invoice.client?.name || 'Unknown Client'}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${parseFloat(invoice.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {renderStatusBadge(invoice.status)}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => onViewInvoice && onViewInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => onEditInvoice && onEditInvoice(invoice)}
                      className="text-[#F97316] hover:text-[#EA580C]"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => onDownloadInvoice && onDownloadInvoice(invoice)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Download className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => onDeleteInvoice && onDeleteInvoice(invoice)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No invoices found. Create your first invoice to start tracking your income.
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
