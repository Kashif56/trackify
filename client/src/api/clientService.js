import axiosInstance from './axiosInstance';

// Client API service
const clientService = {
  // Get all clients
  getClients: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/client/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch clients' };
    }
  },

  // Get a single client by ID
  getClientById: async (id) => {
    try {
      const response = await axiosInstance.get(`/client/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch client details' };
    }
  },

  // Create a new client
  createClient: async (clientData) => {
    try {
      const response = await axiosInstance.post('/client/', clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create client' };
    }
  },

  // Update an existing client
  updateClient: async (id, clientData) => {
    try {
      const response = await axiosInstance.patch(`/client/${id}/`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update client' };
    }
  },

  // Delete a client
  deleteClient: async (id) => {
    try {
      const response = await axiosInstance.delete(`/client/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete client' };
    }
  }
};

export default clientService;
