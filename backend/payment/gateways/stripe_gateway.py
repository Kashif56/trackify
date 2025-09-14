import stripe
import json
from django.conf import settings
from .base import PaymentGatewayBase
from ..models import InvoicePayment, PaymentWebhookEvent


class StripeGateway(PaymentGatewayBase):
    """
    Stripe payment gateway implementation.
    """
    
    def __init__(self, config=None, use_platform_gateway=False):
        super().__init__(config)
        self.gateway_name = 'stripe'
        self.use_platform_gateway = use_platform_gateway
        
        # If using platform gateway, use platform credentials
        if use_platform_gateway and settings.PLATFORM_GATEWAY:
            self.api_key = settings.PLATFORM_GATEWAY['credentials']['secret_key']
            self.publishable_key = settings.PLATFORM_GATEWAY['credentials']['publishable_key']
            self.platform_fee_percentage = settings.PLATFORM_GATEWAY.get('fee_percentage', 1.0)
        # Otherwise use user's credentials if provided
        elif config and config.credentials.get('secret_key'):
            self.api_key = config.credentials.get('secret_key')
            self.publishable_key = config.credentials.get('publishable_key')
            self.platform_fee_percentage = 0
        else:
            # Fallback to test key
            self.api_key = 'sk_test_default'
            self.publishable_key = 'pk_test_default'
            self.platform_fee_percentage = 0
        
        # Configure Stripe client
        stripe.api_key = self.api_key
    
    def create_payment_session(self, invoice, success_url, cancel_url, currency=None):
        """
        Create a Stripe checkout session for the invoice.
        
        Args:
            invoice: Invoice instance to create payment for
            success_url: URL to redirect after successful payment
            cancel_url: URL to redirect after cancelled payment
            currency: Optional currency code (e.g., 'usd', 'pkr')
            
        Returns:
            dict: Dictionary containing session details
        """
        # Check if we should use platform gateway
        self.use_platform_gateway = hasattr(invoice.user, 'profile') and hasattr(invoice.user.profile, 'allow_platform_gateway') and invoice.user.profile.allow_platform_gateway
        # Default to USD if no currency is provided
        if not currency:
            currency = invoice.user.profile.currency or 'usd'
            
        # Ensure currency is lowercase for Stripe
        currency = currency.lower()
        try:
            # Create line items for Stripe
            line_items = []
            
            # Add invoice items to line items
            for item in invoice.items.all():
                line_items.append({
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': item.description,
                        },
                        'unit_amount': int(item.unit_price * 100),  # Stripe uses cents
                    },
                    'quantity': int(item.quantity),
                })
            
            # Add tax as a separate line item if applicable
            if invoice.tax_amount and float(invoice.tax_amount) > 0:
                line_items.append({
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': f'Tax ({invoice.tax_rate}%)',
                        },
                        'unit_amount': int(invoice.tax_amount * 100),  # Stripe uses cents
                    },
                    'quantity': 1,
                })
            
            # Calculate total amount including platform fee if applicable
            total_amount = float(invoice.total)
            platform_fee = 0
            
            if self.use_platform_gateway and self.platform_fee_percentage > 0:
                platform_fee = total_amount * (self.platform_fee_percentage / 100)
                total_amount += platform_fee
            
            # Create a PaymentIntent instead of a checkout session for direct card processing
            payment_intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),  # Stripe uses cents
                currency=currency,
                payment_method_types=['card'],
                metadata={
                    'invoice_id': str(invoice.id),
                    'invoice_number': invoice.invoice_number,
                    'client_id': str(invoice.client.id),
                    'user_id': str(invoice.user.id),
                    'platform_fee': str(platform_fee) if platform_fee > 0 else '',
                    'using_platform_gateway': 'true' if self.use_platform_gateway else 'false'
                }
            )
            
            # Calculate platform fee if applicable
            platform_fee = 0
            if self.use_platform_gateway and self.platform_fee_percentage > 0:
                platform_fee = float(invoice.total) * (self.platform_fee_percentage / 100)
            
            # Create payment record
            payment = InvoicePayment.objects.create(
                invoice=invoice,
                gateway=self.config,
                gateway_name=self.gateway_name,
                amount=invoice.total,
                status='pending',
                gateway_payment_id=payment_intent.id,  # Store the payment intent ID directly
                metadata={
                    'payment_intent_id': payment_intent.id,
                    'client_secret': payment_intent.client_secret,
                    'platform_fee': str(platform_fee) if platform_fee > 0 else '',
                    'using_platform_gateway': 'true' if self.use_platform_gateway else 'false',
                    'platform_fee_percentage': str(self.platform_fee_percentage) if self.use_platform_gateway else '0'
                }
            )
            
            # Include platform fee info in response
            response = {
                'payment_id': str(payment.id),
                'client_secret': payment_intent.client_secret,
                'payment_intent_id': payment_intent.id,
                'publishable_key': self.publishable_key
            }
            
            if self.use_platform_gateway and self.platform_fee_percentage > 0:
                platform_fee = float(invoice.total) * (self.platform_fee_percentage / 100)
                response.update({
                    'platform_fee': platform_fee,
                    'platform_fee_percentage': self.platform_fee_percentage,
                    'total_with_fee': float(invoice.total) + platform_fee
                })
            
            return response
            
        except stripe.error.StripeError as e:
            print(f"Stripe error: {str(e)}")
            # Calculate platform fee if applicable
            platform_fee = 0
            if self.use_platform_gateway and self.platform_fee_percentage > 0:
                platform_fee = float(invoice.total) * (self.platform_fee_percentage / 100)
            
            # Create failed payment record
            payment = InvoicePayment.objects.create(
                invoice=invoice,
                gateway=self.config,
                gateway_name=self.gateway_name,
                amount=invoice.total,
                status='failed',
                error_message=str(e),
                metadata={
                    'platform_fee': str(platform_fee) if platform_fee > 0 else '',
                    'using_platform_gateway': 'true' if self.use_platform_gateway else 'false',
                    'platform_fee_percentage': str(self.platform_fee_percentage) if self.use_platform_gateway else '0'
                }
            )
            
            return {
                'error': str(e),
                'payment_id': str(payment.id)
            }
    
    def handle_webhook(self, request):
        """
        Process Stripe webhook events.
        
        Args:
            request: Django request object containing webhook data
            
        Returns:
            tuple: (success: bool, message: str, payment: InvoicePayment or None)
        """
        try:
            payload = json.loads(request.body)
            event_id = payload.get('id')
            
            # Check if event has already been processed
            if PaymentWebhookEvent.objects.filter(event_id=event_id).exists():
                return True, "Event already processed", None
            
            # Verify the event by fetching it from Stripe
            try:
                event = stripe.Event.retrieve(event_id)
            except stripe.error.StripeError as e:
                return False, f"Failed to verify Stripe event: {str(e)}", None
            
            # Store webhook event
            webhook_event = PaymentWebhookEvent.objects.create(
                gateway_name=self.gateway_name,
                event_type=event.type,
                event_id=event.id,
                payload=payload
            )
            
            # Process based on event type
            if event.type == 'checkout.session.completed':
                session = event.data.object
                
                # Find payment by session ID
                try:
                    payment = InvoicePayment.objects.get(gateway_session_id=session.id)
                    
                    # Update payment status
                    payment.status = 'completed'
                    payment.gateway_payment_id = session.payment_intent
                    payment.payment_method = 'card'  # Default for Stripe
                    payment.save()  # This will also update the invoice status
                    
                    # Link webhook event to payment
                    webhook_event.payment = payment
                    webhook_event.mark_as_processed()
                    
                    return True, "Payment completed successfully", payment
                    
                except InvoicePayment.DoesNotExist:
                    return False, f"Payment not found for session {session.id}", None
            
            elif event.type == 'payment_intent.payment_failed':
                payment_intent = event.data.object
                
                # Find payment by payment intent ID
                try:
                    payment = InvoicePayment.objects.get(gateway_payment_id=payment_intent.id)
                    
                    # Update payment status
                    payment.status = 'failed'
                    payment.error_message = payment_intent.get('last_payment_error', {}).get('message', 'Payment failed')
                    payment.save()
                    
                    # Link webhook event to payment
                    webhook_event.payment = payment
                    webhook_event.mark_as_processed()
                    
                    return True, "Payment failure recorded", payment
                    
                except InvoicePayment.DoesNotExist:
                    # Try to find by session ID in metadata
                    payments = InvoicePayment.objects.filter(
                        metadata__payment_intent=payment_intent.id
                    )
                    
                    if payments.exists():
                        payment = payments.first()
                        payment.status = 'failed'
                        payment.gateway_payment_id = payment_intent.id
                        payment.error_message = payment_intent.get('last_payment_error', {}).get('message', 'Payment failed')
                        payment.save()
                        
                        # Link webhook event to payment
                        webhook_event.payment = payment
                        webhook_event.mark_as_processed()
                        
                        return True, "Payment failure recorded", payment
                    
                    return False, f"Payment not found for payment intent {payment_intent.id}", None
            
            # Mark webhook as processed even if we don't handle this event type
            webhook_event.mark_as_processed()
            return True, f"Event {event.type} recorded but not processed", None
            
        except Exception as e:
            print(f"Error processing Stripe webhook: {str(e)}")
            return False, f"Error processing webhook: {str(e)}", None
    
    def get_payment_status(self, payment_id):
        """
        Get the current status of a payment from Stripe.
        
        Args:
            payment_id: ID of the payment to check
            
        Returns:
            str: Status of the payment
        """
        try:
            payment = InvoicePayment.objects.get(id=payment_id)
            
            if not payment.gateway_payment_id:
                return payment.status
            
            # Fetch payment intent from Stripe
            payment_intent = stripe.PaymentIntent.retrieve(payment.gateway_payment_id)
            
            # Map Stripe status to our status
            stripe_status = payment_intent.status
            status_mapping = {
                'succeeded': 'completed',
                'processing': 'processing',
                'requires_payment_method': 'pending',
                'requires_confirmation': 'pending',
                'requires_action': 'pending',
                'canceled': 'failed',
            }
            
            new_status = status_mapping.get(stripe_status, payment.status)
            
            # Update payment status if changed
            if new_status != payment.status:
                payment.status = new_status
                payment.save()
            
            return payment.status
            
        except InvoicePayment.DoesNotExist:
            return 'not_found'
        except stripe.error.StripeError as e:
            print(f"Stripe error checking payment status: {str(e)}")
            return 'error'
    
    def refund_payment(self, payment):
        """
        Refund a Stripe payment.
        
        Args:
            payment: InvoicePayment instance to refund
            
        Returns:
            tuple: (success: bool, message: str, refund_id: str or None)
        """
        try:
            if not payment.gateway_payment_id:
                return False, "No payment ID available for refund", None
            
            # Create refund in Stripe
            refund = stripe.Refund.create(
                payment_intent=payment.gateway_payment_id,
                reason='requested_by_customer'
            )
            
            # Update payment status
            payment.status = 'refunded'
            payment.metadata['refund_id'] = refund.id
            payment.metadata['refund_status'] = refund.status
            payment.save()
            
            return True, "Payment refunded successfully", refund.id
            
        except stripe.error.StripeError as e:
            print(f"Stripe refund error: {str(e)}")
            return False, f"Refund failed: {str(e)}", None
    
    @classmethod
    def get_required_credentials(cls):
        """
        Get the list of required credentials for Stripe.
        
        Returns:
            list: List of credential keys required for Stripe
        """
        return ['publishable_key', 'secret_key', 'webhook_secret']
    
    @classmethod
    def get_gateway_display_name(cls):
        """
        Get the display name for Stripe.
        
        Returns:
            str: Display name for the gateway
        """
        return 'Stripe'
