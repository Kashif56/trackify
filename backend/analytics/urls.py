from django.urls import path
from .views import (
    IncomeExpensesView, 
    InvoiceStatusBreakdownView, 
    TopExpenseCategoriesView,
    UpcomingPaymentsView,
    GrowthRateView
)


urlpatterns = [
    # Core chart endpoints
    path('income-expenses/', IncomeExpensesView.as_view(), name='income-expenses'),
    path('invoice-status-breakdown/', InvoiceStatusBreakdownView.as_view(), name='invoice-status-breakdown'),
    path('top-expense-categories/', TopExpenseCategoriesView.as_view(), name='top-expense-categories'),
    
    # Actionable insights endpoints
    path('upcoming-payments/', UpcomingPaymentsView.as_view(), name='upcoming-payments'),
    path('growth-rate/', GrowthRateView.as_view(), name='growth-rate'),
]