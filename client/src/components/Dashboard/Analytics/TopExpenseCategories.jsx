import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { getTopExpenseCategories } from '../../../api/analyticsApi';
import { toast } from 'react-toastify';

const TopExpenseCategories = () => {
  const [categoriesData, setCategoriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(5);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    fetchCategoriesData();
  }, [limit]);

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (dateRange.startDate && dateRange.endDate) {
        response = await getTopExpenseCategories(limit, dateRange.startDate, dateRange.endDate);
      } else {
        response = await getTopExpenseCategories(limit);
      }
      
      setCategoriesData(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load expense categories data');
      toast.error('Failed to load expense categories data');
      setLoading(false);
      console.error('Error fetching expense categories data:', err);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
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
      fetchCategoriesData();
    } else {
      toast.error('Please select both start and end dates');
    }
  };

  // Generate colors for categories
  const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#C9CBCF', '#5366FF', '#FF63FF', '#63FF84',
    '#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884D8'
  ];
  
  // Get color for a specific index
  const getCategoryColor = (index) => {
    return COLORS[index % COLORS.length];
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
    if (!categoriesData || categoriesData.length === 0) {
      return [];
    }

    return categoriesData.map((item, index) => ({
      name: item.category,
      value: item.total,
      color: getCategoryColor(index)
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
    if (!categoriesData) return 0;
    return categoriesData.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">Top Expense Categories</h2>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <label htmlFor="limit" className="text-sm text-gray-600">Show:</label>
            <select
              id="limit"
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="3">Top 3</option>
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
            </select>
          </div>
          
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : categoriesData && categoriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={prepareChartData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  paddingAngle={2}
                >
                  {prepareChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ paddingLeft: '10px' }}
                  formatter={(value) => <span className="text-xs text-gray-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No expense data available</p>
            </div>
          )}
        </div>

        <div>
          {categoriesData && categoriesData.length > 0 ? (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">Total Expenses</h3>
                <p className="text-xl font-bold text-gray-800">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(calculateTotal())}
                </p>
              </div>
              
              <div className="space-y-3">
                {categoriesData.map((item, index) => {
                  const percentage = (item.total / calculateTotal() * 100).toFixed(1);
                  const color = getCategoryColor(index);
                  
                  return (
                    <div key={item.category} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-medium text-gray-700">{item.category}</h3>
                        <p className="text-sm font-bold text-gray-800">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(item.total)}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{percentage}% of total expenses</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !loading && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No expense data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopExpenseCategories;
