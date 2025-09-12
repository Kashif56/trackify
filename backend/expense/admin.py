from django.contrib import admin
from .models import Expense, ExpenseCategory

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'category', 'date', 'user')
    list_filter = ('date', 'category')
    search_fields = ('description', 'notes')
    date_hierarchy = 'date'
