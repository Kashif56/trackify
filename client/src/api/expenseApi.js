import axiosInstance from './axiosInstance';

/**
 * Expense API service
 * Handles API calls related to expenses and expense categories
 */
const expenseApi = {
  /**
   * Get list of expenses with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number for pagination
   * @param {string} params.category - Filter by category ID
   * @param {string} params.start_date - Filter by start date (YYYY-MM-DD)
   * @param {string} params.end_date - Filter by end date (YYYY-MM-DD)
   * @returns {Promise} Promise object with paginated expenses data
   */
  getExpenses: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/expense/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  /**
   * Get a specific expense by ID
   * @param {string} id - Expense ID
   * @returns {Promise} Promise object with expense data
   */
  getExpense: async (id) => {
    try {
      const response = await axiosInstance.get(`/expense/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new expense
   * @param {Object} expenseData - Expense data
   * @param {string} expenseData.category - Category ID
   * @param {number} expenseData.amount - Expense amount
   * @param {string} expenseData.date - Expense date (YYYY-MM-DD)
   * @param {string} expenseData.description - Expense description
   * @param {string} expenseData.notes - Additional notes (optional)
   * @param {File} expenseData.receipt - Receipt file (optional)
   * @returns {Promise} Promise object with created expense data
   */
  createExpense: async (expenseData) => {
    try {
      // Handle file upload if receipt is provided
      if (expenseData.receipt instanceof File) {
        const formData = new FormData();
        
        // Add all other fields to formData
        Object.keys(expenseData).forEach(key => {
          if (key !== 'receipt' || expenseData[key] !== null) {
            formData.append(key, expenseData[key]);
          }
        });
        
        const response = await axiosInstance.post('/expense/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Regular JSON request if no file is included
        const response = await axiosInstance.post('/expense/', expenseData);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  /**
   * Update an existing expense
   * @param {string} id - Expense ID
   * @param {Object} expenseData - Updated expense data
   * @returns {Promise} Promise object with updated expense data
   */
  updateExpense: async (id, expenseData) => {
    try {
      // Handle file upload if receipt is provided
      if (expenseData.receipt instanceof File) {
        const formData = new FormData();
        
        // Add all other fields to formData
        Object.keys(expenseData).forEach(key => {
          if (key !== 'receipt' || expenseData[key] !== null) {
            formData.append(key, expenseData[key]);
          }
        });
        
        const response = await axiosInstance.put(`/expense/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Regular JSON request if no file is included
        const response = await axiosInstance.put(`/expense/${id}/`, expenseData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating expense ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an expense
   * @param {string} id - Expense ID
   * @returns {Promise} Promise object
   */
  deleteExpense: async (id) => {
    try {
      const response = await axiosInstance.delete(`/expense/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting expense ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get list of expense categories
   * @returns {Promise} Promise object with expense categories
   */
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/expense/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      throw error;
    }
  },

  /**
   * Create a new expense category
   * @param {Object} categoryData - Category data
   * @param {string} categoryData.name - Category name
   * @param {string} categoryData.description - Category description (optional)
   * @returns {Promise} Promise object with created category data
   */
  createCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post('/expense/categories/', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating expense category:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing expense category
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @param {string} categoryData.name - Category name
   * @param {string} categoryData.description - Category description (optional)
   * @returns {Promise} Promise object with updated category data
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axiosInstance.put(`/expense/categories/${id}/`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating expense category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an expense category
   * @param {string} id - Category ID
   * @returns {Promise} Promise object
   */
  deleteCategory: async (id) => {
    try {
      const response = await axiosInstance.delete(`/expense/categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting expense category ${id}:`, error);
      throw error;
    }
  },
};

export default expenseApi;
