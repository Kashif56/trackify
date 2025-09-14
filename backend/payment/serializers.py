from rest_framework import serializers
from .models import PaymentGatewayConfig, InvoicePayment, PaymentWebhookEvent
from .services import PaymentService
from invoice.serializers import InvoiceSerializer


class PaymentGatewayConfigSerializer(serializers.ModelSerializer):
    """Serializer for payment gateway configurations"""
    gateway_display_name = serializers.SerializerMethodField()
    required_credentials = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentGatewayConfig
        fields = [
            'id', 'user', 'gateway_name', 'gateway_display_name', 
            'is_active', 'is_default', 'credentials', 
            'required_credentials', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'gateway_display_name', 'required_credentials']
    
    def get_gateway_display_name(self, obj):
        """Get the display name for the gateway"""
        try:
            gateway = PaymentService.get_gateway_instance(gateway_name=obj.gateway_name)
            return gateway.get_gateway_display_name()
        except Exception:
            return obj.get_gateway_name_display()
    
    def get_required_credentials(self, obj):
        """Get the required credentials for the gateway"""
        try:
            gateway = PaymentService.get_gateway_instance(gateway_name=obj.gateway_name)
            return gateway.get_required_credentials()
        except Exception:
            return []
    
    def create(self, validated_data):
        """Create a new payment gateway configuration"""
        # Associate with the current user
        user = self.context['request'].user

        payment_gateway_config = PaymentGatewayConfig.objects.create(user=user, **validated_data)
        
        return payment_gateway_config


class InvoicePaymentSerializer(serializers.ModelSerializer):
    """Serializer for invoice payments"""
    invoice_details = InvoiceSerializer(source='invoice', read_only=True)
    client_name = serializers.SerializerMethodField()
    invoice_number = serializers.SerializerMethodField()
    
    class Meta:
        model = InvoicePayment
        fields = [
            'id', 'invoice', 'invoice_details', 'invoice_number', 'client_name',
            'gateway', 'gateway_name', 'amount', 'currency', 'status', 
            'gateway_payment_id', 'gateway_session_id', 'payment_method', 'metadata',
            'error_message', 'payment_date', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'gateway_payment_id', 'gateway_session_id',
            'payment_method', 'metadata', 'error_message',
            'payment_date', 'created_at', 'updated_at'
        ]
    
    def get_client_name(self, obj):
        """Get the client name from the invoice"""
        if obj.invoice and hasattr(obj.invoice, 'client') and obj.invoice.client:
            return obj.invoice.client.name
        return 'Unknown Client'
    
    def get_invoice_number(self, obj):
        """Get the invoice number"""
        if obj.invoice:
            return obj.invoice.invoice_number
        return 'N/A'


class PaymentSessionSerializer(serializers.Serializer):
    """Serializer for creating payment sessions"""
    invoice_id = serializers.UUIDField(required=False)
    success_url = serializers.URLField(required=True)
    cancel_url = serializers.URLField(required=True)
    gateway_id = serializers.UUIDField(required=False)
    currency = serializers.CharField(required=False, max_length=3)


class PaymentWebhookEventSerializer(serializers.ModelSerializer):
    """Serializer for payment webhook events"""
    
    class Meta:
        model = PaymentWebhookEvent
        fields = [
            'id', 'gateway_name', 'event_type', 'event_id',
            'is_processed', 'payment', 'created_at', 'processed_at'
        ]
        read_only_fields = fields
