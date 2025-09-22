import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import dashboardApi from '../../api/dashboardApi';

// Layout and Components
import DashboardLayout from '../../layout/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import ExpensesTable from '../../components/Dashboard/ExpensesTable';
import InvoicesTable from '../../components/Dashboard/InvoicesTable';
import DateRangeSelector from '../../components/DateRange/DateRangeSelector';
import Button from '../../components/ui/Button';

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
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
    range_type: 'last_30_days'
  });

  const navigate = useNavigate();
  
  const { user, tokens } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Fetch dashboard data with date range
  const fetchDashboardData = async (dateRangeParams = null) => {
    setLoading(true);
    try {
      const data = await dashboardApi.getDashboardData(dateRangeParams);
      
      setStats({
        totalIncome: data.stats.total_income,
        totalExpenses: data.stats.total_expenses,
        balance: data.stats.balance,
        incomeTrend: data.stats.income_trend,
        expenseTrend: data.stats.expense_trend,
        balanceTrend: data.stats.balance_trend,
        dateRange: data.stats.date_range || dateRange
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
  };
  
  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    fetchDashboardData(newDateRange);
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Event handlers for invoice actions
  const handleViewInvoice = (invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };
  
  const handleEditInvoice = (invoice) => {
    navigate(`/invoices/${invoice.id}/edit`);
  };
  
  const handleDeleteInvoice = (invoice) => {
    
  };
  
  const handleDownloadInvoice = (invoice) => {
    
  };

  // Event handlers for expense actions
  const handleViewExpense = (expense) => {
    navigate(`/expenses/${expense.id}`);
  };
  
  const handleEditExpense = (expense) => {
    navigate(`/expenses/${expense.id}/edit`);
  };
  
  const handleDeleteExpense = (expense) => {
    
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
           
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Income" 
            value={`${stats.totalIncome.toFixed(2)}`} 
            icon={<DollarSign />}
            subtitle={`${recentInvoices.length} invoices`}
            color="green"
          />
          <StatCard 
            title="Total Expenses" 
            value={`${stats.totalExpenses.toFixed(2)}`} 
            icon={<CreditCard />}
            subtitle={`${recentExpenses.length} expenses`}
            color="red"
          />
          <StatCard 
            title="Balance" 
            value={`${stats.balance.toFixed(2)}`} 
            icon={<TrendingUp />}
            subtitle="Current balance"
            color="primary"
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
            isFullPage={false}
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
