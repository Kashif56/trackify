from django.contrib import admin
from django.utils.html import format_html
from .models import PaymentGatewayConfig, InvoicePayment, PaymentWebhookEvent


@admin.register(PaymentGatewayConfig)
class PaymentGatewayConfigAdmin(admin.ModelAdmin):
    list_display = ('user', 'gateway_name', 'is_active', 'is_default', 'created_at')
    list_filter = ('gateway_name', 'is_active', 'is_default')
    search_fields = ('user__username', 'user__email', 'gateway_name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        ('Gateway Information', {
            'fields': ('id', 'user', 'gateway_name', 'is_active', 'is_default')
        }),
        ('Credentials', {
            'fields': ('credentials',),
            'classes': ('collapse',),
            'description': 'Sensitive gateway credentials (encrypted)'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(InvoicePayment)
class InvoicePaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'gateway_name', 'amount', 'currency', 'status_badge', 'payment_date')
    list_filter = ('status', 'gateway_name', 'currency', 'payment_date')
    search_fields = ('invoice__invoice_number', 'gateway_payment_id', 'gateway_session_id')
    readonly_fields = ('id', 'created_at', 'updated_at', 'payment_date')
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('id', 'invoice', 'gateway', 'gateway_name', 'amount', 'currency', 'status')
        }),
        ('Gateway Details', {
            'fields': ('gateway_payment_id', 'gateway_session_id', 'payment_method')
        }),
        ('Additional Information', {
            'fields': ('metadata', 'error_message'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('payment_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def invoice_number(self, obj):
        return obj.invoice.invoice_number
    invoice_number.short_description = 'Invoice Number'
    
    def status_badge(self, obj):
        status_colors = {
            'pending': 'orange',
            'processing': 'blue',
            'completed': 'green',
            'failed': 'red',
            'refunded': 'purple',
        }
        color = status_colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 10px;">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'


@admin.register(PaymentWebhookEvent)
class PaymentWebhookEventAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'gateway_name', 'event_id', 'is_processed', 'created_at', 'processed_at')
    list_filter = ('gateway_name', 'event_type', 'is_processed')
    search_fields = ('event_id', 'event_type')
    readonly_fields = ('id', 'created_at', 'processed_at')
    
    fieldsets = (
        ('Event Information', {
            'fields': ('id', 'gateway_name', 'event_type', 'event_id', 'is_processed')
        }),
        ('Related Payment', {
            'fields': ('payment',)
        }),
        ('Payload', {
            'fields': ('payload',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'processed_at'),
            'classes': ('collapse',)
        }),
    )
