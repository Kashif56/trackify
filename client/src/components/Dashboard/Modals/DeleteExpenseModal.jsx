import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, X } from 'lucide-react';

/**
 * DeleteExpenseModal Component
 * 
 * A confirmation modal for deleting expenses.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Function} props.onConfirm - Function to call when deletion is confirmed
 * @param {Object} props.expense - The expense to delete
 */
const DeleteExpenseModal = ({ isOpen, onClose, onConfirm, expense }) => {
  if (!isOpen || !expense) return null;
  
  const handleConfirm = () => {
    onConfirm();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        {/* Background overlay - already included in parent div */}
        
        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Delete Expense
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this expense? This action cannot be undone.
                  </p>
                </div>
                <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <span className="text-sm text-gray-900">{expense.description}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-medium text-gray-500">Amount:</span>
                    <span className="text-sm text-gray-900">${parseFloat(expense.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-medium text-gray-500">Date:</span>
                    <span className="text-sm text-gray-900">{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <span className="text-sm text-gray-900">{expense.category?.name || 'Uncategorized'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              onClick={handleConfirm}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  expense: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string
    })
  })
};

export default DeleteExpenseModal;
