import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Minus, ArrowLeft, Save, Eye, Printer, 
  Calendar, DollarSign, User, Building, Hash, FileText 
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../layout/DashboardLayout';
import invoiceService from '../../../api/invoiceService';
import clientService from '../../../api/clientService';
import AddClientModal from '../../../components/Dashboard/Modals/AddClientModal';
import InvoiceTemplate from '../../../components/Dashboard/InvoiceTemplate';

/**
 * AddInvoicePage Component
 * 
 * A dedicated page for creating new invoices with a side-by-side layout:
 * - Left side: Form inputs for invoice details
 * - Right side: Live preview of the invoice being created
 */
const AddInvoicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for clients data
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State for client selection type
  const [clientType, setClientType] = useState('regular'); // 'regular' or 'new'
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    notes: '',
    payment_terms: 'Payment due within 14 days of issue',
    conditions: '',
    tax_rate: 0,
    items: [
      { id: Date.now(), description: '', quantity: 1, price: 0, total: 0 }
    ]
  });

  // Derived values
  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = subtotal * (formData.tax_rate / 100);
  const total = subtotal + taxAmount;

  // Selected client details
  const selectedClient = clients.find(client => client.id === formData.client_id) || null;
  
  // Get user preferences for dark mode
  const darkMode = useSelector(state => state.userPreferences?.darkMode) || false;
  
  // Get current user data
  const userData = useSelector(state => state.auth?.user) || {};
  
  // Get user's currency preference
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencySymbol = userCurrency === 'pkr' ? 'Rs ' : '$';

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setClientsLoading(true);
        const data = await clientService.getClients();
        setClients(data.results || data);
      } catch (err) {
        toast.error('Failed to fetch clients');
      } finally {
        setClientsLoading(false);
      }
    };
    
    fetchClients();
  }, []);

  // Calculate due date 14 days from issue date when issue date changes
  useEffect(() => {
    if (formData.issue_date) {
      const issueDate = new Date(formData.issue_date);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 14);
      setFormData(prev => ({
        ...prev,
        due_date: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issue_date]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle item changes
  const handleItemChange = (id, field, value) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate total if quantity or price changes
          if (field === 'quantity' || field === 'price') {
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };

  // Add new item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), description: '', quantity: 1, price: 0, total: 0 }
      ]
    }));
  };

  // Remove item
  const removeItem = (id) => {
    if (formData.items.length === 1) {
      toast.warning("Invoice must have at least one item");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.client_id) {
      toast.error("Please select a client");
      return;
    }
    
    if (formData.items.some(item => !item.description || item.price <= 0)) {
      toast.error("All items must have a description and price");
      return;
    }
    
    // Prepare data for submission
    const invoiceData = {
      client: formData.client_id,
      issue_date: formData.issue_date,
      due_date: formData.due_date,
      notes: formData.notes,
      payment_terms: formData.payment_terms,
      conditions: formData.conditions,
      tax_rate: formData.tax_rate,
      items: formData.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.price
      }))
    };
    
    try {
      setSubmitting(true);
      const response = await invoiceService.createInvoice(invoiceData);
      toast.success("Invoice created successfully!");
      navigate(`/invoices/${response.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/invoices')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to invoices"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-md transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Invoice
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            {/* Client Information */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h2>
              <div className="mb-4">
   
                
                  <div>
                    <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Client
                    </label>
                    <div className="flex space-x-2">
                      <select
                        id="client_id"
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleInputChange}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                        disabled={clientsLoading}
                      >
                        <option value="">-- Select a client --</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsAddClientModalOpen(true)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer"
                        title="Add new client"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                
              </div>
              
              {selectedClient && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium text-gray-800">{selectedClient.name}</p>
                  <p className="text-gray-600 text-sm">{selectedClient.email}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{selectedClient.address}</p>
                </div>
              )}
            
            </div>
            
            {/* Invoice Details */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="issue_date"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Invoice Items */}
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Items</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th scope="col" className="px-4 py-3 font-medium text-gray-700 w-75">Description</th>
                      <th scope="col" className="px-4 py-3 font-medium text-gray-700 w-24">Quantity</th>
                      <th scope="col" className="px-4 py-3 font-medium text-gray-700 w-24">Price</th>
                      <th scope="col" className="px-4 py-3 font-medium text-gray-700 w-24">Total</th>
                      <th scope="col" className="px-4 py-3 font-medium text-gray-700 w-[4]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.items.map((item) => (
                      <tr key={item.id} className="bg-white">
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                          />
                        </td>
                        <td className="py-3">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">{currencySymbol} </span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {currencySymbol}{(item.quantity * item.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            aria-label="Remove item"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button
                type="button"
                onClick={addItem}
                className="mt-4 flex items-center text-[#F97316] hover:text-[#EA580C] font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </button>
              
                      <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-800">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <label htmlFor="tax_rate" className="text-gray-600">Tax Rate (%):</label>
                  <input
                    type="number"
                    id="tax_rate"
                    name="tax_rate"
                    value={formData.tax_rate}
                    onChange={handleInputChange}
                    className="w-24 border border-gray-300 rounded-md px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax Amount:</span>
                  <span className="font-medium text-gray-800">{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-semibold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-gray-900">{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (visible to client)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  placeholder="Additional notes for the client"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  id="payment_terms"
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  placeholder="Payment terms (e.g., Payment due within 14 days of issue)"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Terms and Conditions
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  rows="3"
                  value={formData.conditions}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  placeholder="Terms and conditions for this invoice"
                ></textarea>
              </div>
            </div>
         
          </form>
        </div>
        
        {/* Right Side - Preview */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">

            <div className="bg-gray-50 min-h-[800px]">
              {/* Invoice Preview Content using the reusable InvoiceTemplate */}
              <InvoiceTemplate
                invoice={{
                  invoice_number: formData.invoice_number,
                  issue_date: formData.issue_date,
                  due_date: formData.due_date,
                  subtotal: subtotal,
                  tax_rate: formData.tax_rate,
                  tax_amount: taxAmount,
                  total: total,
                  notes: formData.notes,
                  payment_terms: formData.payment_terms,
                  conditions: formData.conditions,
                  items: formData.items.map(item => ({
                    id: item.id,
                    description: item.description || 'No description',
                    quantity: item.quantity,
                    unit_price: item.price,
                  })),
                  status: 'draft'
                }}
                showThemeToggle={false}
                user={user}
                client={selectedClient ? {
                  name: selectedClient.name,
                  email: selectedClient.email,
                  address: selectedClient.address,
                  company_name: selectedClient.company_name,
                  phone_number: selectedClient.phone_number
                } : null}
                darkMode={false}
               
              />

            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Add Client Modal */}
    <AddClientModal
      isOpen={isAddClientModalOpen}
      onClose={() => setIsAddClientModalOpen(false)}
      onClientAdded={(newClient) => {
        // Add the new client to the clients list
        setClients(prevClients => [newClient, ...prevClients]);
        
        // Select the new client in the form
        setFormData(prev => ({
          ...prev,
          client_id: newClient.id
        }));
        
        // Switch to regular client type
        setClientType('regular');
      }}
    />
    </DashboardLayout>
  );
};

export default AddInvoicePage;
