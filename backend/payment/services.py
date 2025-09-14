import importlib
import logging
from django.conf import settings
from .models import PaymentGatewayConfig, InvoicePayment
from .gateways.base import PaymentGatewayBase

logger = logging.getLogger(__name__)

class PaymentService:
    """
    Centralized service for handling payment operations.
    This service dynamically loads payment gateways and routes requests to the appropriate gateway.
    """
    
    # Dictionary to cache gateway class instances
    _gateway_classes = {}
    
    @classmethod
    def get_available_gateways(cls):
        """
        Get a list of all available payment gateway plugins.
        
        Returns:
            list: List of dictionaries containing gateway information
        """
        gateways = []
        
        # Default gateways that are always available
        default_gateways = [
            {
                'name': 'stripe',
                'display_name': 'Stripe',
                'module_path': 'payment.gateways.stripe_gateway',
                'class_name': 'StripeGateway',
                'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg'
            },
            # Add more default gateways here as they are implemented
        ]
        
        # Add gateways from settings if configured
        custom_gateways = getattr(settings, 'PAYMENT_GATEWAYS', [])
        
        # Combine and deduplicate gateways
        all_gateways = default_gateways + custom_gateways
        seen_names = set()
        
        for gateway in all_gateways:
            if gateway['name'] not in seen_names:
                seen_names.add(gateway['name'])
                
                # Try to load the gateway class to verify it exists
                try:
                    cls._load_gateway_class(gateway['module_path'], gateway['class_name'])
                    gateways.append(gateway)
                except (ImportError, AttributeError) as e:
                    logger.warning(f"Failed to load gateway {gateway['name']}: {str(e)}")
        
        
        return gateways
    
    @classmethod
    def get_user_gateways(cls, user):
        """
        Get all payment gateways configured for a user.
        
        Args:
            user: User instance
            
        Returns:
            list: List of PaymentGatewayConfig instances
        """
        return PaymentGatewayConfig.objects.filter(user=user, is_active=True)
    
    @classmethod
    def get_default_gateway(cls, user):
        """
        Get the default payment gateway for a user.
        
        Args:
            user: User instance
            
        Returns:
            PaymentGatewayConfig: Default gateway config or None
        """
        try:
            return PaymentGatewayConfig.objects.get(user=user, is_default=True, is_active=True)
        except PaymentGatewayConfig.DoesNotExist:
            # If no default is set, return the first active gateway
            gateways = cls.get_user_gateways(user)
            return gateways.first() if gateways.exists() else None
    
    @classmethod
    def _load_gateway_class(cls, module_path, class_name):
        """
        Dynamically load a gateway class from its module path.
        
        Args:
            module_path: Import path to the module
            class_name: Name of the gateway class
            
        Returns:
            class: The gateway class
        """
        cache_key = f"{module_path}.{class_name}"
        
        if cache_key not in cls._gateway_classes:
            try:
                module = importlib.import_module(module_path)
                gateway_class = getattr(module, class_name)
                
                # Verify it's a subclass of PaymentGatewayBase
                if not issubclass(gateway_class, PaymentGatewayBase):
                    raise TypeError(f"{class_name} is not a subclass of PaymentGatewayBase")
                
                cls._gateway_classes[cache_key] = gateway_class
            except (ImportError, AttributeError) as e:
                logger.error(f"Failed to load gateway class {class_name}: {str(e)}")
                raise
        
        return cls._gateway_classes[cache_key]
    
    @classmethod
    def get_gateway_instance(cls, config=None, gateway_name=None):
        """
        Get an instance of a payment gateway.
        
        Args:
            config: PaymentGatewayConfig instance or None
            gateway_name: Name of the gateway if config is not provided
            
        Returns:
            PaymentGatewayBase: Instance of the gateway
        """
        if config is None and gateway_name is None:
            raise ValueError("Either config or gateway_name must be provided")
        
        if config is not None:
            gateway_name = config.gateway_name
        
        # Find gateway info
        available_gateways = cls.get_available_gateways()
        gateway_info = next((g for g in available_gateways if g['name'] == gateway_name), None)
        
        if gateway_info is None:
            raise ValueError(f"Gateway {gateway_name} is not available")
        
        # Load gateway class
        gateway_class = cls._load_gateway_class(gateway_info['module_path'], gateway_info['class_name'])
        
        # Create instance
        return gateway_class(config)
    
    @classmethod
    def create_payment_session(cls, invoice, success_url, cancel_url, currency=None, gateway_config=None):
        """
        Create a payment session for an invoice.
        
        Args:
            invoice: Invoice instance
            success_url: URL to redirect after successful payment
            cancel_url: URL to redirect after cancelled payment
            currency: Optional currency code (e.g., 'usd', 'pkr')
            gateway_config: Optional specific gateway config to use
            
        Returns:
            dict: Payment session details
        """
        # Get gateway config to use
        if gateway_config is None:
            # Try to get the default gateway for the invoice owner
            gateway_config = cls.get_default_gateway(invoice.user)
            
            if gateway_config is None:
                # If no gateway config is provided and no default is found, check if there's any active gateway
                gateway_configs = PaymentGatewayConfig.objects.filter(user=invoice.user, is_active=True)
                if gateway_configs.exists():
                    gateway_config = gateway_configs.first()
                else:
                    return {
                        'error': 'No payment gateway configured',
                        'status': 'failed'
                    }
        
        # Get gateway instance
        try:
            gateway = cls.get_gateway_instance(config=gateway_config)
        except Exception as e:
            logger.error(f"Failed to initialize gateway: {str(e)}")
            return {
                'error': f"Failed to initialize payment gateway: {str(e)}",
                'status': 'failed'
            }
        
        # Create payment session
        try:
            # Use the provided currency or get from user's profile if available
            if currency is None and hasattr(invoice.user, 'profile') and hasattr(invoice.user.profile, 'currency'):
                currency = invoice.user.profile.currency
            
            # Default to USD if no currency is specified
            if currency is None:
                currency = 'usd'
                
            # Convert to lowercase for consistency
            currency = currency.lower()
            
            # Create payment session with currency
            result = gateway.create_payment_session(invoice, success_url, cancel_url, currency=currency)
            return result
        except Exception as e:
            logger.error(f"Failed to create payment session: {str(e)}")
            return {
                'error': f"Failed to create payment session: {str(e)}",
                'status': 'failed'
            }
    
    @classmethod
    def handle_webhook(cls, request, gateway_name):
        """
        Handle webhook from a payment gateway.
        
        Args:
            request: Django request object
            gateway_name: Name of the gateway
            
        Returns:
            tuple: (success: bool, message: str, payment: InvoicePayment or None)
        """
        try:
            # Get gateway instance
            gateway = cls.get_gateway_instance(gateway_name=gateway_name)
            
            # Handle webhook
            return gateway.handle_webhook(request)
        except Exception as e:
            logger.error(f"Failed to handle webhook: {str(e)}")
            return False, f"Failed to handle webhook: {str(e)}", None
    
    @classmethod
    def get_payment_status(cls, payment_id):
        """
        Get the current status of a payment.
        
        Args:
            payment_id: ID of the payment
            
        Returns:
            str: Status of the payment
        """
        try:
            payment = InvoicePayment.objects.get(id=payment_id)
            
            # Get gateway instance
            gateway = cls.get_gateway_instance(gateway_name=payment.gateway_name)
            
            # Get payment status
            return gateway.get_payment_status(payment_id)
        except InvoicePayment.DoesNotExist:
            return 'not_found'
        except Exception as e:
            logger.error(f"Failed to get payment status: {str(e)}")
            return 'error'
    
    @classmethod
    def refund_payment(cls, payment_id):
        """
        Refund a payment.
        
        Args:
            payment_id: ID of the payment to refund
            
        Returns:
            tuple: (success: bool, message: str, refund_id: str or None)
        """
        try:
            payment = InvoicePayment.objects.get(id=payment_id)
            
            # Check if payment is completed
            if payment.status != 'completed':
                return False, f"Cannot refund payment with status {payment.status}", None
            
            # Get gateway instance
            gateway = cls.get_gateway_instance(gateway_name=payment.gateway_name)
            
            # Refund payment
            return gateway.refund_payment(payment)
        except InvoicePayment.DoesNotExist:
            return False, "Payment not found", None
        except Exception as e:
            logger.error(f"Failed to refund payment: {str(e)}")
            return False, f"Failed to refund payment: {str(e)}", None
