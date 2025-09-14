from abc import ABC, abstractmethod
from ..models import InvoicePayment, PaymentGatewayConfig


class PaymentGatewayBase(ABC):
    """
    Abstract base class for payment gateway implementations.
    All payment gateway plugins must inherit from this class and implement its methods.
    """
    
    def __init__(self, config: PaymentGatewayConfig = None):
        """
        Initialize the payment gateway with optional configuration.
        
        Args:
            config: PaymentGatewayConfig instance containing gateway credentials
        """
        self.config = config
        self.gateway_name = self.__class__.__name__.replace('Gateway', '').lower()
    
    @abstractmethod
    def create_payment_session(self, invoice, success_url, cancel_url, currency=None):
        """
        Create a payment session for the invoice.
        
        Args:
            invoice: Invoice instance to create payment for
            success_url: URL to redirect after successful payment
            cancel_url: URL to redirect after cancelled payment
            currency: Optional currency code (e.g., 'usd', 'pkr')
            
        Returns:
            dict: Dictionary containing session details including:
                - session_id: ID of the created payment session
                - checkout_url: URL to redirect the client for payment
                - payment_id: ID of the created payment record
                - currency: Currency used for the payment
        """
        pass
    
    @abstractmethod
    def handle_webhook(self, request):
        """
        Process webhook events from the payment gateway.
        
        Args:
            request: Django request object containing webhook data
            
        Returns:
            tuple: (success: bool, message: str, payment: InvoicePayment or None)
        """
        pass
    
    @abstractmethod
    def get_payment_status(self, payment_id):
        """
        Get the current status of a payment.
        
        Args:
            payment_id: ID of the payment to check
            
        Returns:
            str: Status of the payment (pending, completed, failed, etc.)
        """
        pass
    
    @abstractmethod
    def refund_payment(self, payment):
        """
        Refund a payment.
        
        Args:
            payment: InvoicePayment instance to refund
            
        Returns:
            tuple: (success: bool, message: str, refund_id: str or None)
        """
        pass
    
    @classmethod
    def get_required_credentials(cls):
        """
        Get the list of required credentials for this gateway.
        
        Returns:
            list: List of credential keys required for this gateway
        """
        return []
    
    @classmethod
    def get_gateway_display_name(cls):
        """
        Get the display name for this gateway.
        
        Returns:
            str: Display name for the gateway
        """
        return cls.__name__.replace('Gateway', '')
