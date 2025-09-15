import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import bankAccountApi from '../../api/bankAccountApi';
import { deleteBankAccount } from '../../redux/slices/userSlice';

const DeleteBankAccountModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await bankAccountApi.deleteBankAccount();
      dispatch(deleteBankAccount());
      toast.success('Bank account deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete bank account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs border border-gray-200 shadow-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Delete Bank Account</h3>
          <p className="text-gray-500 mt-2">
            Are you sure you want to delete your bank account details? This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Bank Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBankAccountModal;
