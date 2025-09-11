from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()

class Plan(models.Model):
    """Model for subscription plans"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    PLAN_CHOICES = (
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('business', 'Business'),
        ('trial', 'Trial')
    )

    BILLING_CYCLE_CHOICES = [
        ('14_days', '14 Days'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('lifetime', 'Lifetime'),
    ]
    
    name = models.CharField(max_length=50, choices=PLAN_CHOICES, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES)
    

    # Features and capabilities
    invoices_limit = models.IntegerField(default=3) 
    email_notifications = models.BooleanField(default=False)
    payment_collection = models.BooleanField(default=False)
    analytics = models.BooleanField(default=False)
    
    

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def plan_duration(self):
        if self.billing_cycle == '14_days':
            return 14
        elif self.billing_cycle == 'monthly':
            return 30
        elif self.billing_cycle == 'yearly':
            return 365
        elif self.billing_cycle == 'lifetime':
            return 365 * 100
    


class Subscription(models.Model):
    """Model for user subscriptions"""
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('canceled', 'Canceled'),
        ('expired', 'Expired'),
        ('trial', 'Trial'),
        ('overdue', 'Overdue'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # Null for lifetime or auto-renewing subscriptions
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"



class UsageTracker(models.Model):
    """Model for tracking usage metrics for a user's subscription."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='usage_metrics')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usage_metrics')
    date = models.DateField(default=timezone.now)
    metrics = models.JSONField(default=dict)  # Stores invoice_count, expense_count, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'date')
    
    def __str__(self):
        return f"Usage for {self.user.email} on {self.date}"
    
    @classmethod
    def increment_metric(cls, user, metric_name, increment_by=1):
        """Increment a specific usage metric for the user on the current date."""
        today = timezone.now().date()
        
        # Get active subscription
        try:
            subscription = Subscription.objects.get(user=user, status='active')
        except Subscription.DoesNotExist:
            return None
            
        usage, created = cls.objects.get_or_create(
            user=user,
            subscription=subscription,
            date=today,
            defaults={'metrics': {}}
        )
        
        metrics = usage.metrics
        current_value = metrics.get(metric_name, 0)
        metrics[metric_name] = current_value + increment_by
        usage.metrics = metrics
        usage.save()
        
        return usage
    
    @classmethod
    def increment_invoices(cls, user, increment_by=1):
        """Increment invoice count for the user."""
        return cls.increment_metric(user, 'invoice_count', increment_by)
    
    # Only tracking invoices as per requirements
    
    @classmethod
    def get_usage_summary(cls, user, start_date=None, end_date=None):
        """Get a summary of usage metrics for a user within a date range.
        
        Args:
            user: The User instance
            start_date: Start date for the summary (defaults to start of current month)
            end_date: End date for the summary (defaults to today)
            
        Returns:
            Dictionary with total usage metrics and daily breakdown
        """
        # Get active subscription
        try:
            active_subscription = Subscription.objects.get(user=user, status='active')
        except Subscription.DoesNotExist:
            return None
            
        if start_date is None:
            # Default to start of current month or subscription start date
            start_date = active_subscription.start_date if active_subscription else timezone.now().date().replace(day=1)
        
        if end_date is None:
            end_date = active_subscription.end_date if active_subscription and active_subscription.end_date else timezone.now().date()
        
        # Get all usage records in the date range
        usage_records = cls.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        # Initialize summary with zero counts
        from invoice.models import Invoice
        
        invoice_count = Invoice.objects.filter(user=user).count()
        
        summary = {
            'total': {
                'invoice_count': invoice_count
            },
            'daily': []
        }
        
        # Calculate totals and prepare daily breakdown
        for record in usage_records:
            # Add daily record
            daily_entry = {
                'date': record.date,
                'metrics': record.metrics
            }
            summary['daily'].append(daily_entry)
        
        # Get subscription limits for comparison
        if active_subscription:
            plan = active_subscription.plan
            summary['limits'] = {
                'invoice_count': plan.invoices_limit,
                'email_notifications': plan.email_notifications,
                'payment_collection': plan.payment_collection,
                'analytics': plan.analytics
            }
            
            # Calculate usage percentages for numeric limits
            summary['usage_percentage'] = {}
            if plan.invoices_limit > 0:  # Avoid division by zero
                usage = summary['total'].get('invoice_count', 0)
                summary['usage_percentage']['invoice_count'] = min(100, round((usage / plan.invoices_limit) * 100))
            else:
                summary['usage_percentage']['invoice_count'] = 0
        
        return summary






class BillingHistory(models.Model):
    """Model for subscription payments"""
    PAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField()
    transaction_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.subscription.user.email} - {self.amount}"
