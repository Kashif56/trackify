import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { getInvoiceStatusBreakdown } from '../../../api/analyticsApi';
import { toast } from 'react-toastify';

const InvoiceStatusBreakdown = () => {
  const [breakdownData, setBreakdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    fetchBreakdownData();
  }, []);

  const fetchBreakdownData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (dateRange.startDate && dateRange.endDate) {
        response = await getInvoiceStatusBreakdown(dateRange.startDate, dateRange.endDate);
      } else {
        response = await getInvoiceStatusBreakdown();
      }
      
      setBreakdownData(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoice status breakdown');
      toast.error('Failed to load invoice status breakdown');
      setLoading(false);
      console.error('Error fetching invoice status breakdown:', err);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateFilterSubmit = (e) => {
    e.preventDefault();
    if (dateRange.startDate && dateRange.endDate) {
      fetchBreakdownData();
    } else {
      toast.error('Please select both start and end dates');
    }
  };

  // Status colors
  const statusColors = {
    paid: {
      color: '#4BC0C0',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColorClass: 'border-green-200'
    },
    unpaid: {
      color: '#FFCE56',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColorClass: 'border-yellow-200'
    },
    overdue: {
      color: '#FF6384',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColorClass: 'border-red-200'
    },
    draft: {
      color: '#C9CBCF',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColorClass: 'border-gray-200'
    }
  };

  // Format currency for tooltips and labels
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare chart data for Recharts
  const prepareChartData = () => {
    if (!breakdownData || breakdownData.length === 0) {
      return [];
    }

    return breakdownData.map((item) => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.total,
      color: statusColors[item.status]?.color || '#C9CBCF'
    }));
  };

  // Active index for pie chart animation
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium text-gray-700">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].payload.color }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom active shape for pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 6}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  // Calculate total
  const calculateTotal = () => {
    if (!breakdownData) return 0;
    return breakdownData.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">Invoice Status Breakdown</h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="text-sm text-gray-600 hover:text-orange-500 underline"
          >
            {showDateFilter ? 'Hide Filter' : 'Filter by Date'}
          </button>
          
          {showDateFilter && (
            <form 
              onSubmit={handleDateFilterSubmit}
              className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0"
            >
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm transition duration-300"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 relative">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : breakdownData && breakdownData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={prepareChartData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {prepareChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatCurrency(calculateTotal())}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No invoice data available</p>
            </div>
          )}
        </div>

        <div>
          {breakdownData && breakdownData.length > 0 ? (
            <div className="space-y-3">
              {breakdownData.map((item) => {
                const status = item.status;
                const colorClasses = statusColors[status] || statusColors.draft;
                
                return (
                  <div 
                    key={status} 
                    className={`p-3 rounded-lg border ${colorClasses.borderColorClass} ${colorClasses.bgColor}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`text-sm font-medium capitalize ${colorClasses.textColor}`}>
                          {status}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.count} {item.count === 1 ? 'invoice' : 'invoices'}
                        </p>
                      </div>
                      <p className={`text-lg font-bold ${colorClasses.textColor}`}>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.total)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !loading && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No invoice data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusBreakdown;
