
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/subscription/', include('subscription.urls')),
    path('api/invoice/', include('invoice.urls')),
    path('api/expense/', include('expense.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/users/', include('users.urls')),
    path('api/clients/', include('clients.urls')),
]
