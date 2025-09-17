import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, AlertCircle, Clock, FileText, Moon, Sun } from 'lucide-react';

/**
 * InvoiceTemplate Component
 * 
 * A reusable template for displaying invoice details consistently across the application.
 * Supports both light and dark modes with a theme toggle button, and includes a section for bank account details.
 * 
 * @param {Object} props
 * @param {Object} props.invoice - The invoice data
 * @param {Object} props.user - The user/company data
 * @param {Object} props.client - The client data
 * @param {boolean} props.darkMode - Initial dark mode state (optional)
 * @param {Object} props.bankDetails - Optional bank account details
 * @param {React.ReactNode} props.actions - Optional actions to display (buttons, etc.)
 * @param {boolean} props.showThemeToggle - Whether to show the theme toggle button (default: true)
 */
const InvoiceTemplate = ({ 
  invoice, 
  user, 
  client, 
  darkMode: initialDarkMode = false,
  bankDetails = null,
  actions = null,
  showThemeToggle = true
}) => {
  // Local state for dark mode toggle
  const [localDarkMode, setLocalDarkMode] = useState(initialDarkMode);
  
  // Get user's currency preference from Redux store
  const reduxUser = useSelector(state => state.user.user);
  const userCurrency = reduxUser?.profile?.currency || 'pkr';
  const currencySymbol = userCurrency === 'pkr' ? 'Rs ' : '$';
  
  // Update local dark mode when prop changes
  useEffect(() => {
    setLocalDarkMode(initialDarkMode);
  }, [initialDarkMode]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setLocalDarkMode(prev => !prev);
  };
  // Default bank details if none provided
  const defaultBankDetails = {
    account_holder_name: '',
    iban_number: '',
    bank_name: '',
    swift_code: '',
    ifsc_code: ''
  };



  const reduxUserBankAccount = {
    account_holder_name: reduxUser.bank_account.account_holder_name || '',
    iban_number: reduxUser.bank_account.iban_number || '',
    bank_name: reduxUser.bank_account.bank_name || '',
    swift_code: reduxUser.bank_account.swift_code || '',
    ifsc_code: reduxUser.bank_account.ifsc_code || ''
  }

  // Use bank account from user profile if available, otherwise use provided bank details or defaults
  const displayBankDetails = user?.bank_account ? {
    account_holder_name: user.bank_account.account_holder_name || '',
    iban_number: user.bank_account.iban_number || '',
    bank_name: user.bank_account.bank_name || '',
    swift_code: user.bank_account.swift_code || '',
    ifsc_code: user.bank_account.ifsc_code || ''
  } : reduxUserBankAccount;

  // Theme variables based on dark/light mode
  const theme = {
    bg: localDarkMode ? 'bg-gray-900' : 'bg-white',
    text: localDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: localDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: localDarkMode ? 'border-gray-700' : 'border-gray-100',
    tableBg: localDarkMode ? 'bg-gray-800' : 'bg-white',
    tableAltBg: localDarkMode ? 'bg-gray-800/50' : 'bg-gray-50',
    tableHeaderBg: localDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    accentColor: 'text-[#F97316]',
    sectionBg: localDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    cardBg: localDarkMode ? 'bg-gray-800' : 'bg-white',
  };

  // Status badge with appropriate color
  const renderStatusBadge = (status) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    
    if (localDarkMode) {
      // Dark mode status colors
      switch(status?.toLowerCase()) {
        case 'paid':
          bgColor = 'bg-green-900/30';
          textColor = 'text-green-400';
          icon = <CheckCircle className="w-4 h-4 mr-1" />;
          break;
        case 'unpaid':
          bgColor = 'bg-yellow-900/30';
          textColor = 'text-yellow-400';
          icon = <Clock className="w-4 h-4 mr-1" />;
          break;
        case 'overdue':
          bgColor = 'bg-red-900/30';
          textColor = 'text-red-400';
          icon = <AlertCircle className="w-4 h-4 mr-1" />;
          break;
        default:
          bgColor = 'bg-gray-800';
          textColor = 'text-gray-400';
          icon = <FileText className="w-4 h-4 mr-1" />;
      }
    } else {
      // Light mode status colors
      switch(status?.toLowerCase()) {
        case 'paid':
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
          icon = <CheckCircle className="w-4 h-4 mr-1" />;
          break;
        case 'unpaid':
          bgColor = 'bg-yellow-100';
          textColor = 'text-yellow-800';
          icon = <Clock className="w-4 h-4 mr-1" />;
          break;
        case 'overdue':
          bgColor = 'bg-red-100';
          textColor = 'text-red-800';
          icon = <AlertCircle className="w-4 h-4 mr-1" />;
          break;
        default:
          bgColor = 'bg-gray-100';
          textColor = 'text-gray-800';
          icon = <FileText className="w-4 h-4 mr-1" />;
      }
    }
    
    return (
      <span className={`${bgColor} ${textColor} text-sm font-medium px-3 py-1 rounded-full flex items-center inline-flex`}>
        {icon}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft'}
      </span>
    );
  };

  return (
    <div className={`rounded-lg border ${theme.border} overflow-hidden ${theme.bg} print:shadow-none print:border-0`}>
      <div className="mx-auto p-8" id="printable-invoice">
        {/* Actions Bar with Theme Toggle - Only visible when actions are provided and not printing */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          {/* Theme Toggle Button */}
          {showThemeToggle && (
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${localDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              aria-label={localDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={localDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {localDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          
          {/* Actions */}
          <div className="flex">
            {actions}
          </div>
        </div>
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className={`text-3xl font-bold ${theme.text}`}>INVOICE</h1>
            <p className={`${theme.textSecondary} mt-1`}>#{invoice?.invoice_number || 'Draft'}</p>
            {invoice?.status && (
              <div className="mt-3">
                {renderStatusBadge(invoice.status)}
              </div>
            )}
          </div>
          <div className="text-right">
            {user?.profile_picture ? (
              <div className="h-24 w-auto mb-2 rounded-md overflow-hidden flex items-center justify-end">
                <img 
                  src={user.profile_picture} 
                  alt="Company Logo" 
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className={`h-16 w-auto mb-2 ${localDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-md flex items-center justify-center ${localDarkMode ? 'text-gray-400' : 'text-gray-500'} px-6`}>
                Company Logo
              </div>
            )}
            <p className={`font-medium ${theme.text}`}>{user?.company_name || invoice?.user?.profile?.company_name}</p>
            <p className={`${theme.textSecondary} text-sm`}>{user?.email || invoice?.user?.email}</p>
            <p className={`${theme.textSecondary} text-sm`}>{user?.profile?.address || invoice?.user?.profile?.address}</p>
          </div>
        </div>
        
        {/* Client & Invoice Info */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase mb-3`}>Bill To:</h2>
            <p className={`font-medium ${theme.text}`}>{client?.name || ''}</p>
            <p className={theme.textSecondary}>{client?.email || ''}</p>
            <p className={`${theme.textSecondary} whitespace-pre-line`}>{client?.address || ''}</p>
            {client?.company_name && <p className={`${theme.textSecondary} font-medium mt-1`}>{client.company_name}</p>}
            {client?.phone_number && <p className={theme.textSecondary}>{client.phone_number}</p>}
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase mb-3`}>Invoice Date:</h2>
                <p className={theme.text}>
                  {invoice?.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div>
                <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase mb-3`}>Due Date:</h2>
                <p className={theme.text}>
                  {invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div className="col-span-2 mt-4">
                <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-400' : 'text-gray-500'}  uppercase mb-3`}>
                  Amount</h2>
                <p className="text-2xl font-bold">
                  {currencySymbol}{invoice?.total ? parseFloat(invoice.total).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="mb-10">
          <table className={`w-full text-sm text-left ${theme.textSecondary} border-collapse`}>
            <thead>
              <tr>
                <th scope="col" className={`px-6 py-4 font-semibold ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} ${theme.tableHeaderBg} border-t border-b ${theme.border}`}>Description</th>
                <th scope="col" className={`px-6 py-4 font-semibold ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} ${theme.tableHeaderBg} border-t border-b ${theme.border} text-right`}>Qty</th>
                <th scope="col" className={`px-6 py-4 font-semibold ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} ${theme.tableHeaderBg} border-t border-b ${theme.border} text-right`}>Price</th>
                <th scope="col" className={`px-6 py-4 font-semibold ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} ${theme.tableHeaderBg} border-t border-b ${theme.border} text-right`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.items?.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? theme.tableBg : theme.tableAltBg}>
                  <td className={`px-6 py-4 border-b ${theme.border}`}>{item.description}</td>
                  <td className={`px-6 py-4 border-b ${theme.border} text-right`}>{item.quantity}</td>
                  <td className={`px-6 py-4 border-b ${theme.border} text-right`}>{currencySymbol}{parseFloat(item.unit_price || 0).toFixed(2)}</td>
                  <td className={`px-6 py-4 border-b ${theme.border} text-right font-medium`}>{currencySymbol}{parseFloat(item.quantity * (item.unit_price || 0)).toFixed(2)}</td>
                </tr>
              ))}
              {(!invoice?.items || invoice.items.length === 0) && (
                <tr className={theme.tableBg}>
                  <td colSpan="4" className={`px-6 py-4 border-b ${theme.border} text-center italic`}>No items</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-80">
            <div className={`flex justify-between py-3 border-b ${theme.border}`}>
              <span className={theme.textSecondary}>Subtotal:</span>
              <span className={`font-medium ${theme.text}`}>{currencySymbol}{invoice?.subtotal ? parseFloat(invoice.subtotal).toFixed(2) : '0.00'}</span>
            </div>
            {invoice?.tax_rate > 0 && (
              <div className={`flex justify-between py-3 border-b ${theme.border}`}>
                <span className={theme.textSecondary}>Tax ({invoice.tax_rate}%):</span>
                <span className={`font-medium ${theme.text}`}>{currencySymbol}{invoice?.tax_amount ? parseFloat(invoice.tax_amount).toFixed(2) : '0.00'}</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-semibold">
              <span className={theme.text}>Total:</span>
              <span className={theme.text}>{currencySymbol}{invoice?.total ? parseFloat(invoice.total).toFixed(2) : '0.00'}</span>
            </div>
           
          </div>
        </div>
        
        {/* Additional Information - 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Left Column - Bank Details and Notes */}
          <div>
            {/* Bank Account Details */}
            <div className={`mb-6 p-4 border ${theme.border} rounded-md ${theme.sectionBg}`}>
              <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Bank Account Details:</h2>
              <div className="space-y-2">
                <p className={`text-sm ${theme.textSecondary}`}>
                  <span className="font-medium">Account Name:</span> {displayBankDetails?.account_holder_name}
                </p>
                <p className={`text-sm ${theme.textSecondary}`}>
                  <span className="font-medium">Account Number:</span> {displayBankDetails?.iban_number}
                </p>
                <p className={`text-sm ${theme.textSecondary}`}>
                  <span className="font-medium">Bank Name:</span> {displayBankDetails?.bank_name}
                </p>
                <p className={`text-sm ${theme.textSecondary}`}>
                  <span className="font-medium">SWIFT:</span> {displayBankDetails?.swift_code}
                </p>
                <p className={`text-sm ${theme.textSecondary}`}>
                  <span className="font-medium">IFSC Code:</span> {displayBankDetails?.ifsc_code}
                </p>
              </div>
            </div>
            
            {/* Notes */}
            {invoice?.notes && (
              <div className={`p-4 border ${theme.border} rounded-md ${theme.sectionBg}`}>
                <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Notes:</h2>
                <p className={theme.textSecondary}>{invoice.notes}</p>
              </div>
            )}
          </div>
          
          {/* Right Column - Payment Terms and Conditions */}
          <div>
            {/* Payment Terms */}
            {invoice?.payment_terms && (
              <div className={`mb-6 p-4 border ${theme.border} rounded-md ${theme.sectionBg}`}>
                <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Payment Terms:</h2>
                <p className={theme.textSecondary}>{invoice.payment_terms}</p>
              </div>
            )}
            
            {/* Terms & Conditions */}
            {invoice?.conditions && (
              <div className={`p-4 border ${theme.border} rounded-md ${theme.sectionBg}`}>
                <h2 className={`text-sm font-medium ${localDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Terms & Conditions:</h2>
                <p className={theme.textSecondary}>{invoice.conditions}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`mt-10 pt-6 border-t ${theme.border} text-center`}>
          <p className={`${localDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
