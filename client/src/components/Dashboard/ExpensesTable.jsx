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
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
      {!isFullPage && (
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
          <Link to="/expenses" className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors duration-200 flex items-center gap-1">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th 
                scope="col" 
                className="px-6 py-4 font-medium text-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('description')}
              >
                <div className="flex items-center">
                  <span>Description</span>
                  {isFullPage && renderSortIndicator('description')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 font-medium text-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('category')}
              >
                <div className="flex items-center">
                  <span>Category</span>
                  {isFullPage && renderSortIndicator('category')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 font-medium text-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('date')}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {isFullPage && renderSortIndicator('date')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 font-medium text-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                onClick={() => isFullPage && handleSort('amount')}
              >
                <div className="flex items-center">
                  <span>Amount</span>
                  {isFullPage && renderSortIndicator('amount')}
                </div>
              </th>
              {isFullPage && (
                <th scope="col" className="px-6 py-4 font-medium text-gray-700">Notes</th>
              )}
              <th scope="col" className="px-6 py-4 font-medium text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentExpenses.length > 0 ? (
              currentExpenses.map((expense) => (
                <tr key={expense.id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {expense.category_name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  {isFullPage && (
                    <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                      {expense.notes || '-'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-3">
                      {expense.receipt && (
                        <a
                          href={expense.receipt.includes('http://localhost:8000') 
                            ? expense.receipt 
                            : `http://localhost:8000${expense.receipt.startsWith('/') ? '' : '/'}${expense.receipt}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200 inline-flex items-center justify-center"
                          title="View Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => onEditExpense && onEditExpense(expense)}
                        className="text-[#F97316] hover:text-[#EA580C] p-1 rounded-full hover:bg-orange-50 transition-colors duration-200"
                        title="Edit Expense"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense && onDeleteExpense(expense)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td colSpan={isFullPage ? "6" : "5"} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 10c0 5-4.5 9-9 9s-9-4-9-9 4-9 9-9c2.38 0 4.5.85 6.14 2.25M21 15v4h-4" />
                    </svg>
                    <p className="text-gray-500 font-medium">No expenses found</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first expense to track your spending</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {isFullPage && totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-800">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium text-gray-800">
                  {Math.min(indexOfLastItem, expenses.length)}
                </span>{' '}
                of <span className="font-medium text-gray-800">{expenses.length}</span> expenses
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${currentPage === 1 ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors duration-200'}`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${currentPage === page 
                      ? 'z-10 bg-orange-50 border-[#F97316] text-[#F97316] font-medium' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-200'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${currentPage === totalPages ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors duration-200'}`}
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
