from django.urls import path
from .views import InvoiceView


urlpatterns = [
    # Invoice list and create
    path('', InvoiceView.as_view(), name='invoice-list-create'),
    # Invoice detail, update, delete
    path('<uuid:invoice_id>/', InvoiceView.as_view(), name='invoice-detail'),
]