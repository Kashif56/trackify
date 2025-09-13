import axiosInstance from './axiosInstance';

// Profile API functions
export const profileApi = {
  // Get user profile details
  getProfileDetails: async () => {
    const response = await axiosInstance.get('/users/profile/details/');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.patch('/users/profile/update/', profileData);
    return response.data;
  },
  
  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    const response = await axiosInstance.patch('/users/profile/update/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default profileApi;
