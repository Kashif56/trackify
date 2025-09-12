import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2, FileText, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ExpensesTable Component
 * 
 * A table component for displaying expenses with pagination, sorting, and actions.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.expenses - Array of expense objects to display
 * @param {boolean} props.loading - Whether the data is loading
 * @param {Function} props.onEditExpense - Function to call when edit button is clicked
 * @param {Function} props.onDeleteExpense - Function to call when delete button is clicked
 * @param {Function} props.onViewReceipt - Function to call when view receipt button is clicked
 * @param {boolean} props.isFullPage - Whether this is the full page view (vs. dashboard widget)
 */
const ExpensesTable = ({ 
  expenses = [], 
  loading = false,
  onEditExpense,
  onDeleteExpense,
  onViewReceipt,
  isFullPage = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  
  const itemsPerPage = isFullPage ? 10 : 5;
  
  // Sort expenses
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? parseFloat(a.amount) - parseFloat(b.amount)
        : parseFloat(b.amount) - parseFloat(a.amount);
    } else if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else {
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
  });
  
  // Paginate expenses
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = sortedExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };
  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{isFullPage ? 'Expenses' : 'Recent Expenses'}</h2>
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
      {!isFullPage && (
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Expenses</h2>
          <Link to="/expenses" className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium">
            View All
          </Link>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('description')}
              >
                Description {isFullPage && renderSortIndicator('description')}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('category')}
              >
                Category {isFullPage && renderSortIndicator('category')}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('date')}
              >
                Date {isFullPage && renderSortIndicator('date')}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('amount')}
              >
                Amount {isFullPage && renderSortIndicator('amount')}
              </th>
              {isFullPage && (
                <th scope="col" className="px-4 py-3">Notes</th>
              )}
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.length > 0 ? (
              currentExpenses.map((expense, index) => (
                <tr key={expense.id} className={index % 2 === 0 ? "bg-white border-b hover:bg-gray-50" : "bg-gray-50 border-b hover:bg-gray-100"}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-4 py-3">
                    {expense.category_name || 'Uncategorized'}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  {isFullPage && (
                    <td className="px-4 py-3 max-w-xs truncate">
                      {expense.notes || '-'}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {expense.receipt && (
                      <button
                        onClick={() => onViewReceipt && onViewReceipt(expense)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Receipt"
                      >
                        <FileText className="w-4 h-4 inline" />
                      </button>
                    )}
                    <button
                      onClick={() => onEditExpense && onEditExpense(expense)}
                      className="text-[#F97316] hover:text-[#EA580C]"
                      title="Edit Expense"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense && onDeleteExpense(expense)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td colSpan={isFullPage ? "6" : "5"} className="px-4 py-6 text-center text-gray-500">
                  No expenses found. Add your first expense to track your spending.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {isFullPage && totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, expenses.length)}
                </span>{' '}
                of <span className="font-medium">{expenses.length}</span> expenses
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'text-[#F97316] bg-orange-50 border-[#F97316]' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ExpensesTable.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      date: PropTypes.string.isRequired,
      notes: PropTypes.string,
      receipt: PropTypes.string,
      category: PropTypes.shape({
        name: PropTypes.string
      })
    })
  ),
  loading: PropTypes.bool,
  onEditExpense: PropTypes.func,
  onDeleteExpense: PropTypes.func,
  onViewReceipt: PropTypes.func,
  isFullPage: PropTypes.bool
};

export default ExpensesTable;
