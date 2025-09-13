import axiosInstance from './axiosInstance';

// Get income vs expenses data with optional date range filtering
export const getIncomeExpenses = async (range = 'monthly', startDate = null, endDate = null) => {
  try {
    let params = {};
    
    if (range) {
      params.range = range;
    }
    
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    
    const response = await axiosInstance.get('/analytic/income-expenses/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get invoice status breakdown
export const getInvoiceStatusBreakdown = async (startDate = null, endDate = null) => {
  try {
    let params = {};
    
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    
    const response = await axiosInstance.get('/analytic/invoice-status-breakdown/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get top expense categories
export const getTopExpenseCategories = async (limit = 5, startDate = null, endDate = null) => {
  try {
    let params = { limit };
    
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    
    const response = await axiosInstance.get('/analytic/top-expense-categories/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get upcoming payments
export const getUpcomingPayments = async (days = 30) => {
  try {
    const response = await axiosInstance.get('/analytic/upcoming-payments/', { 
      params: { days } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get growth rate
export const getGrowthRate = async () => {
  try {
    const response = await axiosInstance.get('/analytic/growth-rate/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
