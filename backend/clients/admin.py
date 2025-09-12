from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company_name', 'user', 'created_at')
    search_fields = ('name', 'email', 'company_name')
    list_filter = ('country', 'created_at')
