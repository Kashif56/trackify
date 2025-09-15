import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import bankAccountApi from '../../api/bankAccountApi';
import { updateBankAccount } from '../../redux/slices/userSlice';

const EditBankAccountModal = ({ isOpen, onClose, bankAccount }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_holder_name: '',
    iban_number: '',
    ifsc_code: '',
    swift_code: ''
  });

  // Update form data when bank account changes
  useEffect(() => {
    if (bankAccount) {
      setFormData({
        bank_name: bankAccount.bank_name || '',
        account_holder_name: bankAccount.account_holder_name || '',
        iban_number: bankAccount.iban_number || '',
        ifsc_code: bankAccount.ifsc_code || '',
        swift_code: bankAccount.swift_code || ''
      });
    }
  }, [bankAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.bank_name || !formData.account_holder_name || !formData.iban_number) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await bankAccountApi.updateBankAccount(formData);
      dispatch(updateBankAccount(response));
      toast.success('Bank account updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating bank account:', error);
      toast.error(error.response?.data?.detail || 'Failed to update bank account');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-xl font-bold text-gray-800 mb-6">Edit Bank Account</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="account_holder_name"
                value={formData.account_holder_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IBAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="iban_number"
                value={formData.iban_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifsc_code"
                value={formData.ifsc_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SWIFT Code
              </label>
              <input
                type="text"
                name="swift_code"
                value={formData.swift_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Bank Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBankAccountModal;
