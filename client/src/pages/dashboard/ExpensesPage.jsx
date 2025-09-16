import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Filter, Tag, DollarSign, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import expenseApi from '../../api/expenseApi';
import DateRangeSelector from '../../components/DateRange/DateRangeSelector';

// Layout and Components
import DashboardLayout from '../../layout/DashboardLayout';
import ExpensesTable from '../../components/Dashboard/ExpensesTable';
import StatCard from '../../components/Dashboard/StatCard';
import AddExpenseModal from '../../components/Dashboard/Modals/AddExpenseModal';
import EditExpenseModal from '../../components/Dashboard/Modals/EditExpenseModal';
import DeleteExpenseModal from '../../components/Dashboard/Modals/DeleteExpenseModal';
import AddCategoryModal from '../../components/Dashboard/Modals/AddCategoryModal';
import EditCategoryModal from '../../components/Dashboard/Modals/EditCategoryModal';
import DeleteCategoryModal from '../../components/Dashboard/Modals/DeleteCategoryModal';

// Initial empty states for expenses and categories
const initialExpenses = [];
const initialCategories = [];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
    range_type: 'last_30_days'
  });
  
  // Stats calculations
  const totalExpensesAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (expense.category && expense.category.name) {
      const categoryName = expense.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += parseFloat(expense.amount || 0);
    } else {
      if (!acc['Uncategorized']) {
        acc['Uncategorized'] = 0;
      }
      acc['Uncategorized'] += parseFloat(expense.amount || 0);
    }
    return acc;
  }, {});
  
  // Find top 3 expense categories
  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  const dispatch = useDispatch();
  const { user, tokens } = useSelector(state => state.user);

  // Fetch expenses and categories data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Prepare params for API call
        const params = {};
        
        // Add date range parameters if they exist
        if (dateRange.start_date && dateRange.end_date) {
          params.start_date = dateRange.start_date;
          params.end_date = dateRange.end_date;
          params.range_type = dateRange.range_type;
        }
        
        // Add category filter if it exists
        if (filterCategory) {
          params.category = filterCategory;
        }
        
        // Fetch expenses with filters
        const expensesData = await expenseApi.getExpenses(params);
        setExpenses(expensesData.results || expensesData);
        
        // Fetch categories
        const categoriesData = await expenseApi.getCategories();
        // Ensure categories is always an array
        setCategories(Array.isArray(categoriesData.results) ? categoriesData.results : []);
      } catch (error) {
        console.error('Error fetching expenses data:', error);
        toast.error('Failed to load expenses data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [filterCategory, dateRange]);  // Re-fetch when filters or date range change

  // Handle adding a new expense
  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = await expenseApi.createExpense(expenseData);
      setExpenses([newExpense, ...expenses]);
      setShowAddModal(false);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  // Handle editing an expense
  const handleEditExpense = async (expenseData) => {
    try {
      const updatedExpense = await expenseApi.updateExpense(expenseData.id, expenseData);
      const updatedExpenses = expenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      );
      
      setExpenses(updatedExpenses);
      setShowEditModal(false);
      toast.success('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async () => {
    try {
      await expenseApi.deleteExpense(selectedExpense.id);
      const updatedExpenses = expenses.filter(expense => expense.id !== selectedExpense.id);
      
      setExpenses(updatedExpenses);
      setShowDeleteModal(false);
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  // Open edit modal with selected expense
  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  // Open delete modal with selected expense
  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };
  
  // Category modal handlers
  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await expenseApi.createCategory(categoryData);
      setCategories([...categories, newCategory]);
      setShowAddCategoryModal(false);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };
  
  const handleEditCategory = async (categoryData) => {
    try {
      const updatedCategory = await expenseApi.updateCategory(categoryData.id, categoryData);
      const updatedCategories = categories.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      );
      
      setCategories(updatedCategories);
      setShowEditCategoryModal(false);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };
  
  const handleDeleteCategory = async () => {
    try {
      await expenseApi.deleteCategory(selectedCategory.id);
      const updatedCategories = categories.filter(category => category.id !== selectedCategory.id);
      
      setCategories(updatedCategories);
      setShowDeleteCategoryModal(false);
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };
  
  const openEditCategoryModal = (category) => {
    setSelectedCategory(category);
    setShowEditCategoryModal(true);
  };
  
  const openDeleteCategoryModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteCategoryModal(true);
  };
  
  // Handle date range change from DateRangeSelector
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    // The useEffect will automatically trigger a re-fetch
  };

  // Filter expenses by category
  const filteredExpenses = filterCategory 
    ? expenses.filter(expense => expense.category && expense.category.name === filterCategory)
    : expenses;

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${showAddModal || showEditModal || showDeleteModal || showAddCategoryModal || showEditCategoryModal || showDeleteCategoryModal ? 'pointer-events-none' : ''}`}>
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
          <div className="mt-3 sm:mt-0 sm:flex sm:space-x-3">
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
            <div className="relative">
              <select
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary appearance-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Filter className="h-4 w-4" />
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowAddCategoryModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
              >
                <Tag className="mr-2 h-4 w-4" />
                Add Category
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Expenses" 
            value={`${totalExpensesAmount.toFixed(2)}`} 
            icon={<DollarSign className="w-6 h-6 text-red-500" />} 
            subtitle={`${expenses.length} expenses`}
            bgColor="bg-red-50"
            textColor="text-red-800"
          />
          
        </div>
        
        {/* Expenses Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ExpensesTable 
            expenses={filteredExpenses}
            loading={loading}
            onEditExpense={openEditModal}
            onDeleteExpense={openDeleteModal}
            isFullPage={true}
          />
        </div>
      </div>

      {/* Modals */}
      {/* Expense Modals */}
      <AddExpenseModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddExpense}
        categories={categories}
      />
      <EditExpenseModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditExpense}
        expense={selectedExpense}
        categories={categories}
      />
      <DeleteExpenseModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteExpense}
        expense={selectedExpense}
      />
      
      {/* Category Modals */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={handleAddCategory}
      />
      <EditCategoryModal
        isOpen={showEditCategoryModal}
        onClose={() => setShowEditCategoryModal(false)}
        onSave={handleEditCategory}
        category={selectedCategory}
      />
      <DeleteCategoryModal
        isOpen={showDeleteCategoryModal}
        onClose={() => setShowDeleteCategoryModal(false)}
        onConfirm={handleDeleteCategory}
        category={selectedCategory}
      />
    </DashboardLayout>
  );
};

export default ExpensesPage;
