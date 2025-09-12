from django.db.models import Sum, Count, F, Q
from django.db.models.functions import TruncMonth, TruncYear, TruncDay, TruncWeek
from django.db.models.functions import ExtractMonth, ExtractYear, ExtractWeek
from django.utils import timezone
from datetime import datetime, timedelta
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from invoice.models import Invoice
from expense.models import Expense, ExpenseCategory


# Utility functions for analytics
def get_date_range(range_type=None, custom_start=None, custom_end=None):
    """Determine date range and grouping based on range type or custom dates"""
    end_date = timezone.now().date()
    group_by = 'month'  # Default grouping
    
    if custom_start and custom_end:
        # Custom date range
        try:
            start_date = datetime.strptime(custom_start, '%Y-%m-%d').date()
            end_date = datetime.strptime(custom_end, '%Y-%m-%d').date()
            
            # Determine appropriate grouping based on date range
            date_diff = (end_date - start_date).days
            
            if date_diff <= 60:  # Less than 2 months
                group_by = 'day'
            elif date_diff <= 180:  # Less than 6 months
                group_by = 'week'
            elif date_diff <= 365:  # Less than 1 year
                group_by = 'month'
            else:  # More than 1 year
                group_by = 'year'
                
        except ValueError:
            return None, None, None, "Invalid date format. Use YYYY-MM-DD."
    else:
        # Predefined ranges
        if range_type == 'daily':
            start_date = end_date - timedelta(days=30)  # Last 30 days
            group_by = 'day'
        elif range_type == 'weekly':
            start_date = end_date - timedelta(weeks=12)  # Last 12 weeks
            group_by = 'week'
        elif range_type == 'monthly':
            start_date = end_date - timedelta(days=180)  # Last 6 months
            group_by = 'month'
        elif range_type == '6months':
            start_date = end_date - timedelta(days=180)  # Last 6 months
            group_by = 'month'
        elif range_type == 'yearly':
            start_date = end_date - timedelta(days=365)  # Last year
            group_by = 'year'
        else:
            return None, None, None, "Invalid range type"
    
    return start_date, end_date, group_by, None


def get_filtered_data(user, start_date, end_date):
    """Get filtered invoice and expense data for the given date range"""
    invoices = Invoice.objects.filter(
        user=user,
        issue_date__gte=start_date,
        issue_date__lte=end_date
    )
    
    expenses = Expense.objects.filter(
        user=user,
        date__gte=start_date,
        date__lte=end_date
    )
    
    return invoices, expenses


def group_by_day(invoices, expenses):
    """Group financial data by day"""
    invoice_data = (
        invoices
        .values('issue_date')
        .annotate(total=Sum('total'))
        .order_by('issue_date')
    )
    
    expense_data = (
        expenses
        .values('date')
        .annotate(total=Sum('amount'))
        .order_by('date')
    )
    
    return invoice_data, expense_data


def group_by_week(invoices, expenses):
    """Group financial data by week"""
    invoice_data = (
        invoices
        .annotate(
            year=ExtractYear('issue_date'),
            week=ExtractWeek('issue_date')
        )
        .values('year', 'week')
        .annotate(total=Sum('total'))
        .order_by('year', 'week')
    )
    
    expense_data = (
        expenses
        .annotate(
            year=ExtractYear('date'),
            week=ExtractWeek('date')
        )
        .values('year', 'week')
        .annotate(total=Sum('amount'))
        .order_by('year', 'week')
    )
    
    return invoice_data, expense_data


def group_by_month(invoices, expenses):
    """Group financial data by month"""
    invoice_data = (
        invoices
        .annotate(month=TruncMonth('issue_date'))
        .values('month')
        .annotate(total=Sum('total'))
        .order_by('month')
    )
    
    expense_data = (
        expenses
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )
    
    return invoice_data, expense_data


def group_by_year(invoices, expenses):
    """Group financial data by year"""
    invoice_data = (
        invoices
        .annotate(year=TruncYear('issue_date'))
        .values('year')
        .annotate(total=Sum('total'))
        .order_by('year')
    )
    
    expense_data = (
        expenses
        .annotate(year=TruncYear('date'))
        .values('year')
        .annotate(total=Sum('amount'))
        .order_by('year')
    )
    
    return invoice_data, expense_data


def format_daily_data(start_date, end_date, invoice_data, expense_data):
    """Format data for daily view"""
    # Generate date range
    date_range = []
    current_date = start_date
    while current_date <= end_date:
        date_range.append(current_date)
        current_date = current_date + timedelta(days=1)
    
    # Format results
    result = []
    for date in date_range:
        date_str = date.strftime('%Y-%m-%d')
        
        # Find income for this day
        income = next((item['total'] for item in invoice_data if item['issue_date'] == date), 0)
        
        # Find expenses for this day
        expense = next((item['total'] for item in expense_data if item['date'] == date), 0)
        
        result.append({
            'date': date_str,
            'label': date.strftime('%d %b'),
            'income': float(income) if income else 0,
            'expenses': float(expense) if expense else 0,
            'net': float(income - expense) if income and expense else float(income or 0) - float(expense or 0)
        })
    
    return result


def format_weekly_data(start_date, end_date, invoice_data, expense_data):
    """Format data for weekly view"""
    # Generate week range
    date_range = pd.date_range(start=start_date, end=end_date, freq='W-MON')
    
    # Format results
    result = []
    for date in date_range:
        date_obj = date.date()
        year = date_obj.year
        week = date_obj.isocalendar()[1]
        
        # Find income for this week
        income = next((item['total'] for item in invoice_data if item['year'] == year and item['week'] == week), 0)
        
        # Find expenses for this week
        expense = next((item['total'] for item in expense_data if item['year'] == year and item['week'] == week), 0)
        
        # Calculate week end date (Sunday)
        week_end = date_obj + timedelta(days=6)
        
        result.append({
            'date': date_obj.strftime('%Y-%m-%d'),
            'label': f"Week {week} ({date_obj.strftime('%d %b')} - {week_end.strftime('%d %b')})",
            'income': float(income) if income else 0,
            'expenses': float(expense) if expense else 0,
            'net': float(income - expense) if income and expense else float(income or 0) - float(expense or 0)
        })
    
    return result


def format_monthly_data(start_date, end_date, invoice_data, expense_data):
    """Format data for monthly view"""
    # Generate month range
    months_range = []
    current_date = start_date.replace(day=1)
    while current_date <= end_date:
        months_range.append(current_date)
        # Move to next month
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)
    
    # Format results
    result = []
    for month_date in months_range:
        month_str = month_date.strftime('%Y-%m')
        month_name = month_date.strftime('%b %Y')
        
        # Find income for this month
        income = next((item['total'] for item in invoice_data if item['month'].strftime('%Y-%m') == month_str), 0)
        
        # Find expenses for this month
        expense = next((item['total'] for item in expense_data if item['month'].strftime('%Y-%m') == month_str), 0)
        
        result.append({
            'date': month_date.strftime('%Y-%m-%d'),
            'label': month_name,
            'income': float(income) if income else 0,
            'expenses': float(expense) if expense else 0,
            'net': float(income - expense) if income and expense else float(income or 0) - float(expense or 0)
        })
    
    return result


def format_yearly_data(start_date, end_date, invoice_data, expense_data):
    """Format data for yearly view"""
    # Generate year range
    start_year = start_date.year
    end_year = end_date.year
    years_range = []
    
    for year in range(start_year, end_year + 1):
        years_range.append(datetime(year, 1, 1).date())
    
    # Format results
    result = []
    for year_date in years_range:
        year_str = year_date.strftime('%Y')
        
        # Find income for this year
        income = next((item['total'] for item in invoice_data if item['year'].strftime('%Y') == year_str), 0)
        
        # Find expenses for this year
        expense = next((item['total'] for item in expense_data if item['year'].strftime('%Y') == year_str), 0)
        
        result.append({
            'date': f"{year_str}-01-01",
            'label': year_str,
            'income': float(income) if income else 0,
            'expenses': float(expense) if expense else 0,
            'net': float(income - expense) if income and expense else float(income or 0) - float(expense or 0)
        })
    
    return result


def get_upcoming_payments(user, days=30):
    """Get upcoming payments due within specified days"""
    today = timezone.now().date()
    end_date = today + timedelta(days=days)
    
    # Get unpaid invoices due within the specified period
    upcoming_invoices = Invoice.objects.filter(
        user=user,
        status='unpaid',  # Only unpaid invoices
        due_date__gte=today,  # Due date is today or later
        due_date__lte=end_date  # Due date is within the specified period
    ).order_by('due_date')  # Order by due date (ascending)
    
    return upcoming_invoices


def calculate_growth_rate(user, months=1):
    """Calculate month-over-month growth rate for revenue"""
    today = timezone.now().date()
    
    # Calculate current month start and end
    current_month_start = today.replace(day=1)
    if today.month == 12:
        next_month = today.replace(year=today.year + 1, month=1, day=1)
    else:
        next_month = today.replace(month=today.month + 1, day=1)
    current_month_end = next_month - timedelta(days=1)
    
    # Calculate previous month start and end
    if current_month_start.month == 1:
        previous_month_start = current_month_start.replace(year=current_month_start.year - 1, month=12)
    else:
        previous_month_start = current_month_start.replace(month=current_month_start.month - 1)
    previous_month_end = current_month_start - timedelta(days=1)
    
    # Get total revenue for current month (paid invoices only)
    current_month_revenue = Invoice.objects.filter(
        user=user,
        status='paid',
        issue_date__gte=current_month_start,
        issue_date__lte=current_month_end
    ).aggregate(total=Sum('total'))['total'] or 0
    
    # Get total revenue for previous month (paid invoices only)
    previous_month_revenue = Invoice.objects.filter(
        user=user,
        status='paid',
        issue_date__gte=previous_month_start,
        issue_date__lte=previous_month_end
    ).aggregate(total=Sum('total'))['total'] or 0
    
    # Calculate growth rate
    if previous_month_revenue > 0:
        growth_rate = ((current_month_revenue - previous_month_revenue) / previous_month_revenue) * 100
    else:
        # If previous month revenue is 0, growth rate is technically infinite
        # But we'll return 100% if there's any revenue this month, or 0% if there's none
        growth_rate = 100 if current_month_revenue > 0 else 0
    
    return {
        'current_month_revenue': float(current_month_revenue),
        'previous_month_revenue': float(previous_month_revenue),
        'growth_rate': round(growth_rate, 2),  # Round to 2 decimal places
        'is_positive': growth_rate >= 0,
        'current_month': current_month_start.strftime('%B %Y'),
        'previous_month': previous_month_start.strftime('%B %Y')
    }


class BaseAnalyticsView(APIView):
    """Base class for analytics views"""
    permission_classes = [IsAuthenticated]
    
    def get_date_filtered_data(self, request, start_date=None, end_date=None):
        """Get data filtered by date range and user"""
        if not start_date:
            # Default to last 6 months if no date range specified
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=180)
            
        return get_filtered_data(request.user, start_date, end_date)


class IncomeExpensesView(BaseAnalyticsView):
    """API endpoint for Income vs. Expenses chart with flexible date ranges"""
    
    def get(self, request, format=None):
        # Get query parameters
        range_type = request.query_params.get('range')
        custom_start = request.query_params.get('start_date', None)
        custom_end = request.query_params.get('end_date', None)
        
        # Get date range and grouping type
        start_date, end_date, group_by, error = get_date_range(range_type, custom_start, custom_end)
        if error:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get filtered data
        invoices, expenses = get_filtered_data(request.user, start_date, end_date)
        
        # Group data based on grouping type
        if group_by == 'day':
            invoice_data, expense_data = group_by_day(invoices, expenses)
            result = format_daily_data(start_date, end_date, invoice_data, expense_data)
        elif group_by == 'week':
            invoice_data, expense_data = group_by_week(invoices, expenses)
            result = format_weekly_data(start_date, end_date, invoice_data, expense_data)
        elif group_by == 'month':
            invoice_data, expense_data = group_by_month(invoices, expenses)
            result = format_monthly_data(start_date, end_date, invoice_data, expense_data)
        elif group_by == 'year':
            invoice_data, expense_data = group_by_year(invoices, expenses)
            result = format_yearly_data(start_date, end_date, invoice_data, expense_data)
        
        return Response({
            'range_type': range_type if range_type else group_by,
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d'),
            'data': result
        })





class InvoiceStatusBreakdownView(BaseAnalyticsView):
    """API endpoint for Invoice Status Breakdown chart"""
    
    def get(self, request, format=None):
        # Get query parameters for optional date filtering
        custom_start = request.query_params.get('start_date', None)
        custom_end = request.query_params.get('end_date', None)
        
        # Get date range if specified
        if custom_start and custom_end:
            try:
                start_date = datetime.strptime(custom_start, '%Y-%m-%d').date()
                end_date = datetime.strptime(custom_end, '%Y-%m-%d').date()
                invoices, _ = self.get_date_filtered_data(request, start_date, end_date)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Get all invoices for the user
            invoices = Invoice.objects.filter(user=request.user)
        
        # Count invoices by status
        status_counts = invoices.values('status').annotate(count=Count('id'), total=Sum('total'))
        
        # Prepare response data
        result = []
        for status_data in status_counts:
            result.append({
                'status': status_data['status'],
                'count': status_data['count'],
                'total': float(status_data['total']) if status_data['total'] else 0
            })
        
        return Response(result)


class TopExpenseCategoriesView(BaseAnalyticsView):
    """API endpoint for Top 5 Expense Categories chart"""
    
    def get(self, request, format=None):
        # Get query parameters
        limit = int(request.query_params.get('limit', 5))  # Default to top 5
        custom_start = request.query_params.get('start_date', None)
        custom_end = request.query_params.get('end_date', None)
        
        # Get date range if specified
        if custom_start and custom_end:
            try:
                start_date = datetime.strptime(custom_start, '%Y-%m-%d').date()
                end_date = datetime.strptime(custom_end, '%Y-%m-%d').date()
                _, expenses = self.get_date_filtered_data(request, start_date, end_date)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Get all expenses for the user
            expenses = Expense.objects.filter(user=request.user)
        
        # Get user's expense categories
        categories = ExpenseCategory.objects.filter(user=request.user)
        
        # Calculate total for each category within the date range
        category_totals = []
        for category in categories:
            total = expenses.filter(category=category).aggregate(total=Sum('amount'))['total'] or 0
            
            if total > 0:  # Only include categories with expenses
                category_totals.append({
                    'category': category.name,
                    'total': float(total)
                })
        
        # Sort by total (descending) and limit
        category_totals.sort(key=lambda x: x['total'], reverse=True)
        top_categories = category_totals[:limit]
        
        # Calculate "Others" category if there are more than the limit
        if len(category_totals) > limit:
            others_total = sum(item['total'] for item in category_totals[limit:])
            top_categories.append({
                'category': 'Others',
                'total': float(others_total)
            })
        
        return Response(top_categories)


class UpcomingPaymentsView(BaseAnalyticsView):
    """API endpoint for Upcoming Payments Due"""
    
    def get(self, request, format=None):
        # Get query parameters
        days = int(request.query_params.get('days', 30))  # Default to next 30 days
        
        # Get upcoming payments
        upcoming_invoices = get_upcoming_payments(request.user, days)
        
        # Format response data
        from clients.serializers import ClientSerializer
        
        result = []
        for invoice in upcoming_invoices:
            # Get client details
            client_data = ClientSerializer(invoice.client).data
            
            # Calculate days until due
            today = timezone.now().date()
            days_until_due = (invoice.due_date - today).days
            
            result.append({
                'invoice_id': str(invoice.id),
                'invoice_number': invoice.invoice_number,
                'client_id': str(invoice.client.id),
                'client_name': client_data['name'],
                'amount': float(invoice.total),
                'due_date': invoice.due_date.strftime('%Y-%m-%d'),
                'days_until_due': days_until_due,
                'status': invoice.status
            })
        
        return Response(result)


class GrowthRateView(BaseAnalyticsView):
    """API endpoint for Month-over-Month Growth Rate"""
    
    def get(self, request, format=None):
        # Calculate growth rate
        growth_data = calculate_growth_rate(request.user)
        
        return Response(growth_data)
