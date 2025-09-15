from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import BankAccount
from .serializers import BankAccountSerializer


class BankAccountView(views.APIView):
    """API view for all bank account operations (GET, POST, PATCH, DELETE)"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get the user's bank account"""
        try:
            bank_account = BankAccount.objects.get(user=request.user)
            serializer = BankAccountSerializer(bank_account)
            return Response(serializer.data)
        except BankAccount.DoesNotExist:
            return Response({"detail": "Bank account not found"}, status=status.HTTP_204_NO_CONTENT)
    
    def post(self, request):
        """Create a new bank account for the user"""
        # Check if user already has a bank account
        if BankAccount.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "You already have a bank account. Use PATCH to update it."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = BankAccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Update the user's bank account"""
        try:
            bank_account = BankAccount.objects.get(user=request.user)
            serializer = BankAccountSerializer(bank_account, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except BankAccount.DoesNotExist:
            return Response({"detail": "Bank account not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request):
        """Delete the user's bank account"""
        try:
            bank_account = BankAccount.objects.get(user=request.user)
            bank_account.delete()
            return Response({"detail": "Bank account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except BankAccount.DoesNotExist:
            return Response({"detail": "Bank account not found"}, status=status.HTTP_404_NOT_FOUND)
