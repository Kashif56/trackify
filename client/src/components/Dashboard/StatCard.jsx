import React from 'react';
import PropTypes from 'prop-types';


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
 */
const StatCard = ({ title, value, icon, subtitle, color }) => {
  const colorClasses = {
    default: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-200',
      iconText: 'text-gray-600',
      valueText: 'text-gray-900',
    },
    primary: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      valueText: 'text-orange-900',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      valueText: 'text-green-900',
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      valueText: 'text-yellow-900',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      valueText: 'text-red-900',
    },
  };

  const theme = colorClasses[color] || colorClasses.default;

  return (
    <div className={`rounded-lg p-5 transition-all duration-300 border border-transparent hover:border-gray-200 ${theme.bg}`}>
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${theme.iconBg}`}>
          {React.cloneElement(icon, { className: `w-6 h-6 ${theme.iconText}` })}
        </div>
        <div className="text-right">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${theme.valueText}`}>{value}</p>
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
};

export default StatCard;
