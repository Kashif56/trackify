import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import paymentService from '../api/paymentService';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatUtils';
import { Pagination } from '../components/ui/Pagination';
import ReceiptModal from '../components/Payment/ReceiptModal';
import { Search, Filter, ArrowUpDown, Loader2, RefreshCw, Eye, Download, RefreshCcw, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';

const PaymentHistoryContent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);


  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencySymbol = userCurrency === 'pkr' ? 'Rs ' : '$';

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments(page);
      setPayments(response.results || []);
      setTotalPages(Math.ceil(response.count / 50)); // Assuming 10 items per page
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment history. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments(currentPage);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedPayments = React.useMemo(() => {
    if (!payments.length) return [];
    
    const sortablePayments = [...payments];
    
    sortablePayments.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? parseFloat(a.amount) - parseFloat(b.amount)
          : parseFloat(b.amount) - parseFloat(a.amount);
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortablePayments;
  }, [payments, sortConfig]);

  const filteredPayments = React.useMemo(() => {
    return sortedPayments.filter(payment => {
      const matchesSearch = searchTerm === '' || 
        payment.invoice?.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoice?.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.gateway_payment_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === '' || payment.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [sortedPayments, searchTerm, filterStatus]);

  const renderStatusBadge = (status) => {
    let bgColor = '';
    let textColor = '';
    
    switch(status.toLowerCase()) {
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'failed':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'processing':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'refunded':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
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
  
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="ml-1 h-4 w-4 rotate-180" /> 
      : <ArrowUpDown className="ml-1 h-4 w-4" />;
  };
  
 

  
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setIsReceiptModalOpen(true);
  };
  
  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-between">
        <span>{error}</span>
        <button 
          onClick={handleRefresh}
          className="bg-white border border-red-300 text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <button 
          onClick={handleRefresh}
          className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </button>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-white">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by invoice number or client..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="w-full bg-white rounded-lg shadow-sm">
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
        ) : filteredPayments.length === 0 ? (
          <div className="p-10 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-gray-500 font-medium">No payment records found</p>
              <p className="text-gray-400 text-sm mt-1">Payments will appear here once invoices are paid</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th scope="col" className="px-6 py-4 font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center">
                      Date {renderSortIcon('created_at')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-700">Invoice #</th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-700">Client</th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status {renderSortIcon('status')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className="flex items-center">
                      Amount {renderSortIcon('amount')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-700">Payment Method</th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {payment.invoice_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {payment.client_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {formatCurrency(payment.amount, userCurrency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {payment.payment_method || 'Card'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => window.open(`/invoices/${payment.invoice}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
                          title="View Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      
                    
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      
      {/* Receipt Modal */}
      <ReceiptModal 
        payment={selectedPayment}
        isOpen={isReceiptModalOpen}
        onClose={closeReceiptModal}
      />
    </div>
  );
};

const PaymentHistory = () => {
  return (
    <DashboardLayout>
      <PaymentHistoryContent />
    </DashboardLayout>
  );
};

export default PaymentHistory;
