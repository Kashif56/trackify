from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from invoice.models import Invoice
import uuid
import json
from django.core.serializers.json import DjangoJSONEncoder

User = get_user_model()


class PaymentGatewayConfig(models.Model):
    """Model to store payment gateway configurations for users"""
    GATEWAY_CHOICES = (
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('razorpay', 'Razorpay'),
        # Add more gateways as needed
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_gateways')
    gateway_name = models.CharField(max_length=50, choices=GATEWAY_CHOICES)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    # Store encrypted credentials as JSON
    credentials = models.JSONField(default=dict, help_text='Encrypted gateway credentials')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'gateway_name')
        verbose_name = 'Payment Gateway Configuration'
        verbose_name_plural = 'Payment Gateway Configurations'
    
    def __str__(self):
        return f"{self.user.username}'s {self.get_gateway_name_display()} configuration"
    
    def save(self, *args, **kwargs):
        # If this is set as default, unset default for other gateways for this user
        if self.is_default:
            PaymentGatewayConfig.objects.filter(
                user=self.user, 
                is_default=True
            ).exclude(id=self.id).update(is_default=False)
        
        # If this is the only gateway for the user, make it default
        if not PaymentGatewayConfig.objects.filter(user=self.user).exists():
            self.is_default = True
            
        super().save(*args, **kwargs)


class InvoicePayment(models.Model):
    """Model to track payments for invoices"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    gateway = models.ForeignKey(PaymentGatewayConfig, on_delete=models.SET_NULL, null=True, related_name='payments')
    gateway_name = models.CharField(max_length=50, choices=PaymentGatewayConfig.GATEWAY_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    gateway_payment_id = models.CharField(max_length=255, blank=True, null=True, help_text='Payment ID from gateway')
    gateway_session_id = models.CharField(max_length=255, blank=True, null=True, help_text='Session ID from gateway')
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    metadata = models.JSONField(default=dict, encoder=DjangoJSONEncoder, help_text='Additional payment metadata')
    error_message = models.TextField(blank=True, null=True)
    
    payment_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment for Invoice #{self.invoice.invoice_number}"
    
    def save(self, *args, **kwargs):
        # If payment is completed, update invoice status and set payment date
        if self.status == 'completed' and not self.payment_date:
            self.payment_date = timezone.now()
            # Update invoice status
            self.invoice.status = 'paid'
            self.invoice.save()
        
        super().save(*args, **kwargs)


class PaymentWebhookEvent(models.Model):
    """Model to store webhook events from payment gateways"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gateway_name = models.CharField(max_length=50, choices=PaymentGatewayConfig.GATEWAY_CHOICES)
    event_type = models.CharField(max_length=100)
    event_id = models.CharField(max_length=255, unique=True)
    payload = models.JSONField(default=dict)
    is_processed = models.BooleanField(default=False)
    payment = models.ForeignKey(InvoicePayment, on_delete=models.SET_NULL, null=True, blank=True, related_name='webhook_events')
    
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.gateway_name} webhook: {self.event_type}"
    
    def mark_as_processed(self):
        self.is_processed = True
        self.processed_at = timezone.now()
        self.save()
