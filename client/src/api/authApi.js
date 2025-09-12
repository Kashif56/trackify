import axiosInstance from './axiosInstance';

// Authentication API functions
export const authApi = {
  // Register a new user
  register: async (userData) => {
    const response = await axiosInstance.post('/users/register/', userData);
    return response.data;
  },
  
  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post('/users/login/', credentials);
    return response.data;
  },
  
  // Verify email with token
  verifyEmail: async (token) => {
    const response = await axiosInstance.get(`/users/verify-email/${token}/`);
    return response.data;
  },
  
  // Resend verification email
  resendVerification: async (email) => {
    const response = await axiosInstance.post('/users/resend-verification/', { email });
    return response.data;
  },
  
  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/users/token/refresh/', { refresh: refreshToken });
    return response.data;
  },
  
  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile/');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.patch('/users/profile/update/', profileData);
    return response.data;
  },
};

export default authApi;
