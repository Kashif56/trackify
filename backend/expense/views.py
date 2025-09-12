from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Expense, ExpenseCategory
from .serializers import ExpenseSerializer, ExpenseDetailSerializer, ExpenseCategorySerializer


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for list views"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ExpenseView(APIView):
    """Class-based view for expense management
    
    Supports:
    - GET: List all expenses or get a specific expense
    - POST: Create a new expense
    - PUT/PATCH: Update an existing expense
    - DELETE: Remove an expense
    """
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_paginated_response(self, queryset, serializer_class):
        """Helper method to paginate queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(page, many=True, context={'request': self.request})
        return paginator.get_paginated_response(serializer.data)
    
    def get(self, request, expense_id=None):
        """Get a list of expenses or a specific expense"""
        if expense_id:
            # Get specific expense
            try:
                expense = get_object_or_404(Expense, id=expense_id, user=request.user)
                serializer = ExpenseDetailSerializer(expense)
                return Response(serializer.data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        else:
            # List all expenses with pagination
            queryset = Expense.objects.filter(user=request.user)
            return self.get_paginated_response(queryset, ExpenseSerializer)
    
    def post(self, request):
        """Create a new expense"""
        serializer = ExpenseSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, expense_id):
        """Update an existing expense"""
        try:
            expense = get_object_or_404(Expense, id=expense_id, user=request.user)
            serializer = ExpenseSerializer(expense, data=request.data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, expense_id):
        """Partially update an existing expense"""
        try:
            expense = get_object_or_404(Expense, id=expense_id, user=request.user)
            serializer = ExpenseSerializer(expense, data=request.data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, expense_id):
        """Delete an expense"""
        try:
            expense = get_object_or_404(Expense, id=expense_id, user=request.user)
            expense_description = expense.description
            expense.delete()
            return Response({'message': f'Expense "{expense_description}" deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class ExpenseCategoryView(APIView):
    """Class-based view for expense category management
    
    Supports:
    - GET: List all expense categories or get a specific category
    - POST: Create a new expense category
    - PUT/PATCH: Update an existing expense category
    - DELETE: Remove an expense category
    """
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_paginated_response(self, queryset, serializer_class):
        """Helper method to paginate queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(page, many=True, context={'request': self.request})
        return paginator.get_paginated_response(serializer.data)
    
    def get(self, request, category_id=None):
        """Get a list of expense categories or a specific category"""
        if category_id:
            # Get specific expense category
            try:
                category = get_object_or_404(ExpenseCategory, id=category_id, user=request.user)
                serializer = ExpenseCategorySerializer(category)
                return Response(serializer.data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        else:
            # List all expense categories with pagination
            queryset = ExpenseCategory.objects.filter(user=request.user)
            return self.get_paginated_response(queryset, ExpenseCategorySerializer)
    
    def post(self, request):
        """Create a new expense category"""
        serializer = ExpenseCategorySerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, category_id):
        """Update an existing expense category"""
        try:
            category = get_object_or_404(ExpenseCategory, id=category_id, user=request.user)
            serializer = ExpenseCategorySerializer(category, data=request.data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, category_id):
        """Partially update an existing expense category"""
        try:
            category = get_object_or_404(ExpenseCategory, id=category_id, user=request.user)
            serializer = ExpenseCategorySerializer(category, data=request.data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, category_id):
        """Delete an expense category"""
        try:
            category = get_object_or_404(ExpenseCategory, id=category_id, user=request.user)
            category_name = category.name
            category.delete()
            return Response({'message': f'Expense category "{category_name}" deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
