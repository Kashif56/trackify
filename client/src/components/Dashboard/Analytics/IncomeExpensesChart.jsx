import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { getIncomeExpenses } from '../../../api/analyticsApi';
import { toast } from 'react-toastify';

const IncomeExpensesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('monthly');
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [showCustomRange, setShowCustomRange] = useState(false);
  
  // Get user's currency preference from Redux store
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencySymbol = userCurrency === 'pkr' ? 'Rs' : '$';
  const currencyCode = userCurrency === 'pkr' ? 'PKR' : 'USD';

  const dateRangeOptions = [
    { value: 'daily', label: 'Daily (Last 30 days)' },
    { value: 'weekly', label: 'Weekly (Last 12 weeks)' },
    { value: 'monthly', label: 'Monthly (Last 6 months)' },
    { value: '6months', label: 'Last 6 months' },
    { value: 'yearly', label: 'Yearly (Last year)' },
    { value: 'custom', label: 'Custom Range' },
  ];

  useEffect(() => {
    fetchChartData();
  }, [dateRange]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (dateRange === 'custom' && customRange.startDate && customRange.endDate) {
        response = await getIncomeExpenses(null, customRange.startDate, customRange.endDate);
      } else if (dateRange !== 'custom') {
        response = await getIncomeExpenses(dateRange);
      } else {
        // If custom range is selected but dates are not set, don't fetch
        setLoading(false);
        return;
      }
      
      setChartData(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load chart data');
      toast.error('Failed to load income vs expenses data');
      setLoading(false);
      console.error('Error fetching income vs expenses data:', err);
    }
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    setShowCustomRange(value === 'custom');
  };

  const handleCustomRangeChange = (e) => {
    const { name, value } = e.target;
    setCustomRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomRangeSubmit = (e) => {
    e.preventDefault();
    if (customRange.startDate && customRange.endDate) {
      fetchChartData();
    } else {
      toast.error('Please select both start and end dates');
    }
  };

  // Format currency for tooltips and labels
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">Income vs Expenses</h2>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {showCustomRange && (
            <form 
              onSubmit={handleCustomRangeSubmit}
              className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0"
            >
              <input
                type="date"
                name="startDate"
                value={customRange.startDate}
                onChange={handleCustomRangeChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                name="endDate"
                value={customRange.endDate}
                onChange={handleCustomRangeChange}
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

      <div className="h-80">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : chartData && chartData.data && chartData.data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData.data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(75, 192, 192, 0.8)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgba(75, 192, 192, 0.2)" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255, 99, 132, 0.8)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgba(255, 99, 132, 0.2)" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="income" 
                name="Income"
                stroke="rgba(75, 192, 192, 1)" 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                name="Expenses"
                stroke="rgba(255, 99, 132, 1)" 
                fillOpacity={1} 
                fill="url(#colorExpenses)" 
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                name="Net"
                stroke="rgba(54, 162, 235, 1)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No data available for the selected period</p>
          </div>
        )}
      </div>

      {chartData && chartData.data && chartData.data.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800">Total Income</h3>
            <p className="text-xl font-bold text-green-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
              }).format(chartData.data.reduce((sum, item) => sum + item.income, 0))}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
            <p className="text-xl font-bold text-red-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
              }).format(chartData.data.reduce((sum, item) => sum + item.expenses, 0))}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">Net Balance</h3>
            <p className="text-xl font-bold text-blue-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
              }).format(chartData.data.reduce((sum, item) => sum + item.net, 0))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeExpensesChart;
