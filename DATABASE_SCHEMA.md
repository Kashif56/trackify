# Trackify Database Schema

This document provides a comprehensive overview of the database schema for the Trackify application, detailing all models, their fields, relationships, and constraints.

## Table of Contents
1. [Users](#users)
2. [Clients](#clients)
3. [Invoices](#invoices)
4. [Expenses](#expenses)
5. [Subscriptions](#subscriptions)
6. [Entity Relationship Diagram](#entity-relationship-diagram)

## Users

### User (Django's built-in User model)
Django's built-in User model with the following fields:
- `id` (AutoField): Primary key
- `username` (CharField): Unique username
- `email` (EmailField): User's email address
- `password` (CharField): Hashed password
- `first_name` (CharField): User's first name
- `last_name` (CharField): User's last name
- `is_active` (BooleanField): Whether user account is active
- `is_staff` (BooleanField): Whether user can access admin site
- `is_superuser` (BooleanField): Whether user has all permissions
- `date_joined` (DateTimeField): When user joined
- `last_login` (DateTimeField): Last login timestamp

### UserProfile
Extends the User model with additional information:
- `user` (OneToOneField → User): Link to User model
- `company_name` (CharField): User's company name
- `phone_number` (CharField): User's phone number
- `address` (TextField): User's address
- `city` (CharField): User's city
- `state` (CharField): User's state/province
- `country` (CharField): User's country
- `zip_code` (CharField): User's postal/zip code
- `profile_picture` (ImageField): User's profile picture
- `is_email_verified` (BooleanField): Whether email is verified

### EmailVerification
Stores email verification tokens:
- `user` (OneToOneField → User): Link to User model
- `token` (UUIDField): Unique verification token
- `created_at` (DateTimeField): When token was created
- `expires_at` (DateTimeField): When token expires
- Method: `is_expired` (property): Checks if token is expired

## Clients

### Client
Stores information about clients:
- `id` (UUIDField): Primary key
- `user` (ForeignKey → User): Owner of the client
- `name` (CharField): Client's name
- `email` (EmailField): Client's email address
- `phone_number` (CharField): Client's phone number
- `address` (TextField): Client's address
- `city` (CharField): Client's city
- `state` (CharField): Client's state/province
- `zip_code` (CharField): Client's postal/zip code
- `country` (CharField): Client's country
- `company_name` (CharField): Client's company name
- `notes` (TextField): Additional notes about client
- `created_at` (DateTimeField): When client was created
- `updated_at` (DateTimeField): When client was last updated

## Invoices

### Invoice
Stores invoice information:
- `id` (UUIDField): Primary key
- `user` (ForeignKey → User): Owner of the invoice
- `client` (ForeignKey → Client): Client being invoiced
- `invoice_number` (CharField): Unique invoice number
- `issue_date` (DateField): Date invoice was issued
- `due_date` (DateField): Date payment is due
- `status` (CharField): Invoice status (paid, unpaid, overdue)
- `notes` (TextField): Additional notes about invoice
- `subtotal` (DecimalField): Sum of all items before tax
- `tax_rate` (DecimalField): Tax rate percentage
- `tax_amount` (DecimalField): Calculated tax amount
- `total` (DecimalField): Total invoice amount including tax
- `created_at` (DateTimeField): When invoice was created
- `updated_at` (DateTimeField): When invoice was last updated
- Method: `save`: Generates invoice number if not provided

### InvoiceItem
Stores individual line items for invoices:
- `invoice` (ForeignKey → Invoice): Parent invoice
- `description` (CharField): Item description
- `quantity` (DecimalField): Quantity of item
- `unit_price` (DecimalField): Price per unit
- `amount` (DecimalField): Calculated total (quantity × unit_price)
- Method: `save`: Calculates amount and updates invoice totals

## Expenses

### ExpenseCategory
Categorizes expenses:
- `user` (ForeignKey → User): Owner of the category
- `name` (CharField): Category name
- `description` (TextField): Category description
- `created_at` (DateTimeField): When category was created

### Expense
Stores expense information:
- `id` (UUIDField): Primary key
- `user` (ForeignKey → User): Owner of the expense
- `category` (ForeignKey → ExpenseCategory): Expense category
- `amount` (DecimalField): Expense amount
- `date` (DateField): Date expense occurred
- `description` (CharField): Expense description
- `notes` (TextField): Additional notes about expense
- `receipt` (FileField): Receipt image/document
- `created_at` (DateTimeField): When expense was created
- `updated_at` (DateTimeField): When expense was last updated

## Subscriptions

### Plan
Defines subscription plans:
- `id` (UUIDField): Primary key
- `name` (CharField): Plan name (free, pro, business, trial)
- `description` (TextField): Plan description
- `price` (DecimalField): Plan price
- `billing_cycle` (CharField): Billing frequency (14_days, monthly, yearly, lifetime)
- `invoices_limit` (IntegerField): Maximum invoices allowed
- `email_notifications` (BooleanField): Whether email notifications are included
- `payment_collection` (BooleanField): Whether payment collection is included
- `analytics` (BooleanField): Whether analytics features are included
- `is_active` (BooleanField): Whether plan is currently available
- `created_at` (DateTimeField): When plan was created
- `updated_at` (DateTimeField): When plan was last updated
- Method: `plan_duration`: Returns duration in days based on billing cycle

### Subscription
Tracks user subscriptions:
- `id` (UUIDField): Primary key
- `user` (ForeignKey → User): Subscribed user
- `plan` (ForeignKey → Plan): Subscription plan
- `status` (CharField): Subscription status (active, canceled, expired, trial, overdue)
- `start_date` (DateField): When subscription started
- `end_date` (DateField): When subscription ends (null for lifetime)
- `created_at` (DateTimeField): When subscription was created
- `updated_at` (DateTimeField): When subscription was last updated

### UsageTracker
Tracks usage metrics for subscriptions:
- `id` (UUIDField): Primary key
- `subscription` (ForeignKey → Subscription): Related subscription
- `user` (ForeignKey → User): User whose usage is being tracked
- `date` (DateField): Date of usage tracking
- `metrics` (JSONField): Usage metrics (invoice_count, etc.)
- `created_at` (DateTimeField): When record was created
- `updated_at` (DateTimeField): When record was last updated
- Methods:
  - `increment_metric`: Increments a specific usage metric
  - `increment_invoices`: Increments invoice count
  - `get_usage_summary`: Gets usage summary for a date range

### BillingHistory
Tracks subscription payments:
- `id` (UUIDField): Primary key
- `subscription` (ForeignKey → Subscription): Related subscription
- `amount` (DecimalField): Payment amount
- `payment_date` (DateTimeField): When payment was made
- `transaction_id` (CharField): External transaction ID
- `status` (CharField): Payment status (pending, completed, failed, refunded)
- `created_at` (DateTimeField): When record was created

## Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     User      │       │    Client     │       │    Invoice    │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ username      │       │ user          │◄──────┤ user          │
│ email         │       │ name          │       │ client        │◄─┐
│ password      │       │ email         │       │ invoice_number│  │
│ first_name    │       │ phone_number  │       │ issue_date    │  │
│ last_name     │◄──────┤ address       │       │ due_date      │  │
│ is_active     │       │ city          │       │ status        │  │
│ date_joined   │       │ state         │       │ notes         │  │
└───────┬───────┘       │ zip_code      │       │ subtotal      │  │
        │               │ country       │       │ tax_rate      │  │
        │               │ company_name  │       │ tax_amount    │  │
        │               │ notes         │       │ total         │  │
        │               │ created_at    │       │ created_at    │  │
        │               │ updated_at    │       │ updated_at    │  │
        │               └───────────────┘       └──────┬────────┘  │
        │                                              │           │
        │                                              │           │
┌───────┴───────┐                             ┌────────▼────────┐  │
│  UserProfile  │                             │   InvoiceItem   │  │
├───────────────┤                             ├─────────────────┤  │
│ user          │                             │ invoice         │──┘
│ company_name  │                             │ description     │
│ phone_number  │                             │ quantity        │
│ address       │                             │ unit_price      │
│ city          │                             │ amount          │
│ state         │                             └─────────────────┘
│ country       │
│ zip_code      │                             ┌─────────────────┐
│ profile_pic   │                             │ ExpenseCategory │
│ is_verified   │                             ├─────────────────┤
└───────────────┘                             │ user            │◄─┐
                                              │ name            │  │
┌───────────────┐                             │ description     │  │
│ EmailVerif.   │                             │ created_at      │  │
├───────────────┤                             └─────────────────┘  │
│ user          │                                                  │
│ token         │                             ┌─────────────────┐  │
│ created_at    │                             │     Expense     │  │
│ expires_at    │                             ├─────────────────┤  │
└───────────────┘                             │ id              │  │
                                              │ user            │  │
                                              │ category        │──┘
                                              │ amount          │
                                              │ date            │
                                              │ description     │
                                              │ notes           │
                                              │ receipt         │
                                              │ created_at      │
                                              │ updated_at      │
                                              └─────────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     Plan      │       │ Subscription  │       │ UsageTracker  │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ name          │◄──────┤ user          │◄──────┤ subscription  │
│ description   │       │ plan          │       │ user          │
│ price         │       │ status        │       │ date          │
│ billing_cycle │       │ start_date    │       │ metrics       │
│ invoices_limit│       │ end_date      │       │ created_at    │
│ email_notif.  │       │ created_at    │       │ updated_at    │
│ payment_coll. │       │ updated_at    │       └───────────────┘
│ analytics     │       └──────┬────────┘
│ is_active     │              │
│ created_at    │              │
│ updated_at    │              │
└───────────────┘       ┌──────▼────────┐
                        │ BillingHistory│
                        ├───────────────┤
                        │ id            │
                        │ subscription  │
                        │ amount        │
                        │ payment_date  │
                        │ transaction_id│
                        │ status        │
                        │ created_at    │
                        └───────────────┘
```

This diagram shows the relationships between the main entities in the Trackify application. The primary relationships are:

1. User has one UserProfile (one-to-one)
2. User has many Clients (one-to-many)
3. User has many Invoices (one-to-many)
4. Client has many Invoices (one-to-many)
5. Invoice has many InvoiceItems (one-to-many)
6. User has many ExpenseCategories (one-to-many)
7. User has many Expenses (one-to-many)
8. ExpenseCategory has many Expenses (one-to-many)
9. User has one active Subscription (one-to-one)
10. Plan has many Subscriptions (one-to-many)
11. Subscription has many BillingHistory records (one-to-many)
12. Subscription has many UsageTracker records (one-to-many)
