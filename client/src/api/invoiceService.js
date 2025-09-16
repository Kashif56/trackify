import axiosInstance from './axiosInstance';

// Invoice API service
const invoiceService = {
  /**
   * Get all invoices with optional filters including date range
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by invoice status
   * @param {string} params.search - Search term for invoice number or client name
   * @param {string} params.start_date - Start date in YYYY-MM-DD format
   * @param {string} params.end_date - End date in YYYY-MM-DD format
   * @param {string} params.range_type - Type of date range (last_30_days, last_month, etc.)
   * @returns {Promise} Promise with invoice data
   */
  getInvoices: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/invoice/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch invoices' };
    }
  },

  // Get a single invoice by ID
  getInvoiceById: async (id) => {
    try {
      const response = await axiosInstance.get(`/invoice/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch invoice details' };
    }
  },

  // Delete an invoice
  deleteInvoice: async (id) => {
    try {
      await axiosInstance.delete(`/invoice/${id}/`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete invoice' };
    }
  },

  /**
   * Check if an invoice has a payment gateway configured
   * 
   * @param {string} id - Invoice ID to check
   * @returns {Promise} - Promise with gateway availability information
   */
  checkInvoicePaymentGateway: async (id) => {
    try {
      const response = await api.get(`/payment/invoice/${id}/gateway-check/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check invoice payment gateway' };
    }
  },

  // Create a new invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await axiosInstance.post('/invoice/', invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create invoice' };
    }
  },

  // Update an existing invoice
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await axiosInstance.patch(`/invoice/${id}/`, invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update invoice' };
    }
  },

  // Delete an invoice
  deleteInvoice: async (id) => {
    try {
      await axiosInstance.delete(`/invoice/${id}/`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete invoice' };
    }
  },
};

export default invoiceService;
