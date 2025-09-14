from django.urls import path
from .views import (
    PaymentGatewayConfigView, AvailableGatewaysView,
    PaymentSessionView, PaymentStatusView, PaymentRefundView,
    PaymentCaptureView, InvoicePaymentsView, WebhookView, 
    PublicPaymentView, PaymentGatewayView, CheckInvoiceGatewayView,
    AllPaymentsView
)


urlpatterns = [
    # Payment gateway configuration endpoints
    path('gateways/', PaymentGatewayConfigView.as_view(), name='payment_gateways'),
    path('gateways/<uuid:gateway_id>/', PaymentGatewayConfigView.as_view(), name='payment_gateway_detail'),
    path('available-gateways/', AvailableGatewaysView.as_view(), name='available_gateways'),
    
    # Payment session endpoints
    path('create-session/', PaymentSessionView.as_view(), name='create_payment_session'),
    path('status/<uuid:payment_id>/', PaymentStatusView.as_view(), name='payment_status'),
    path('capture/<uuid:payment_id>/', PaymentCaptureView.as_view(), name='payment_capture'),
    path('refund/<uuid:payment_id>/', PaymentRefundView.as_view(), name='payment_refund'),
    
    # Invoice payments endpoint
    path('invoice/<uuid:invoice_id>/payments/', InvoicePaymentsView.as_view(), name='invoice_payments'),
    path('invoice/<uuid:invoice_id>/gateway/', PaymentGatewayView.as_view(), name='invoice_payment_gateway'),
    path('invoice/<uuid:invoice_id>/gateway-check/', CheckInvoiceGatewayView.as_view(), name='check_invoice_gateway'),
    
    # Public payment endpoint
    path('public/invoice/<uuid:invoice_id>/', PublicPaymentView.as_view(), name='public_payment_info'),
    
    # Webhook endpoints
    path('webhook/<str:gateway_name>/', WebhookView.as_view(), name='payment_webhook'),
    
    # All payments endpoint
    path('all/', AllPaymentsView.as_view(), name='all_payments'),
]