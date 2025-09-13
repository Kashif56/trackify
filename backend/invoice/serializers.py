from rest_framework import serializers
from .models import Invoice, InvoiceItem
from clients.serializers import ClientSerializer
from clients.models import Client


class InvoiceItemSerializer(serializers.ModelSerializer):
    """Serializer for invoice items"""
    
    class Meta:
        depth = 1
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'amount']
        read_only_fields = ['id', 'amount']


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for the Invoice model"""
    items = InvoiceItemSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'client', 'client_name', 'user', 'issue_date', 
                 'due_date', 'status', 'notes', 'payment_terms', 'conditions', 'subtotal', 'tax_rate', 
                 'tax_amount', 'total', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'invoice_number', 'subtotal', 'tax_amount', 'total', 'created_at', 'updated_at']
        depth = 1
        
    def get_user(self, obj):
        profile_picture_url = None
        if hasattr(obj.user, 'profile') and obj.user.profile.profile_picture and hasattr(obj.user.profile.profile_picture, 'url'):
            profile_picture_url = obj.user.profile.profile_picture.url
            
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'username': obj.user.username,
            'first_name': getattr(obj.user, 'first_name', ''),
            'last_name': getattr(obj.user, 'last_name', ''),
            'company_name': getattr(obj.user.profile, 'company_name', '') if hasattr(obj.user, 'profile') else '',
            'address': getattr(obj.user.profile, 'address', '') if hasattr(obj.user, 'profile') else '',
            'profile_picture': profile_picture_url
        }
    
    def create(self, validated_data):
        # Associate the invoice with the current user
        user = self.context['request'].user
        invoice = Invoice.objects.create(user=user, **validated_data)
        return invoice


class InvoiceDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed invoice information"""
    items = InvoiceItemSerializer(many=True)
    client_details = ClientSerializer(source='client', read_only=True)
    user = serializers.SerializerMethodField()
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filter clients to only show those belonging to the current user
        if 'context' in kwargs and 'request' in kwargs['context']:
            user = kwargs['context']['request'].user
            self.fields['client'] = serializers.PrimaryKeyRelatedField(
                queryset=Client.objects.filter(user=user)
            )
    
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.none())
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'client', 'client_details', 'user', 'issue_date', 'due_date', 
                 'status', 'notes', 'payment_terms', 'conditions', 'subtotal', 'tax_rate', 'tax_amount', 
                 'total', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'invoice_number', 'subtotal', 'tax_amount', 'total', 'created_at', 'updated_at']
        depth = 1
        
    def get_user(self, obj):
        profile_picture_url = None
        if obj.user.profile.profile_picture and hasattr(obj.user.profile.profile_picture, 'url'):
            profile_picture_url = obj.user.profile.profile_picture.url
            
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'username': obj.user.username,
            'first_name': getattr(obj.user, 'first_name', ''),
            'last_name': getattr(obj.user, 'last_name', ''),
            'company_name': obj.user.profile.company_name,
            'address': obj.user.profile.address,
            'phone_number': obj.user.profile.phone_number,
            'city': obj.user.profile.city,
            'state': obj.user.profile.state,
            'country': obj.user.profile.country,
            'zip_code': obj.user.profile.zip_code,
            'profile_picture': profile_picture_url,
            'is_email_verified': obj.user.profile.is_email_verified
        }
    
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
