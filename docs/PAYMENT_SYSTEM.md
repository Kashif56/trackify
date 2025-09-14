# Trackify Payment System Documentation

## Overview

The Trackify Payment System is a plugin-based architecture that allows clients to pay invoices online through various payment gateways. The system is designed to be extensible, allowing for easy addition of new payment gateways without modifying existing code.

## Architecture

### Backend Components

1. **Models**
   - `PaymentGatewayConfig`: Stores payment gateway configurations
   - `InvoicePayment`: Tracks payments for invoices
   - `PaymentWebhookEvent`: Stores webhook events from payment gateways

2. **Gateway Interface**
   - `PaymentGatewayBase`: Abstract base class for all payment gateways
   - Gateway implementations (e.g., `StripeGateway`)

3. **Payment Service**
   - Centralized service for handling payment operations
   - Dynamically loads and routes requests to appropriate gateways

4. **API Endpoints**
   - Gateway configuration management
   - Payment session creation
   - Payment status checking
   - Webhook handling

### Frontend Components

1. **API Service**
   - `paymentService.js`: Client-side service for payment APIs

2. **Components**
   - `PaymentModal`: Dynamic modal that adapts to different gateways
   - Gateway-specific form components (e.g., `StripePaymentForm`)

## Usage

### Setting Up Payment Gateways

1. Configure gateway in admin panel or user settings
2. Enter API keys and credentials
3. Set as default gateway if desired

### Processing Payments

1. Create a payment session for an invoice
2. Redirect client to payment page or show payment modal
3. Process payment through selected gateway
4. Handle webhook events for payment status updates

## Extending with New Gateways

1. Create a new gateway class that inherits from `PaymentGatewayBase`
2. Implement required methods:
   - `create_payment_session()`
   - `handle_webhook()`
   - `get_payment_status()`
   - `refund_payment()`
3. Register the gateway in settings
4. Create a corresponding frontend form component

## API Reference

### Backend APIs

- `GET /payment/gateways/`: List user's payment gateways
- `POST /payment/create-session/`: Create payment session
- `GET /payment/status/<payment_id>/`: Check payment status
- `GET /payment/invoice/<invoice_id>/gateway/`: Get gateway info for invoice
- `POST /payment/webhook/<gateway_name>/`: Handle gateway webhooks

### Frontend Services

- `paymentService.createPaymentSession()`: Create payment session
- `paymentService.getPaymentStatus()`: Check payment status
- `paymentService.checkInvoiceGateway()`: Check if invoice has gateway
- `paymentService.getInvoicePaymentGateway()`: Get gateway info

## Security Considerations

- Gateway credentials are stored securely
- Public endpoints only expose necessary information
- Webhook endpoints validate event authenticity
- CSRF protection is disabled only for webhook endpoints
