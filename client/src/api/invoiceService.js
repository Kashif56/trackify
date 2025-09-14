import axiosInstance from './axiosInstance';

// Invoice API service
const invoiceService = {
  // Get all invoices with optional filters
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
