/**
 * Format a number as currency
 * 
 * @param {number|string} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return 'N/A';
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(numAmount)) return 'Invalid Amount';
  
  // Format the currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

/**
 * Format a number with commas
 * 
 * @param {number|string} number - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number) => {
  if (number === undefined || number === null) return 'N/A';
  
  // Convert to number if it's a string
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  // Check if it's a valid number
  if (isNaN(num)) return 'Invalid Number';
  
  // Format the number
  return new Intl.NumberFormat('en-US').format(num);
};
