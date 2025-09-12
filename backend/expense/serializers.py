from rest_framework import serializers
from .models import Expense, ExpenseCategory


class ExpenseCategorySerializer(serializers.ModelSerializer):
    """Serializer for expense categories"""
    
    class Meta:
        model = ExpenseCategory
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # Associate the category with the current user
        user = self.context['request'].user
        category = ExpenseCategory.objects.create(user=user, **validated_data)
        return category


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializer for the Expense model"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Expense
        fields = ['id', 'category', 'category_name', 'amount', 'date', 
                 'description', 'notes', 'receipt', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Associate the expense with the current user
        user = self.context['request'].user
        expense = Expense.objects.create(user=user, **validated_data)
        return expense


class ExpenseDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed expense information"""
    category = ExpenseCategorySerializer(read_only=True)
    
    class Meta:
        depth = 1
        model = Expense
        fields = ['id', 'category', 'amount', 'date', 'description', 
                 'notes', 'receipt', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
