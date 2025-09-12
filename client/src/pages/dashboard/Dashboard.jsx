import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import dashboardApi from '../../api/dashboardApi';

// Layout and Components
import DashboardLayout from '../../layout/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import ExpensesTable from '../../components/Dashboard/ExpensesTable';
import InvoicesTable from '../../components/Dashboard/InvoicesTable';

// Fallback data in case API fails
const fallbackData = {
  stats: {
    total_income: 0,
    total_expenses: 0,
    balance: 0,
    income_trend: 0,
    expense_trend: 0,
    balance_trend: 0
  },
  recent_invoices: [],
  recent_expenses: []
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  
  const { user, tokens } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await dashboardApi.getDashboardData();
        
        setStats({
          totalIncome: data.stats.total_income,
          totalExpenses: data.stats.total_expenses,
          balance: data.stats.balance,
          incomeTrend: data.stats.income_trend,
          expenseTrend: data.stats.expense_trend,
          balanceTrend: data.stats.balance_trend
        });
        
        setRecentInvoices(data.recent_invoices);
        setRecentExpenses(data.recent_expenses);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        
        // Use fallback data if API fails
        setStats({
          totalIncome: fallbackData.stats.total_income,
          totalExpenses: fallbackData.stats.total_expenses,
          balance: fallbackData.stats.balance,
          incomeTrend: fallbackData.stats.income_trend,
          expenseTrend: fallbackData.stats.expense_trend,
          balanceTrend: fallbackData.stats.balance_trend
        });
        
        setRecentInvoices(fallbackData.recent_invoices);
        setRecentExpenses(fallbackData.recent_expenses);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  // Event handlers for invoice actions
  const handleViewInvoice = (invoice) => {
    // Navigate to invoice detail page
    toast.info(`Viewing invoice ${invoice.invoice_number}`);
  };
  
  const handleEditInvoice = (invoice) => {
    // Navigate to invoice edit page
    toast.info(`Editing invoice ${invoice.invoice_number}`);
  };
  
  const handleDeleteInvoice = (invoice) => {
    // Show confirmation dialog and delete if confirmed
    toast.info(`Delete invoice ${invoice.invoice_number}`);
  };
  
  const handleDownloadInvoice = (invoice) => {
    // Generate and download PDF
    toast.info(`Downloading invoice ${invoice.invoice_number}`);
  };

  // Event handlers for expense actions
  const handleViewExpense = (expense) => {
    // Navigate to expense detail page
    toast.info(`Viewing expense: ${expense.description}`);
  };
  
  const handleEditExpense = (expense) => {
    // Navigate to expense edit page
    toast.info(`Editing expense: ${expense.description}`);
  };
  
  const handleDeleteExpense = (expense) => {
    // Show confirmation dialog and delete if confirmed
    toast.info(`Delete expense: ${expense.description}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="mt-3 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]">
              <CreditCard className="mr-2 h-4 w-4" />
              New Invoice
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Income" 
            value={`$${stats.totalIncome.toFixed(2)}`} 
            icon={DollarSign}
            iconBgColor="bg-[#22C55E]"
            trend={stats.incomeTrend > 0 ? "up" : stats.incomeTrend < 0 ? "down" : null}
            trendValue={`${Math.abs(stats.incomeTrend || 0).toFixed(1)}%`}
            trendLabel="vs last month"
          />
          <StatCard 
            title="Total Expenses" 
            value={`$${stats.totalExpenses.toFixed(2)}`} 
            icon={CreditCard}
            iconBgColor="bg-[#EF4444]"
            trend={stats.expenseTrend > 0 ? "up" : stats.expenseTrend < 0 ? "down" : null}
            trendValue={`${Math.abs(stats.expenseTrend || 0).toFixed(1)}%`}
            trendLabel="vs last month"
          />
          <StatCard 
            title="Balance" 
            value={`$${stats.balance.toFixed(2)}`} 
            icon={TrendingUp}
            iconBgColor="bg-[#F97316]"
            trend={stats.balanceTrend > 0 ? "up" : stats.balanceTrend < 0 ? "down" : null}
            trendValue={`${Math.abs(stats.balanceTrend || 0).toFixed(1)}%`}
            trendLabel="vs last month"
          />
        </div>
        
        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvoicesTable 
            invoices={recentInvoices}
            loading={loading}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onDownloadInvoice={handleDownloadInvoice}
          />
          <ExpensesTable 
            expenses={recentExpenses}
            loading={loading}
            onViewExpense={handleViewExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
