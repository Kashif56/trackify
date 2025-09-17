import axios from 'axios';
import store from '../redux/store';
import { updateTokens, logout } from '../redux/slices/userSlice';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const BASE_URL = 'https://trackifye.up.railway.app/api';

// const BASE_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token and CSRF token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Add JWT token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    // Enable credentials to include cookies in requests
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token available, logout user
          store.dispatch(logout());
          toast.error('Your session has expired. Please log in again.');
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${BASE_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });
        
        // Update access token in store and localStorage
        store.dispatch(updateTokens({ access: response.data.access }));
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, logout user
        store.dispatch(logout());
        toast.error('Your session has expired. Please log in again.');
        return Promise.reject(refreshError);
      }
    }
    
    // Handle specific error types with appropriate messages
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx range
      const { status } = error.response;
      
      // Don't show error toast for 401 errors as they're handled above
      if (status !== 401) {
        switch (status) {
          case 403:
            // Forbidden - user doesn't have permission
            toast.error('You don\'t have permission to perform this action.');
            break;
          case 404:
            // Not found - resource doesn't exist
            // Don't show toast here as it might be a normal flow in some cases
            break;
          case 422:
            // Validation error
            toast.error('Please check your input and try again.');
            break;
          case 500:
          case 502:
          case 503:
            toast.error('Server error. Our team has been notified.');
            // Here you could add server-side error logging
            break;
          default:
            // Only show generic error for other status codes
            if (status >= 400) {
              toast.error('Something went wrong. Please try again later.');
            }
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
