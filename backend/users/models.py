import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from subscription.models import Plan, Subscription
from cloudinary.models import CloudinaryField


CURRENCY_CHOICES = (
    ('pkr', 'PKR'),
    ('usd', 'USD')
)


class UserProfile(models.Model):
    """Profile model for extending the User model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    company_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(null=True, blank=True, max_length=100)
    state = models.CharField(null=True, blank=True, max_length=100)
    country = models.CharField(null=True, blank=True, max_length=100)
    zip_code = models.CharField(null=True, blank=True, max_length=20)
    profile_picture = CloudinaryField('profile_picture', blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)

    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='pkr')
    allow_platform_gateway = models.BooleanField(default=False)


    
    def __str__(self):
        return self.user.email
    
    def is_user_valid_for_trial(self):
        subscription = Subscription.objects.filter(user=self.user, plan__name='Trial').exists()
        return not subscription


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a UserProfile instance when a new User is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the UserProfile instance when the User is saved"""
    instance.profile.save()


class EmailVerification(models.Model):
    """Model for email verification tokens"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='email_verification')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"{self.user.email} - {self.token}"
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Token expires after 24 hours
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at



class BankAccount(models.Model):
    """Model for bank account details"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='bank_account')
    bank_name = models.CharField(max_length=255)
    iban_number = models.CharField(max_length=255)
    ifsc_code = models.CharField(max_length=255, blank=True, null=True)
    account_holder_name = models.CharField(max_length=255, blank=True, null=True)
    swift_code = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.user.email