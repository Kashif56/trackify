import React from 'react';
import { Edit, Trash2, CreditCard } from 'lucide-react';

const BankAccountDisplay = ({ bankAccount, onEdit, onDelete }) => {
  if (!bankAccount) {
    return (
      <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h5 className="text-lg font-medium text-gray-700 mb-1">No Bank Account Connected</h5>
        <p className="text-gray-500 mb-4">Add your bank account details to receive payments directly</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-medium text-gray-800">Bank Account Details</h4>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit bank account"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete bank account"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Bank Name</p>
          <p className="font-medium">{bankAccount.bank_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Account Holder</p>
          <p className="font-medium">{bankAccount.account_holder_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">IBAN Number</p>
          <p className="font-medium">{bankAccount.iban_number}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">IFSC Code</p>
          <p className="font-medium">{bankAccount.ifsc_code}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">SWIFT Code</p>
          <p className="font-medium">{bankAccount.swift_code}</p>
        </div>
      </div>
    </div>
  );
};

export default BankAccountDisplay;
