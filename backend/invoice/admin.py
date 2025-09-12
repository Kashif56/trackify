from django.contrib import admin
from .models import Invoice, InvoiceItem

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'client', 'issue_date', 'due_date', 'status', 'total')
    list_filter = ('status', 'issue_date', 'due_date')
    search_fields = ('invoice_number', 'client__name', 'notes')
    inlines = [InvoiceItemInline]

@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('description', 'invoice', 'quantity', 'unit_price', 'amount')
    search_fields = ('description', 'invoice__invoice_number')
