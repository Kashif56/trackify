from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Client(models.Model):
    """Client model for storing client information"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clients')
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True,null=True)
    phone_number = models.CharField(max_length=20, blank=True,null=True)

    address = models.TextField(blank=True,null=True)
    city = models.CharField(max_length=100, blank=True,null=True)
    state = models.CharField(max_length=100, blank=True,null=True)
    zip_code = models.CharField(max_length=20, blank=True,null=True)
    country = models.CharField(max_length=100, blank=True,null=True)

    company_name = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']
