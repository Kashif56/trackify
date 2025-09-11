from django.db import models
from django.conf import settings
from clients.models import Client
import uuid


class Invoice(models.Model):
    """Invoice model for storing invoice information"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
        ('overdue', 'Overdue'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50)
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unpaid')
    notes = models.TextField(blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.client.name}"
    
    class Meta:
        ordering = ['-created_at']


class InvoiceItem(models.Model):
    """Model for individual items in an invoice"""
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.description} - {self.invoice.invoice_number}"
    
    def save(self, *args, **kwargs):
        # Calculate amount
        self.amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        
        # Update invoice totals
        invoice = self.invoice
        items = invoice.items.all()
        invoice.subtotal = sum(item.amount for item in items)
        invoice.tax_amount = invoice.subtotal * (invoice.tax_rate / 100)
        invoice.total = invoice.subtotal + invoice.tax_amount
        invoice.save()
