from rest_framework import serializers
from .models import Invoice, InvoiceItem
from clients.serializers import ClientSerializer


class InvoiceItemSerializer(serializers.ModelSerializer):
    """Serializer for invoice items"""
    
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'amount']
        read_only_fields = ['id', 'amount']


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for the Invoice model"""
    items = InvoiceItemSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'client', 'client_name', 'issue_date', 
                 'due_date', 'status', 'notes', 'subtotal', 'tax_rate', 
                 'tax_amount', 'total', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'subtotal', 'tax_amount', 'total', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Associate the invoice with the current user
        user = self.context['request'].user
        invoice = Invoice.objects.create(user=user, **validated_data)
        return invoice


class InvoiceDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed invoice information"""
    items = InvoiceItemSerializer(many=True)
    client = ClientSerializer(read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'client', 'issue_date', 'due_date', 
                 'status', 'notes', 'subtotal', 'tax_rate', 'tax_amount', 
                 'total', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'subtotal', 'tax_amount', 'total', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        invoice = Invoice.objects.create(user=user, **validated_data)
        
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        
        return invoice
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update invoice fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items if provided
        if items_data is not None:
            # Remove existing items
            instance.items.all().delete()
            
            # Create new items
            for item_data in items_data:
                InvoiceItem.objects.create(invoice=instance, **item_data)
        
        return instance
