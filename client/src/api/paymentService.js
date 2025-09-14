import axiosInstance from "./axiosInstance";

/**
 * Payment Service
 * 
 * Handles all payment-related axiosInstance calls
 */
const paymentService = {
  /**
   * Create a payment session for an invoice
   * 
   * @param {string} invoiceId - ID of the invoice to pay
   * @param {string} successUrl - URL to redirect after successful payment
   * @param {string} cancelUrl - URL to redirect after cancelled payment
   * @param {string} currency - Currency code (e.g., 'usd', 'pkr')
   * @param {string} gatewayId - Optional ID of the specific payment gateway to use
   * @returns {Promise} - Promise with payment session data
   */
  createPaymentSession: async (invoiceId, successUrl, cancelUrl, currency = null, gatewayId = null) => {
    const data = {
      invoice_id: invoiceId,
      success_url: successUrl,
      cancel_url: cancelUrl
    };
    
    // Include currency if provided
    if (currency) {
      data.currency = currency;
    }
    
    if (gatewayId) {
      data.gateway_id = gatewayId;
    }
    
    const response = await axiosInstance.post('/payment/create-session/', data);
    return response.data;
  },
  
  /**
   * Get the status of a payment
   * 
   * @param {string} paymentId - ID of the payment to check
   * @returns {Promise} - Promise with payment status
   */
  getPaymentStatus: async (paymentId) => {
    const response = await axiosInstance.get(`/payment/status/${paymentId}/`);
    return response.data;
  },
  
  /**
   * Get public payment information for an invoice
   * 
   * @param {string} invoiceId - ID of the invoice
   * @returns {Promise} - Promise with payment information
   */
  getPublicPaymentInfo: async (invoiceId) => {
    const response = await axiosInstance.get(`/payment/public/invoice/${invoiceId}/`);
    return response.data;
  },
  
  /**
   * Get payment gateway information for an invoice
   * 
   * @param {string} invoiceId - ID of the invoice
   * @returns {Promise} - Promise with gateway information
   */
  getInvoicePaymentGateway: async (invoiceId) => {
    const response = await axiosInstance.get(`/payment/invoice/${invoiceId}/gateway/`);
    return response.data;
  },
  
  /**
   * Check if an invoice has a payment gateway configured
   * 
   * @param {string} invoiceId - ID of the invoice
   * @returns {Promise} - Promise with gateway availability information
   */
  checkInvoiceGateway: async (invoiceId) => {
    const response = await axiosInstance.get(`/payment/invoice/${invoiceId}/gateway-check/`);
    return response.data;
  },
  
  /**
   * Get all payments for an invoice
   * 
   * @param {string} invoiceId - ID of the invoice
   * @returns {Promise} - Promise with list of payments
   */
  getInvoicePayments: async (invoiceId) => {
    const response = await axiosInstance.get(`/payment/invoice/${invoiceId}/payments/`);
    return response.data;
  },
  
  /**
   * Get all payment gateways configured for the current user
   * 
   * @returns {Promise} - Promise with list of payment gateways
   */
  getPaymentGateways: async () => {
    const response = await axiosInstance.get('/payment/gateways/');
    
    return response.data;
  },
  
  /**
   * Get all available payment gateways
   * 
   * @returns {Promise} - Promise with list of available gateways
   */
  getAvailableGateways: async () => {
    const response = await axiosInstance.get('/payment/available-gateways/');
    
    return response.data;
  },
  
  /**
   * Create a new payment gateway configuration
   * 
   * @param {Object} gatewayData - Gateway configuration data
   * @returns {Promise} - Promise with created gateway data
   */
  createPaymentGateway: async (gatewayData) => {
    const response = await axiosInstance.post('/payment/gateways/', gatewayData);
    return response.data;
  },
  
  /**
   * Update a payment gateway configuration
   * 
   * @param {string} gatewayId - ID of the gateway to update
   * @param {Object} gatewayData - Updated gateway data
   * @returns {Promise} - Promise with updated gateway data
   */
  updatePaymentGateway: async (gatewayId, gatewayData) => {
    const response = await axiosInstance.put(`/payment/gateways/${gatewayId}/`, gatewayData);
    return response.data;
  },
  
  /**
   * Delete a payment gateway configuration
   * 
   * @param {string} gatewayId - ID of the gateway to delete
   * @returns {Promise} - Promise with deletion status
   */
  deletePaymentGateway: async (gatewayId) => {
    const response = await axiosInstance.delete(`/payment/gateways/${gatewayId}/`);
    return response.data;
  },
  
  /**
   * Refund a payment
   * 
   * @param {string} paymentId - ID of the payment to refund
   * @returns {Promise} - Promise with refund status
   */
  refundPayment: async (paymentId) => {
    const response = await axiosInstance.post(`/payment/refund/${paymentId}/`);
    return response.data;
  },
  
  /**
   * Update payment status
   * 
   * @param {string} paymentId - ID of the payment to update
   * @param {string} status - New status for the payment
   * @param {string} gatewayPaymentId - Payment ID from the gateway
   * @returns {Promise} - Promise with updated payment data
   */
  updatePaymentStatus: async (paymentId, status, gatewayPaymentId) => {
    const response = await axiosInstance.patch(`/payment/status/${paymentId}/`, {
      status,
      gateway_payment_id: gatewayPaymentId
    });
    return response.data;
  },
  
  /**
   * Capture a payment (for PayPal and similar gateways)
   * 
   * @param {string} paymentId - ID of the payment to capture
   * @param {string} orderId - Order ID from the gateway
   * @returns {Promise} - Promise with capture result
   */
  capturePayment: async (paymentId, orderId) => {
    const response = await axiosInstance.post(`/payment/capture/${paymentId}/`, {
      order_id: orderId
    });
    return response.data;
  },

  /**
   * Get all payments with pagination
   * 
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with list of all payments
   */
  getAllPayments: async (page = 1, pageSize = 50) => {
    const response = await axiosInstance.get('/payment/all/', {
      params: { page, page_size: pageSize }
    });
    return response.data;
  }
};

export default paymentService;
