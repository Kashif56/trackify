
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/subscription/', include('subscription.urls')),
    path('api/invoice/', include('invoice.urls')),
    path('api/expense/', include('expense.urls')),
    path('api/analytic/', include('analytics.urls')),
    path('api/users/', include('users.urls')),
    path('api/client/', include('clients.urls')),
]
