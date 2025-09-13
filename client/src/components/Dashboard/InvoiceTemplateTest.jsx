import React, { useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import { Moon, Sun } from 'lucide-react';

/**
 * InvoiceTemplateTest Component
 * 
 * A test component to showcase the InvoiceTemplate in both light and dark modes
 * with sample data.
 */
const InvoiceTemplateTest = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Sample invoice data
  const sampleInvoice = {
    invoice_number: 'INV-2025-001',
    issue_date: '2025-09-10',
    due_date: '2025-09-24',
    subtotal: 1250.00,
    tax_rate: 10,
    tax_amount: 125.00,
    total: 1375.00,
    status: 'unpaid',
    notes: 'Thank you for your business. Please make payment by the due date.',
    payment_terms: 'Payment due within 14 days of issue',
    conditions: 'Late payments are subject to a 2% monthly finance charge.',
    items: [
      {
        id: '1',
        description: 'Website Design',
        quantity: 1,
        unit_price: 800.00
      },
      {
        id: '2',
        description: 'Logo Design',
        quantity: 1,
        unit_price: 300.00
      },
      {
        id: '3',
        description: 'Hosting (Monthly)',
        quantity: 3,
        unit_price: 50.00
      }
    ]
  };

  // Sample user data
  const sampleUser = {
    company_name: 'Design Studio Inc.',
    email: 'contact@designstudio.com',
    address: '123 Creative St., Design District, CA 94103',
    profile_picture: null
  };

  // Sample client data
  const sampleClient = {
    name: 'John Smith',
    email: 'john@example.com',
    address: '456 Business Ave., Suite 789\nSan Francisco, CA 94104',
    company_name: 'Smith Enterprises',
    phone_number: '(555) 123-4567'
  };

  // Sample bank details
  const sampleBankDetails = {
    accountName: 'Design Studio Inc.',
    accountNumber: '1234-5678-9012-3456',
    bankName: 'Creative Bank',
    swiftCode: 'CRTBNK123',
    routingNumber: '987654321'
  };

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Invoice Template Test
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <InvoiceTemplate
          invoice={sampleInvoice}
          user={sampleUser}
          client={sampleClient}
          darkMode={darkMode}
          bankDetails={sampleBankDetails}
          actions={
            <div className="flex space-x-2">
              <button className={`px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}>
                Download
              </button>
              <button className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 border border-gray-300'} ${darkMode ? 'text-gray-200' : 'text-gray-700'} rounded-md`}>
                Print
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default InvoiceTemplateTest;
