import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingPayments } from '../../../api/analyticsApi';
import { toast } from 'react-toastify';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const UpcomingPayments = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchPaymentsData();
  }, [days]);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUpcomingPayments(days);
      setPaymentsData(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load upcoming payments data');
      toast.error('Failed to load upcoming payments data');
      setLoading(false);
      console.error('Error fetching upcoming payments data:', err);
    }
  };

  const handleDaysChange = (e) => {
    setDays(parseInt(e.target.value));
  };

  // Get status icon and color
  const getStatusInfo = (status, daysUntilDue) => {
    if (status === 'paid') {
      return {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        label: 'Paid'
      };
    } else if (daysUntilDue <= 3) {
      return {
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'Due Soon'
      };
    } else {
      return {
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        label: 'Upcoming'
      };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-orange-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Payments</h2>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <label htmlFor="days" className="text-sm text-gray-600">Show payments due in:</label>
          <select
            id="days"
            value={days}
            onChange={handleDaysChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7">Next 7 days</option>
            <option value="14">Next 14 days</option>
            <option value="30">Next 30 days</option>
            <option value="60">Next 60 days</option>
            <option value="90">Next 90 days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : paymentsData && paymentsData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentsData.map((payment) => {
                const statusInfo = getStatusInfo(payment.status, payment.days_until_due);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={payment.invoice_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/invoices/${payment.invoice_id}`} 
                        className="text-orange-500 hover:text-orange-700 font-medium"
                      >
                        {payment.invoice_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/clients/${payment.client_id}`} 
                        className="text-gray-900 hover:text-orange-500"
                      >
                        {payment.client_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{formatDate(payment.due_date)}</span>
                        <span className="text-xs text-gray-500">
                          {payment.days_until_due === 0 
                            ? 'Due today' 
                            : payment.days_until_due === 1 
                              ? 'Due tomorrow' 
                              : `Due in ${payment.days_until_due} days`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No upcoming payments due in the next {days} days</p>
            <p className="text-sm text-gray-400">All your invoices are paid or you haven't created any invoices yet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingPayments;
