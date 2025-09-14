import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGrowthRate } from '../../../api/analyticsApi';
import { toast } from 'react-toastify';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const GrowthRate = () => {
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user's currency preference from Redux store
  const { user } = useSelector(state => state.user);
  const userCurrency = user?.profile?.currency || 'pkr';
  const currencyCode = userCurrency === 'pkr' ? 'PKR' : 'USD';

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getGrowthRate();
      setGrowthData(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load growth rate data');
      toast.error('Failed to load growth rate data');
      setLoading(false);
      console.error('Error fetching growth rate data:', err);
    }
  };

  const handleRefresh = () => {
    fetchGrowthData();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Monthly Growth Rate</h2>
        <button 
          onClick={handleRefresh}
          className="text-gray-500 hover:text-orange-500 focus:outline-none"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : growthData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              {growthData.is_positive ? (
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mr-2" />
                  <span className="text-3xl font-bold text-green-500">+{growthData.growth_rate}%</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <TrendingDown className="w-8 h-8 text-red-500 mr-2" />
                  <span className="text-3xl font-bold text-red-500">{growthData.growth_rate}%</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-2">
              {growthData.current_month} compared to {growthData.previous_month}
            </p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h3 className="text-xs font-medium text-gray-500">{growthData.current_month}</h3>
                <p className="text-lg font-bold text-gray-800">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currencyCode,
                  }).format(growthData.current_month_revenue)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h3 className="text-xs font-medium text-gray-500">{growthData.previous_month}</h3>
                <p className="text-lg font-bold text-gray-800">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currencyCode,
                  }).format(growthData.previous_month_revenue)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={growthData.is_positive ? '#10b981' : '#ef4444'}
                  strokeWidth="10"
                  strokeDasharray={`${Math.min(Math.abs(growthData.growth_rate) * 2.8, 283)} 283`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50%"
                  y="50%"
                  dy=".3em"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="bold"
                  fill={growthData.is_positive ? '#10b981' : '#ef4444'}
                >
                  {growthData.is_positive ? '+' : ''}{growthData.growth_rate}%
                </text>
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <p className="text-gray-500">No growth rate data available</p>
        </div>
      )}
      
      {growthData && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Insights</h3>
          <p className="text-sm text-gray-600">
            {growthData.is_positive 
              ? `Your revenue has increased by ${growthData.growth_rate}% compared to last month. Keep up the good work!` 
              : growthData.growth_rate === 0
                ? 'Your revenue has remained the same as last month.'
                : `Your revenue has decreased by ${Math.abs(growthData.growth_rate)}% compared to last month. Consider reviewing your business strategy.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GrowthRate;
