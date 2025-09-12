from django.contrib import admin
from .models import UserProfile, EmailVerification

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'phone_number', 'country')
    search_fields = ('user__username', 'user__email', 'company_name')
    list_filter = ('country', 'state')

@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'is_expired')
    search_fields = ('user__username', 'user__email')
