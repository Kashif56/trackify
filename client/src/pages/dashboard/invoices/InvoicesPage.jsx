import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, Search, Filter, Calendar, DollarSign, FileText, AlertCircle, 
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import DateRangeSelector from '../../../components/DateRange/DateRangeSelector';

// Import components and services
import StatCard from '../../../components/Dashboard/StatCard';
import DeleteInvoiceModal from '../../../components/Dashboard/Modals/DeleteInvoiceModal';
import DashboardLayout from '../../../layout/DashboardLayout';
import invoiceService from '../../../api/invoiceService';
import InvoicesTable from '../../../components/Dashboard/InvoicesTable';

/**
 * InvoicesPage Component
 * 
 * A modern, UX-friendly page for managing invoices with filtering, sorting,
 * and CRUD operations.
 */
const InvoicesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for invoices data
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats calculations
  const totalInvoicesAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
  const paidAmount = paidInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0);
  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid');
  const unpaidAmount = unpaidInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0);
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');
  const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0);

  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
    range_type: 'last_30_days'
  });
  
  // Fetch invoices when filters change
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const params = {};
        
        // Add filters to params if they exist
        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        // Add date range parameters if they exist
        if (dateRange.start_date && dateRange.end_date) {
          params.start_date = dateRange.start_date;
          params.end_date = dateRange.end_date;
          params.range_type = dateRange.range_type;
        }
        
        const data = await invoiceService.getInvoices(params);
        setInvoices(data.results || data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch invoices');
        toast.error('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [statusFilter, searchTerm, dateRange]);  // Re-fetch when filters or date range change


  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter(invoice => {
    // Convert search term to lowercase for case-insensitive comparison
    const search = searchTerm.toLowerCase();
    
    // Make sure invoice_number and client_name exist and are strings before using includes
    const matchesInvoiceNumber = invoice.invoice_number && 
      invoice.invoice_number.toLowerCase().includes(search);
    
    const matchesClientName = invoice.client_name && 
      invoice.client_name.toLowerCase().includes(search);
    
    // Add additional search fields if needed
    const matchesSearch = matchesInvoiceNumber || matchesClientName || search === '';
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Handle actions
  const handleViewInvoice = (invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };

  const handleEditInvoice = (invoice) => {
    navigate(`/invoices/edit/${invoice.id}`);
  };

  const handleDeleteInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleDownloadInvoice = (invoice) => {
    // This would be implemented with a PDF generation library
    toast.info(`Downloading invoice ${invoice.invoice_number}...`);
  };
  
  // Handle date range change from DateRangeSelector
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    // The useEffect will automatically trigger a re-fetch
  };

  const confirmDeleteInvoice = async () => {
    if (selectedInvoice) {
      try {
        setLoading(true);
        await invoiceService.deleteInvoice(selectedInvoice.id);
        
        // Remove the deleted invoice from state
        setInvoices(prevInvoices => 
          prevInvoices.filter(invoice => invoice.id !== selectedInvoice.id)
        );
        
        toast.success(`Invoice ${selectedInvoice.invoice_number} deleted successfully`);
        setIsDeleteModalOpen(false);
        setSelectedInvoice(null);
      } catch (err) {
        toast.error(err.message || 'Failed to delete invoice');
      } finally {
        setLoading(false);
      }
    }
  };


  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Invoices</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => dispatch(fetchInvoices())} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Invoices</h1>
        <Link
          to="/invoices/add"
          className="flex items-center px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-md transition-colors duration-200"
          aria-label="Create new invoice"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Invoice
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Invoices" 
          value={`${totalInvoicesAmount.toFixed(2)}`} 
          icon={<FileText className="w-6 h-6 text-[#F97316]" />} 
          subtitle={`${invoices.length} invoices`}
          bgColor="bg-white"
          textColor="text-gray-800"
        />
        <StatCard 
          title="Paid" 
          value={`${paidAmount.toFixed(2)}`} 
          icon={<DollarSign className="w-6 h-6 text-green-500" />} 
          subtitle={`${paidInvoices.length} invoices`}
          bgColor="bg-green-50"
          textColor="text-green-800"
        />
        <StatCard 
          title="Unpaid" 
          value={`${unpaidAmount.toFixed(2)}`} 
          icon={<Calendar className="w-6 h-6 text-yellow-500" />} 
          subtitle={`${unpaidInvoices.length} invoices`}
          bgColor="bg-yellow-50"
          textColor="text-yellow-800"
        />
        <StatCard 
          title="Overdue" 
          value={`${overdueAmount.toFixed(2)}`} 
          icon={<AlertCircle className="w-6 h-6 text-red-500" />} 
          subtitle={`${overdueInvoices.length} invoices`}
          bgColor="bg-red-50"
          textColor="text-red-800"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
              placeholder="Search invoices by number or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search invoices"
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex-shrink-0">
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'unpaid'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
              }`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'overdue'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50'
              }`}
            >
              Overdue
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table with Pagination */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <InvoicesTable
          invoices={currentInvoices}
          loading={loading}
          onViewInvoice={handleViewInvoice}
          onEditInvoice={handleEditInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onDownloadInvoice={handleDownloadInvoice}
          isFullPage={true}
        />
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedInvoice && (
        <DeleteInvoiceModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedInvoice(null);
          }} 
          invoice={selectedInvoice}
          onConfirm={confirmDeleteInvoice}
        />
      )}
    </div>
    </DashboardLayout>
  );
};

export default InvoicesPage;
