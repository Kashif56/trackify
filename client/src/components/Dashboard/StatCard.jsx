import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';


/**
 * StatCard Component
 * 
 * A reusable card component for displaying statistics on the dashboard.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the stat card
 * @param {string|number} props.value - The value to display
 * @param {React.ReactNode} props.icon - The icon to display (Lucide icon component)
 * @param {string} props.subtitle - A short description below the value
 * @param {string} props.color - The base color theme for the card (e.g., 'green', 'yellow', 'red')
 * @param {boolean} props.isCurrency - Whether the value is a currency amount
 * @param {boolean} props.formatValue - Whether to format the value (e.g., add commas to large numbers)
 */
const StatCard = ({ title, value, icon, subtitle, color, isCurrency = true, formatValue = false }) => {
  // Get user's currency preference from Redux store if this is a currency value
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencySymbol = userCurrency === 'pkr' ? 'Rs ' : '$';
  
  // Format the value if needed
  let displayValue = value;
  if (isCurrency) {
    // Add currency symbol
    displayValue = `${currencySymbol}${typeof value === 'number' ? value.toLocaleString() : value}`;
  } else if (formatValue && typeof value === 'number') {
    // Just format the number with commas
    displayValue = value.toLocaleString();
  }
  const colorClasses = {
    default: {
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      valueText: 'text-gray-900',
    },
    primary: {
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      valueText: 'text-orange-900',
    },
    green: {
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      valueText: 'text-green-900',
    },
    yellow: {
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      valueText: 'text-yellow-900',
    },
    red: {
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      valueText: 'text-red-900',
    },
  };

  const theme = colorClasses[color] || colorClasses.default;

  return (
    <div className="rounded-lg p-5 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md bg-white">
      <div className="flex items-start justify-between">
        
        <div className="text-left">
          <h3 className="text-xs font-medium text-gray-500">{title}</h3>
          <p className={`text-3xl font-bold mt-1`}>{displayValue}</p>
        </div>
        <div className={``}>
          {React.cloneElement(icon, { className: `w-6 h-6 ${theme.iconText}` })}
        </div>
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-3">{subtitle}</p>}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element.isRequired,
  subtitle: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'green', 'yellow', 'red', 'default']),
  isCurrency: PropTypes.bool,
  formatValue: PropTypes.bool,
};

export default StatCard;
