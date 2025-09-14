# Trackify Payment System

A plugin-based payment processing system for Trackify that allows clients to pay invoices online through various payment gateways.

## Overview

The Trackify Payment System is designed with a loosely coupled, plugin-like architecture that makes it easy to add new payment gateways without modifying existing code. The system currently supports Stripe as the default payment gateway, with the ability to add more gateways in the future.

## Features

- **Multiple Payment Gateways**: Support for multiple payment gateways through a plugin architecture
- **User-Configurable**: Users can connect their preferred payment gateway by entering API keys
- **Invoice Payment Links**: Generate shareable payment links for clients to pay invoices online
- **Webhook Support**: Handle payment events from gateways (success, failure, etc.)
- **Payment Status Tracking**: Track payment status in real-time
- **Refund Support**: Process refunds through the same gateway used for the original payment
- **Admin Interface**: Manage payment configurations and track payments through the Django admin

## Architecture

### Backend Components

1. **Models**:
   - `PaymentGatewayConfig`: Stores payment gateway configurations for users
   - `InvoicePayment`: Tracks payments for invoices
   - `PaymentWebhookEvent`: Stores webhook events from payment gateways

2. **Gateway Interface**:
   - `PaymentGatewayBase`: Abstract base class defining the interface for all payment gateways
   - Gateway implementations (e.g., `StripeGateway`): Concrete implementations for specific payment providers

3. **Payment Service**:
   - `PaymentService`: Centralized service for handling payment operations and routing to appropriate gateways

4. **API Endpoints**:
   - Gateway configuration management
   - Payment session creation
   - Payment status checking
   - Webhook handling
   - Public payment information

### Frontend Components

1. **API Service**:
   - `paymentService.js`: Client-side service for interacting with payment APIs

2. **Components**:
   - `InvoicePaymentPage`: Public page for clients to pay invoices
   - Payment button in `InvoiceDetailPage`: For generating and sharing payment links

## Flow

1. **Invoice Creation**:
   - User creates an invoice in Trackify

2. **Payment Link Generation**:
   - User shares a unique invoice payment link with their client

3. **Client Payment**:
   - Client opens the link and sees invoice details
   - Client clicks "Pay Now" to initiate payment
   - Client is redirected to the payment gateway's checkout page

4. **Payment Processing**:
   - Payment gateway processes the payment
   - Gateway sends webhook events to Trackify
   - Trackify updates the invoice status based on payment status

## Setup

### Environment Variables

The following environment variables should be set for payment gateways:

```
# Stripe
STRIPE_TEST_PUBLIC_KEY=pk_test_your_test_key
STRIPE_TEST_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Webhook Configuration

For local development, you can use tools like ngrok to receive webhook events from payment gateways. Configure your payment gateway to send webhook events to:

```
https://your-ngrok-url.ngrok.io/api/payment/webhook/stripe/
```

Replace `stripe` with the name of the gateway you're using.

## Adding New Gateways

See the [Adding New Payment Gateways](./docs/adding_new_gateways.md) guide for detailed instructions on how to extend the system with additional payment gateways.

## API Endpoints

### Gateway Configuration

- `GET /api/payment/gateways/`: List all payment gateways for the current user
- `GET /api/payment/gateways/<uuid:gateway_id>/`: Get a specific gateway configuration
- `POST /api/payment/gateways/`: Create a new gateway configuration
- `PUT /api/payment/gateways/<uuid:gateway_id>/`: Update a gateway configuration
- `DELETE /api/payment/gateways/<uuid:gateway_id>/`: Delete a gateway configuration

### Payment Processing

- `POST /api/payment/create-session/`: Create a payment session for an invoice
- `GET /api/payment/status/<uuid:payment_id>/`: Check the status of a payment
- `POST /api/payment/refund/<uuid:payment_id>/`: Refund a payment
- `GET /api/payment/invoice/<uuid:invoice_id>/payments/`: List all payments for an invoice

### Public Endpoints

- `GET /api/payment/public/invoice/<uuid:invoice_id>/`: Get public payment information for an invoice

### Webhooks

- `POST /api/payment/webhook/<str:gateway_name>/`: Handle webhook events from a payment gateway

## Security Considerations

- Payment gateway credentials are stored securely in the database
- Webhook endpoints validate the authenticity of incoming events
- Public endpoints only expose necessary information
- CSRF protection is disabled for webhook endpoints (required by most gateways)

## Dependencies

- Django REST Framework for API endpoints
- Stripe Python SDK for Stripe integration
- React for frontend components

## Future Improvements

- Add support for more payment gateways (PayPal, Razorpay, etc.)
- Implement subscription billing
- Add support for partial payments
- Enhance reporting and analytics for payments
