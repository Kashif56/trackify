from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from subscription.models import Plan, Subscription


class User(AbstractUser):
    """Custom user model for Trackify"""
    company_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(null=True, blank=True, max_length=100)
    state = models.CharField(null=True, blank=True, max_length=100)
    country = models.CharField(null=True, blank=True, max_length=100)
    zip_code = models.CharField(null=True, blank=True, max_length=20)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    def is_user_valid_for_trial(self):
        subscription = Subscription.objects.filter(user=self, plan__name='Trial').exists()

        if subscription:
            return False
        else:
            return True
        

