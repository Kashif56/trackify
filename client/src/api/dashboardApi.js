import axiosInstance from './axiosInstance';

/**
 * Dashboard API service
 * Handles API calls related to dashboard data
 */
const dashboardApi = {
  /**
   * Get dashboard data including stats and recent invoices/expenses
   * @param {Object} dateRange - Optional date range parameters
   * @param {string} dateRange.start_date - Start date in YYYY-MM-DD format
   * @param {string} dateRange.end_date - End date in YYYY-MM-DD format
   * @param {string} dateRange.range_type - Type of range (last_30_days, last_month, etc.)
   * @returns {Promise} Promise object with dashboard data
   */
  getDashboardData: async (dateRange = null) => {
    try {
      let url = '/users/dashboard/';
      
      // Add date range parameters if provided
      if (dateRange) {
        const params = new URLSearchParams();
        if (dateRange.start_date) params.append('start_date', dateRange.start_date);
        if (dateRange.end_date) params.append('end_date', dateRange.end_date);
        if (dateRange.range_type) params.append('range_type', dateRange.range_type);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

export default dashboardApi;
