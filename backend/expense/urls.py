from django.urls import path
from .views import ExpenseView, ExpenseCategoryView


urlpatterns = [
    # Expense list and create
    path('', ExpenseView.as_view(), name='expense-list-create'),
    # Expense detail, update, delete
    path('<uuid:expense_id>/', ExpenseView.as_view(), name='expense-detail'),
    
    # Expense category list and create
    path('categories/', ExpenseCategoryView.as_view(), name='expense-category-list-create'),
    # Expense category detail, update, delete
    path('categories/<int:category_id>/', ExpenseCategoryView.as_view(), name='expense-category-detail'),
]