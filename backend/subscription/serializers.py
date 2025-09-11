from rest_framework import serializers
from .models import Plan, Subscription, Payment


class PlanSerializer(serializers.ModelSerializer):
    """Serializer for subscription plans"""
    
    class Meta:
        model = Plan
        fields = ['id', 'name', 'description', 'price', 'max_invoices', 
                 'features', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for user subscriptions"""
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='plan.price', max_digits=6, decimal_places=2, read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'plan_name', 'plan_price', 'status', 
                 'start_date', 'end_date', 'is_auto_renew', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed subscription information"""
    plan = PlanSerializer(read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'status', 'start_date', 
                 'end_date', 'is_auto_renew', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for subscription payments"""
    
    class Meta:
        model = Payment
        fields = ['id', 'subscription', 'amount', 'payment_date', 
                 'payment_method', 'transaction_id', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']
