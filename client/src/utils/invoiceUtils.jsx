/**
 * Renders a status badge with appropriate color based on the status.
 * @param {string} status - The status of the invoice (e.g., 'paid', 'unpaid', 'overdue').
 * @returns {JSX.Element}
 */
export const renderStatusBadge = (status) => {
  let bgColor = '';
  let textColor = '';

  switch (status.toLowerCase()) {
    case 'paid':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'unpaid':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'overdue':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <span className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
