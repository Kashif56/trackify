import axiosInstance from './axiosInstance';

// Bank Account API functions
export const bankAccountApi = {
  // Get user's bank account
  getBankAccount: async () => {
    const response = await axiosInstance.get('/users/bank-account/');
    return response.data;
  },
  
  // Create a new bank account
  createBankAccount: async (bankAccountData) => {
    const response = await axiosInstance.post('/users/bank-account/', bankAccountData);
    return response.data;
  },
  
  // Update bank account
  updateBankAccount: async (bankAccountData) => {
    const response = await axiosInstance.patch('/users/bank-account/', bankAccountData);
    return response.data;
  },
  
  // Delete bank account
  deleteBankAccount: async () => {
    const response = await axiosInstance.delete('/users/bank-account/');
    return response.data;
  },
};

export default bankAccountApi;
