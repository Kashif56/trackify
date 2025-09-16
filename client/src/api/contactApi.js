import axiosInstance from './axiosInstance';

/**
 * Send a contact form message
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Name of the sender
 * @param {string} contactData.email - Email of the sender
 * @param {string} contactData.subject - Subject of the message
 * @param {string} contactData.message - Message content
 * @returns {Promise} - Promise with the response data
 */
export const sendContactMessage = async (contactData) => {
  try {
    const response = await axiosInstance.post('/users/contact/', contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to send message' };
  }
};
