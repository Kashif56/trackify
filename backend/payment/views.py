from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination

from invoice.models import Invoice
from .models import PaymentGatewayConfig, InvoicePayment
from .serializers import (
    PaymentGatewayConfigSerializer,
    InvoicePaymentSerializer,
    PaymentSessionSerializer,
    PaymentWebhookEventSerializer
)
from .services import PaymentService


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for list views"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class PaymentGatewayConfigView(APIView):
    """
    API view for managing payment gateway configurations
    
    Supports:
    - GET: List all payment gateways or get a specific gateway
    - POST: Create a new payment gateway configuration
    - PUT: Update an existing payment gateway configuration
    - DELETE: Remove a payment gateway configuration
    """
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_paginated_response(self, queryset, serializer_class):
        """Helper method to paginate queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(page, many=True, context={'request': self.request})
        return paginator.get_paginated_response(serializer.data)
    
    def get(self, request, gateway_id=None):
        """Get a list of payment gateways or a specific gateway"""
        if gateway_id:
            # Get specific gateway
            gateway = get_object_or_404(PaymentGatewayConfig, id=gateway_id, user=request.user)
            serializer = PaymentGatewayConfigSerializer(gateway, context={'request': request})
            return Response(serializer.data)
        else:
            # List all gateways with pagination
            queryset = PaymentGatewayConfig.objects.filter(user=request.user)
            return self.get_paginated_response(queryset, PaymentGatewayConfigSerializer)
    
    def post(self, request):
        """Create a new payment gateway configuration"""
        serializer = PaymentGatewayConfigSerializer(data=request.data, context={'request': request})

        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, gateway_id):
        """Update an existing payment gateway configuration"""
        gateway = get_object_or_404(PaymentGatewayConfig, id=gateway_id, user=request.user)
        serializer = PaymentGatewayConfigSerializer(gateway, data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, gateway_id):
        """Delete a payment gateway configuration"""
        gateway = get_object_or_404(PaymentGatewayConfig, id=gateway_id, user=request.user)
        gateway.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AvailableGatewaysView(APIView):
    """
    API view for listing available payment gateways
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get a list of all available payment gateways"""
        gateways = PaymentService.get_available_gateways()
        return Response(gateways)


class PaymentSessionView(APIView):
    """
    API view for creating payment sessions
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Create a new payment session"""
        serializer = PaymentSessionSerializer(data=request.data)

        
        if serializer.is_valid():
            invoice_id = serializer.validated_data['invoice_id']
            success_url = serializer.validated_data['success_url']
            cancel_url = serializer.validated_data['cancel_url']
            gateway_id = serializer.validated_data.get('gateway_id')
            currency = request.user.profile.currency if request.user.profile else serializer.validated_data.get('currency')
            
            # Get invoice
            invoice = get_object_or_404(Invoice, id=invoice_id)
            
        
            # Get gateway config if provided
            gateway_config = None
            if gateway_id:
                gateway_config = get_object_or_404(
                    PaymentGatewayConfig, id=gateway_id, is_active=True
                )
            
            # Create payment session with currency
            result = PaymentService.create_payment_session(
                invoice, success_url, cancel_url, currency, gateway_config
            )
            
            if 'error' in result:

                return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
            

            return Response(result)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentStatusView(APIView):
    """
    API view for checking and updating payment status
    """
    permission_classes = [AllowAny]
    
    def get(self, request, payment_id):
        """Get the status of a payment"""
        payment = get_object_or_404(InvoicePayment, id=payment_id)
        
      
        
        # Get payment status
        status_result = PaymentService.get_payment_status(payment_id)
        
        return Response({'status': status_result})
    
    def patch(self, request, payment_id):
        """Update the status of a payment"""
        payment = get_object_or_404(InvoicePayment, id=payment_id)
        
     
        
        # Get data from request
        new_status = request.data.get('status')
        gateway_payment_id = request.data.get('gateway_payment_id')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update payment
        payment.status = new_status
        if gateway_payment_id:
            payment.gateway_payment_id = gateway_payment_id
        payment.save()
        
        return Response({
            'id': str(payment.id),
            'status': payment.status,
            'gateway_payment_id': payment.gateway_payment_id
        })


class PaymentCaptureView(APIView):
    """
    API view for capturing payments (for PayPal and similar gateways)
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, payment_id):
        """Capture a payment"""
        payment = get_object_or_404(InvoicePayment, id=payment_id)
        
        # Check if user owns the invoice
        if payment.invoice.user != request.user:
            return Response(
                {'error': 'You do not have permission to capture this payment'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get order ID from request
        order_id = request.data.get('order_id')
        
        if not order_id:
            return Response(
                {'error': 'Order ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get gateway instance
        gateway = PaymentService.get_gateway_instance(gateway_name=payment.gateway_name)
        
        # Capture payment
        try:
            # This would be implemented in the specific gateway class
            # For now, just update the payment status
            payment.status = 'completed'
            payment.gateway_payment_id = order_id
            payment.save()
            
            return Response({
                'id': str(payment.id),
                'status': payment.status,
                'gateway_payment_id': payment.gateway_payment_id
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class PaymentRefundView(APIView):
    """
    API view for refunding payments
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, payment_id):
        """Refund a payment"""
        payment = get_object_or_404(InvoicePayment, id=payment_id)
        
        # Check if user owns the invoice
        if payment.invoice.user != request.user:
            return Response(
                {'error': 'You do not have permission to refund this payment'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Refund payment
        success, message, refund_id = PaymentService.refund_payment(payment_id)
        
        if success:
            return Response({'message': message, 'refund_id': refund_id})
        else:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)


class InvoicePaymentsView(APIView):
    """
    API view for listing payments for an invoice
    """
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_paginated_response(self, queryset, serializer_class):
        """Helper method to paginate queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(page, many=True, context={'request': self.request})
        return paginator.get_paginated_response(serializer.data)
    
    def get(self, request, invoice_id):
        """Get a list of payments for an invoice"""
        invoice = get_object_or_404(Invoice, id=invoice_id)
        
        # Check if user owns the invoice
        if invoice.user != request.user:
            return Response(
                {'error': 'You do not have permission to view payments for this invoice'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get payments
        payments = InvoicePayment.objects.filter(invoice=invoice).order_by('-created_at')
        
        return self.get_paginated_response(payments, InvoicePaymentSerializer)


@method_decorator(csrf_exempt, name='dispatch')
class WebhookView(APIView):
    """
    API view for handling payment gateway webhooks
    """
    permission_classes = [AllowAny]  # Webhooks don't have authentication
    
    def post(self, request, gateway_name):
        """Handle webhook from a payment gateway"""
        # Process webhook
        success, message, payment = PaymentService.handle_webhook(request, gateway_name)
        
        if success:
            return HttpResponse(status=200)
        else:
            return HttpResponse(message, status=400)


class PaymentGatewayView(APIView):
    """
    API view for getting payment gateway information for an invoice
    """
    permission_classes = [AllowAny]
    
    def get(self, request, invoice_id):
        """Get payment gateway information for an invoice"""
        invoice = get_object_or_404(Invoice, id=invoice_id)
        
        # Get the default payment gateway for the invoice user
        gateway_config = PaymentGatewayConfig.objects.filter(
            user=invoice.user, is_active=True, is_default=True
        ).first()
        
        if not gateway_config:
            # Try to get any active gateway if no default is set
            gateway_config = PaymentGatewayConfig.objects.filter(
                user=invoice.user, is_active=True
            ).first()
        
        if not gateway_config:
            return Response(
                {'error': 'No payment gateway configured for this invoice'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Return gateway information with public credentials only
        public_credentials = {}
        if gateway_config.gateway_name == 'stripe' and 'publishable_key' in gateway_config.credentials:
            public_credentials['publishable_key'] = gateway_config.credentials['publishable_key']
        elif gateway_config.gateway_name == 'paypal' and 'client_id' in gateway_config.credentials:
            public_credentials['client_id'] = gateway_config.credentials['client_id']
        
        return Response({
            'gateway_name': gateway_config.gateway_name,
            'gateway_display_name': gateway_config.get_gateway_name_display(),
            **public_credentials
        })


class CheckInvoiceGatewayView(APIView):
    """
    API view for checking if an invoice has a payment gateway configured
    """
    permission_classes = [AllowAny]
    
    def get(self, request, invoice_id):
        """Check if an invoice has a payment gateway configured"""
        invoice = get_object_or_404(Invoice, id=invoice_id)
        
        # Check if the invoice user has any active payment gateway
        has_gateway = PaymentGatewayConfig.objects.filter(
            user=invoice.user, is_active=True
        ).exists()
        
        return Response({
            'invoice_id': str(invoice.id),
            'has_gateway': has_gateway
        })


class PublicPaymentView(APIView):
    """
    API view for public access to payment information
    """
    permission_classes = [AllowAny]
    
    def get(self, request, invoice_id):
        """Get public payment information for an invoice"""
        invoice = get_object_or_404(Invoice, id=invoice_id)
        
        # Get the latest payment
        latest_payment = InvoicePayment.objects.filter(invoice=invoice).order_by('-created_at').first()
        
        if latest_payment:
            # Return limited payment information
            return Response({
                'invoice_id': str(invoice.id),
                'invoice_number': invoice.invoice_number,
                'status': latest_payment.status,
                'amount': str(latest_payment.amount),
                'currency': latest_payment.currency,
                'payment_date': latest_payment.payment_date
            })
        else:
            # No payment found
            return Response({
                'invoice_id': str(invoice.id),
                'invoice_number': invoice.invoice_number,
                'status': 'no_payment',
                'amount': str(invoice.total),
                'currency': 'USD'  # Default currency
            })


class AllPaymentsView(APIView):
    """
    API view for listing all payments with pagination
    """
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_paginated_response(self, queryset, serializer_class):
        """Helper method to paginate queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(page, many=True, context={'request': self.request})
        return paginator.get_paginated_response(serializer.data)
    
    def get(self, request):
        """Get a list of all payments"""
        # Get all payments for the current user's invoices
        payments = InvoicePayment.objects.filter(
            invoice__user=request.user
        ).select_related('invoice', 'invoice__client').order_by('-created_at')
        
        return self.get_paginated_response(payments, InvoicePaymentSerializer)
