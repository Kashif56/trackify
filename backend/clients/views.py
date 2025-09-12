from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Client
from .serializers import ClientSerializer, ClientDetailSerializer


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for list views"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ClientView(APIView):
    """Class-based view for client management
    
    Supports:
    - GET: List all clients or get a specific client
    - POST: Create a new client
    - PUT/PATCH: Update an existing client
    - DELETE: Remove a client
    """
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_paginated_response(self, queryset, serializer_class):
        """Helper method to paginate queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(page, many=True, context={'request': self.request})
        return paginator.get_paginated_response(serializer.data)
    
    def get(self, request, client_id=None):
        """Get a list of clients or a specific client"""
        if client_id:
            # Get specific client
            try:
                client = get_object_or_404(Client, id=client_id, user=request.user)
                serializer = ClientDetailSerializer(client)
                return Response(serializer.data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        else:
            # List all clients with pagination
            queryset = Client.objects.filter(user=request.user)
            return self.get_paginated_response(queryset, ClientSerializer)
    
    def post(self, request):
        """Create a new client"""
        serializer = ClientSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, client_id):
        """Update an existing client"""
        try:
            client = get_object_or_404(Client, id=client_id, user=request.user)
            serializer = ClientSerializer(client, data=request.data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, client_id):
        """Partially update an existing client"""
        try:
            client = get_object_or_404(Client, id=client_id, user=request.user)
            serializer = ClientSerializer(client, data=request.data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, client_id):
        """Delete a client"""
        try:
            client = get_object_or_404(Client, id=client_id, user=request.user)
            client_name = client.name
            client.delete()
            return Response({'message': f'Client "{client_name}" deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
