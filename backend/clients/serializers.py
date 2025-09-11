from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    """Serializer for the Client model"""
    
    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone', 'address', 'company_name', 
                 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Associate the client with the current user
        user = self.context['request'].user
        client = Client.objects.create(user=user, **validated_data)
        return client


class ClientDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed client information"""
    
    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone', 'address', 'company_name', 
                 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
