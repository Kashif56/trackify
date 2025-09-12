import axiosInstance from './axiosInstance';

/**
 * Dashboard API service
 * Handles API calls related to dashboard data
 */
const dashboardApi = {
  /**
   * Get dashboard data including stats and recent invoices/expenses
   * @returns {Promise} Promise object with dashboard data
   */
  getDashboardData: async () => {
    try {
      const response = await axiosInstance.get('/users/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

export default dashboardApi;
