
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/subscription/', include('subscription.urls')),
    path('api/invoice/', include('invoice.urls')),
    path('api/expense/', include('expense.urls')),
    path('api/analytic/', include('analytics.urls')),
    path('api/users/', include('users.urls')),
    path('api/client/', include('clients.urls')),
    path('api/payment/', include('payment.urls')),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    