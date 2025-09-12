import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Upload } from 'lucide-react';

/**
 * EditExpenseModal Component
 * 
 * A modal for editing existing expenses with form validation.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Function} props.onSave - Function to call when form is submitted
 * @param {Object} props.expense - The expense to edit
 * @param {Array} props.categories - Array of expense categories
 */
const EditExpenseModal = ({ isOpen, onClose, onSave, expense, categories = [] }) => {
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    category: '',
    amount: '',
    date: '',
    notes: '',
    receipt: null
  });
  
  const [errors, setErrors] = useState({});
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  
  // Initialize form data when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        id: expense.id,
        description: expense.description || '',
        category: expense.category?.id || '',
        amount: expense.amount || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        notes: expense.notes || '',
        receipt: expense.receipt || null
      });
      
      // Set receipt preview if available
      if (expense.receipt && expense.receipt.startsWith('http')) {
        setReceiptPreview(expense.receipt);
      } else {
        setReceiptPreview('');
      }
    }
  }, [expense]);
  
  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        document.getElementById('edit-expense-description')?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, receipt: 'Please upload a valid image or PDF file' });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, receipt: 'File size must be less than 5MB' });
      return;
    }
    
    setReceiptFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just show the filename
      setReceiptPreview('');
    }
    
    // Store the actual file object in formData, not just the name
    setFormData({ ...formData, receipt: file });
    setErrors({ ...errors, receipt: '' });
  };
  
  // Remove receipt file
  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview('');
    setFormData({ ...formData, receipt: null });
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Format data for submission
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount).toFixed(2),
      // Just pass the category ID, not the whole object
      category: formData.category,
      // Include the actual file object for receipt if available
      receipt: receiptFile
    };
    
    onSave(expenseData);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        {/* Background overlay - already included in parent div */}
        
        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Edit Expense
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
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Description */}
                  <div>
                    <label htmlFor="edit-expense-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="edit-expense-description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F97316] focus:border-[#F97316]`}
                      placeholder="e.g., Office Supplies"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="edit-expense-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      id="edit-expense-category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F97316] focus:border-[#F97316]`}
                    >
                      <option value="">Select a category</option>
                      {Array.isArray(categories) && categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                  
                  {/* Amount and Date (side by side on larger screens) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($) *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        id="edit-expense-amount"
                        value={formData.amount}
                        onChange={handleChange}
                        step="0.01"
                        min="0.01"
                        className={`mt-1 block w-full border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F97316] focus:border-[#F97316]`}
                        placeholder="0.00"
                      />
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="edit-expense-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="edit-expense-date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F97316] focus:border-[#F97316]`}
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label htmlFor="edit-expense-notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      id="edit-expense-notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F97316] focus:border-[#F97316]"
                      placeholder="Additional details about this expense..."
                    ></textarea>
                  </div>
                  
                  {/* Receipt Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Receipt
                    </label>
                    
                    {!formData.receipt ? (
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#F97316] hover:bg-orange-50 transition-colors duration-200 cursor-pointer">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#F97316] transition-colors duration-200" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="edit-receipt-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#F97316] hover:text-[#EA580C] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#F97316] transition-colors duration-200">
                              <span>Upload a file</span>
                              <input
                                id="edit-receipt-upload"
                                name="receipt"
                                type="file"
                                className="sr-only"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF or PDF up to 5MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center">
                        {receiptPreview ? (
                          <div className="relative group">
                            <img
                              src={receiptPreview}
                              alt="Receipt preview"
                              className="h-32 w-auto object-cover rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-200"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveReceipt}
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-gray-500 hover:text-red-500 focus:outline-none shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-500">PDF</span>
                            </div>
                            <div className="ml-3 flex-1 flex justify-between items-center">
                              <span className="text-sm text-gray-500 truncate">
                                {formData.receipt instanceof File ? formData.receipt.name : formData.receipt}
                              </span>
                              <button
                                type="button"
                                onClick={handleRemoveReceipt}
                                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {errors.receipt && (
                      <p className="mt-1 text-sm text-red-600">{errors.receipt}</p>
                    )}
                  </div>
                  
                  {/* Form Actions */}
                  <div className="mt-8 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-3 border-t border-gray-100 pt-5">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:text-sm transition-colors duration-200"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#F97316] text-base font-medium text-white hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] sm:text-sm transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EditExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  expense: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    notes: PropTypes.string,
    receipt: PropTypes.string,
    category: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  )
};

export default EditExpenseModal;
