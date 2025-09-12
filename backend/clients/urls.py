from django.urls import path
from .views import ClientView


urlpatterns = [
    # Client list and create
    path('', ClientView.as_view(), name='client-list-create'),
    # Client detail, update, delete
    path('<uuid:client_id>/', ClientView.as_view(), name='client-detail'),
]
