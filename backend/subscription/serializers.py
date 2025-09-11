from rest_framework import serializers
from .models import Plan, Subscription, UsageTracker, BillingHistory


class PlanSerializer(serializers.ModelSerializer):
    """Serializer for subscription plans"""
    
    class Meta:
        model = Plan
        fields = ['id', 'name', 'description', 'price', 'billing_cycle', 
                 'invoices_limit', 'email_notifications', 'payment_collection', 
                 'analytics', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for user subscriptions"""
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='plan.price', max_digits=6, decimal_places=2, read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'plan_name', 'plan_price', 'status', 
                 'start_date', 'end_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed subscription information"""
    plan = PlanSerializer(read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'status', 'start_date', 
                 'end_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BillingHistorySerializer(serializers.ModelSerializer):
    """Serializer for subscription payments"""
    
    class Meta:
        model = BillingHistory
        fields = ['id', 'subscription', 'amount', 'payment_date', 
                 'transaction_id', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class UsageTrackerSerializer(serializers.ModelSerializer):
    """Serializer for usage tracking"""
    
    class Meta:
        model = UsageTracker
        fields = ['id', 'subscription', 'user', 'date', 'metrics', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
