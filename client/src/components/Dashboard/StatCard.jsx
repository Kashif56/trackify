import React from 'react';
import PropTypes from 'prop-types';

import { 
    ChevronDown, ChevronUp
  } from 'lucide-react';

/**
 * StatCard Component
 * 
 * A reusable card component for displaying statistics on the dashboard.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the stat card
 * @param {string|number} props.value - The value to display
 * @param {React.ReactNode} props.icon - The icon to display (Lucide icon component)
 * @param {string} props.iconBgColor - Background color for the icon container
 * @param {string} props.trend - Trend direction ('up', 'down', or null)
 * @param {string} props.trendValue - Value of the trend (e.g., '12%')
 * @param {string} props.trendLabel - Label for the trend (e.g., 'vs last month')
 */
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor = 'bg-[#F97316]', 
  trend = null,
  trendValue = '',
  trendLabel = ''
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor} bg-opacity-10`}>
          {Icon && <Icon className={`w-6 h-6 ${iconBgColor.replace('bg-', 'text-')}`} />}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-2">
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
          } flex items-center`}>
            {trend === 'up' ? (
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
            ) : trend === 'down' ? (
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            ) : null}
            {trendValue}
          </span>
          <span className="text-xs text-gray-500 ml-1">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  iconBgColor: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', null]),
  trendValue: PropTypes.string,
  trendLabel: PropTypes.string
};

export default StatCard;
