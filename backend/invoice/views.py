from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from datetime import datetime
from django.utils import timezone

from .models import Invoice
from .serializers import InvoiceSerializer, InvoiceDetailSerializer


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for list views"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class InvoiceView(APIView):
    """Class-based view for invoice management
    
    Supports:
    - GET: List all invoices or get a specific invoice
    - POST: Create a new invoice
    - PUT/PATCH: Update an existing invoice
    - DELETE: Remove an invoice
    """
    permission_classes = [IsAuthenticated]  # This will be overridden for specific methods
    pagination_class = StandardResultsSetPagination
    
    def get_paginated_response(self, queryset, serializer_class):
        """Helper method to paginate queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(page, many=True, context={'request': self.request})
        return paginator.get_paginated_response(serializer.data)
    
    def get_permissions(self):
        """Override permissions based on action"""
        if self.request.method == 'GET' and self.kwargs.get('invoice_id'):
            # Allow public access for getting a specific invoice by ID
            return []
        # Default to requiring authentication for all other actions
        return [IsAuthenticated()]
            
    def get(self, request, invoice_id=None):
        """Get a list of invoices or a specific invoice with optional date range filtering"""
        if invoice_id:
            # Get specific invoice with detailed information
            try:
                # Remove user filter to allow public access to any invoice by ID
                invoice = get_object_or_404(Invoice, id=invoice_id)
                serializer = InvoiceDetailSerializer(invoice)
                return Response(serializer.data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        else:
            # List all invoices with pagination (only for authenticated users)
            if not request.user.is_authenticated:
                return Response({'error': 'Authentication required to list invoices'}, 
                               status=status.HTTP_401_UNAUTHORIZED)
            
            # Get date range parameters from query params
            start_date = request.query_params.get('start_date', None)
            end_date = request.query_params.get('end_date', None)
            range_type = request.query_params.get('range_type', None)
            
            # Base queryset filtered by user
            queryset = Invoice.objects.filter(user=request.user)
            
            # Apply date range filtering if provided
            if start_date and end_date:
                try:
                    # Convert string dates to datetime objects
                    start_date = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
                    # Set end_date to end of the day
                    end_date = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
                    end_date = end_date.replace(hour=23, minute=59, second=59)
                    
                    # Filter by date range
                    queryset = queryset.filter(created_at__gte=start_date, created_at__lte=end_date)
                except ValueError:
                    # If date parsing fails, ignore date filtering
                    pass
            # Apply status filter if provided
            status_filter = request.query_params.get('status', None)
            if status_filter and status_filter != 'all':
                queryset = queryset.filter(status=status_filter)
                
            # Apply search filter if provided
            search_term = request.query_params.get('search', None)
            if search_term:
                queryset = queryset.filter(
                    invoice_number__icontains=search_term
                ) | queryset.filter(
                    client__name__icontains=search_term
                )
                
            # Return paginated response
            return self.get_paginated_response(queryset, InvoiceSerializer)
    
    def post(self, request):
        """Create a new invoice with items"""
        serializer = InvoiceDetailSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, invoice_id):
        """Update an existing invoice"""
        try:
            invoice = get_object_or_404(Invoice, id=invoice_id, user=request.user)
            serializer = InvoiceDetailSerializer(invoice, data=request.data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, invoice_id):
        """Partially update an existing invoice"""
        try:
            invoice = get_object_or_404(Invoice, id=invoice_id, user=request.user)
            serializer = InvoiceDetailSerializer(invoice, data=request.data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, invoice_id):
        """Delete an invoice"""
        try:
            invoice = get_object_or_404(Invoice, id=invoice_id, user=request.user)
            invoice_number = invoice.invoice_number
            invoice.delete()
            return Response({'message': f'Invoice #{invoice_number} deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


# InvoiceItemView removed - items are now managed through the InvoiceView
# using nested serializers
