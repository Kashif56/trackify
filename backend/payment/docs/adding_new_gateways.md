# Adding New Payment Gateways to Trackify

This guide explains how to extend Trackify's payment system by adding new payment gateway integrations.

## Architecture Overview

Trackify uses a plugin-like architecture for payment gateways, allowing for easy addition of new gateways without modifying existing code. The system consists of:

1. **PaymentGatewayBase** - An abstract base class that defines the interface for all payment gateways
2. **Gateway Implementations** - Concrete implementations of the base class for specific payment providers
3. **PaymentService** - A centralized service that dynamically loads and routes requests to the appropriate gateway
4. **Configuration System** - Settings and database models for storing gateway configurations

## Step-by-Step Guide to Adding a New Gateway

### 1. Create a New Gateway Module

Create a new Python file in the `payment/gateways/` directory, e.g., `your_gateway.py`:

```python
import logging
from .base import PaymentGatewayBase
from ..models import InvoicePayment, PaymentWebhookEvent

logger = logging.getLogger(__name__)

class YourGateway(PaymentGatewayBase):
    """
    Your Gateway payment implementation.
    """
    
    def __init__(self, config=None):
        super().__init__(config)
        self.gateway_name = 'your_gateway'  # Must match the name in settings
        
        # Initialize your gateway's SDK/API client
        if config and config.credentials:
            # Use credentials from config
            api_key = config.credentials.get('api_key')
            # Initialize your gateway's client with the API key
        else:
            # Use default test credentials
            pass
    
    def create_payment_session(self, invoice, success_url, cancel_url):
        """
        Create a payment session for the invoice.
        """
        try:
            # Implement your gateway's payment session creation logic
            
            # Create payment record in database
            payment = InvoicePayment.objects.create(
                invoice=invoice,
                gateway=self.config,
                gateway_name=self.gateway_name,
                amount=invoice.total,
                currency='usd',  # Adjust as needed
                status='pending',
                gateway_session_id='session_id_from_gateway',
                metadata={
                    'checkout_url': 'url_to_checkout_page',
                    # Add any other metadata needed
                }
            )
            
            return {
                'session_id': 'session_id_from_gateway',
                'checkout_url': 'url_to_checkout_page',
                'payment_id': str(payment.id)
            }
            
        except Exception as e:
            logger.error(f"Payment error: {str(e)}")
            # Create failed payment record
            payment = InvoicePayment.objects.create(
                invoice=invoice,
                gateway=self.config,
                gateway_name=self.gateway_name,
                amount=invoice.total,
                currency='usd',
                status='failed',
                error_message=str(e)
            )
            
            return {
                'error': str(e),
                'payment_id': str(payment.id)
            }
    
    def handle_webhook(self, request):
        """
        Process webhook events from the payment gateway.
        """
        try:
            # Implement webhook handling logic
            # 1. Parse webhook payload
            # 2. Verify webhook authenticity
            # 3. Store webhook event
            # 4. Update payment status if needed
            
            # Example implementation:
            payload = request.body
            event_id = 'event_id_from_gateway'
            
            # Store webhook event
            webhook_event = PaymentWebhookEvent.objects.create(
                gateway_name=self.gateway_name,
                event_type='payment_success',  # Adjust based on actual event
                event_id=event_id,
                payload=payload
            )
            
            # Find and update payment
            payment = InvoicePayment.objects.get(gateway_payment_id='payment_id_from_gateway')
            payment.status = 'completed'
            payment.save()
            
            # Link webhook event to payment
            webhook_event.payment = payment
            webhook_event.mark_as_processed()
            
            return True, "Payment processed successfully", payment
            
        except Exception as e:
            logger.error(f"Error processing webhook: {str(e)}")
            return False, f"Error processing webhook: {str(e)}", None
    
    def get_payment_status(self, payment_id):
        """
        Get the current status of a payment.
        """
        try:
            payment = InvoicePayment.objects.get(id=payment_id)
            
            # Implement status check logic with your gateway's API
            
            return payment.status
            
        except Exception as e:
            logger.error(f"Error checking payment status: {str(e)}")
            return 'error'
    
    def refund_payment(self, payment):
        """
        Refund a payment.
        """
        try:
            # Implement refund logic with your gateway's API
            
            # Update payment status
            payment.status = 'refunded'
            payment.save()
            
            return True, "Payment refunded successfully", "refund_id_from_gateway"
            
        except Exception as e:
            logger.error(f"Refund error: {str(e)}")
            return False, f"Refund failed: {str(e)}", None
    
    @classmethod
    def get_required_credentials(cls):
        """
        Get the list of required credentials for this gateway.
        """
        return ['api_key', 'merchant_id', 'webhook_secret']  # Adjust as needed
    
    @classmethod
    def get_gateway_display_name(cls):
        """
        Get the display name for this gateway.
        """
        return 'Your Gateway'  # Human-readable name
```

### 2. Register the Gateway in Settings

Add your gateway to the `PAYMENT_GATEWAYS` list in `settings.py`:

```python
PAYMENT_GATEWAYS = [
    {
        'name': 'stripe',
        'display_name': 'Stripe',
        'module_path': 'payment.gateways.stripe_gateway',
        'class_name': 'StripeGateway'
    },
    {
        'name': 'your_gateway',
        'display_name': 'Your Gateway',
        'module_path': 'payment.gateways.your_gateway',
        'class_name': 'YourGateway'
    },
    # Add more gateways here
]
```

### 3. Add Gateway-Specific Settings

If your gateway requires specific settings, add them to `settings.py`:

```python
# Your Gateway Settings
YOUR_GATEWAY_API_KEY = os.getenv('YOUR_GATEWAY_API_KEY', 'your_test_api_key')
YOUR_GATEWAY_MERCHANT_ID = os.getenv('YOUR_GATEWAY_MERCHANT_ID', 'your_test_merchant_id')
YOUR_GATEWAY_WEBHOOK_SECRET = os.getenv('YOUR_GATEWAY_WEBHOOK_SECRET', 'your_test_webhook_secret')
```

### 4. Test Your Gateway Implementation

Create unit tests for your gateway implementation in `payment/tests/test_your_gateway.py`:

```python
from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from payment.gateways.your_gateway import YourGateway
from payment.models import PaymentGatewayConfig, InvoicePayment
from invoice.models import Invoice
from clients.models import Client

User = get_user_model()

class YourGatewayTestCase(TestCase):
    def setUp(self):
        # Create test user, client, invoice, and gateway config
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.client_obj = Client.objects.create(user=self.user, name='Test Client', email='client@example.com')
        self.invoice = Invoice.objects.create(
            user=self.user,
            client=self.client_obj,
            due_date='2025-10-01',
            subtotal=100.00,
            tax_rate=10.00,
            tax_amount=10.00,
            total=110.00
        )
        self.gateway_config = PaymentGatewayConfig.objects.create(
            user=self.user,
            gateway_name='your_gateway',
            credentials={
                'api_key': 'test_api_key',
                'merchant_id': 'test_merchant_id',
                'webhook_secret': 'test_webhook_secret'
            }
        )
        self.gateway = YourGateway(self.gateway_config)
        self.factory = RequestFactory()
    
    def test_create_payment_session(self):
        # Test creating a payment session
        success_url = 'https://example.com/success'
        cancel_url = 'https://example.com/cancel'
        
        result = self.gateway.create_payment_session(self.invoice, success_url, cancel_url)
        
        self.assertIn('session_id', result)
        self.assertIn('checkout_url', result)
        self.assertIn('payment_id', result)
        
        # Check that a payment record was created
        payment_id = result['payment_id']
        payment = InvoicePayment.objects.get(id=payment_id)
        self.assertEqual(payment.invoice, self.invoice)
        self.assertEqual(payment.gateway_name, 'your_gateway')
        self.assertEqual(payment.status, 'pending')
    
    # Add more tests for other methods
```

### 5. Update Frontend (Optional)

If your gateway requires specific frontend handling, update the frontend code as needed.

## Best Practices

1. **Error Handling**: Always handle exceptions and provide meaningful error messages.
2. **Logging**: Use the logger to log important events and errors.
3. **Security**: Never store sensitive credentials in code. Use environment variables or encrypted storage.
4. **Testing**: Write comprehensive tests for your gateway implementation.
5. **Documentation**: Document your gateway's specific requirements and behavior.

## Gateway Interface Requirements

Your gateway implementation must fulfill the following requirements:

1. **Inherit from PaymentGatewayBase**: Your gateway class must inherit from the base class.
2. **Implement All Required Methods**: All abstract methods must be implemented.
3. **Handle Webhooks**: Implement webhook handling for payment status updates.
4. **Maintain State**: Update payment records in the database as their status changes.
5. **Return Consistent Data**: Follow the return value patterns defined in the base class.

## Troubleshooting

If you encounter issues with your gateway implementation:

1. **Check Logs**: Look for error messages in the application logs.
2. **Verify Credentials**: Ensure that your gateway credentials are correct.
3. **Test Webhooks**: Use tools like ngrok to test webhook handling locally.
4. **Check Database Records**: Verify that payment records are being created and updated correctly.

## Example Implementations

For reference, see the existing gateway implementations:

- `payment/gateways/stripe_gateway.py` - Stripe payment gateway implementation
