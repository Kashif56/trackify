import { useState } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import IncomeExpensesChart from '../../../components/Dashboard/Analytics/IncomeExpensesChart';
import InvoiceStatusBreakdown from '../../../components/Dashboard/Analytics/InvoiceStatusBreakdown';
import TopExpenseCategories from '../../../components/Dashboard/Analytics/TopExpenseCategories';
import UpcomingPayments from '../../../components/Dashboard/Analytics/UpcomingPayments';
import GrowthRate from '../../../components/Dashboard/Analytics/GrowthRate';
import { BarChart2, PieChart, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart2 },
    { id: 'income-expenses', name: 'Income & Expenses', icon: TrendingUp },
    { id: 'invoices', name: 'Invoices', icon: PieChart },
    { id: 'upcoming', name: 'Upcoming Payments', icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Track your business performance with detailed analytics and insights.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.id} className="mr-2">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-orange-500 border-orange-500'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <GrowthRate />
              <InvoiceStatusBreakdown />
            </div>
            <IncomeExpensesChart />
            <TopExpenseCategories />
            <UpcomingPayments />
          </div>
        )}

        {/* Income & Expenses Tab */}
        {activeTab === 'income-expenses' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <GrowthRate />
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Income & Expenses Summary</h2>
                <p className="text-gray-600">
                  Track your income and expenses over time to better understand your business's financial health.
                </p>
              </div>
            </div>
            <IncomeExpensesChart />
            <TopExpenseCategories />
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InvoiceStatusBreakdown />
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Analytics</h2>
                <p className="text-gray-600">
                  Analyze your invoices by status, amount, and client to identify patterns and opportunities.
                </p>
              </div>
            </div>
            <UpcomingPayments />
          </div>
        )}

        {/* Upcoming Payments Tab */}
        {activeTab === 'upcoming' && (
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Schedule</h2>
              <p className="text-gray-600">
                Keep track of upcoming payments to manage your cash flow effectively.
              </p>
            </div>
            <UpcomingPayments />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
