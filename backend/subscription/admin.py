from django.contrib import admin
from .models import Plan, Subscription, UsageTracker, BillingHistory

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'billing_cycle', 'invoices_limit', 'is_active')
    list_filter = ('is_active', 'billing_cycle')
    search_fields = ('name', 'description')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'plan', 'start_date')
    search_fields = ('user__email', 'user__username')
    date_hierarchy = 'start_date'

@admin.register(UsageTracker)
class UsageTrackerAdmin(admin.ModelAdmin):
    list_display = ('user', 'subscription', 'date')
    list_filter = ('date',)
    search_fields = ('user__email',)
    date_hierarchy = 'date'

@admin.register(BillingHistory)
class BillingHistoryAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'amount', 'payment_date', 'status')
    list_filter = ('status', 'payment_date')
    search_fields = ('subscription__user__email', 'transaction_id')
    date_hierarchy = 'payment_date'
