# Trackify API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Users API](#users-api)
3. [Clients API](#clients-api)
4. [Invoices API](#invoices-api)
5. [Expenses API](#expenses-api)
6. [Analytics API](#analytics-api)
7. [Subscription API](#subscription-api)

## Authentication

Trackify uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid JWT token.

### Base URL
```
http://localhost:8000/api/
```

### Headers
For protected endpoints, include the following header:
```
Authorization: Bearer <your_access_token>
```

## Users API

### Endpoints

#### Register User
- **URL**: `/users/register/`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "secure_password",
    "password2": "secure_password",
    "first_name": "First",
    "last_name": "Last"
  }
  ```
- **Response**: 
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "first_name": "First",
      "last_name": "Last",
      "profile": {
        "company_name": "",
        "phone_number": "",
        "address": "",
        "city": null,
        "state": null,
        "country": null,
        "zip_code": null,
        "profile_picture": null
      }
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
  ```

#### Email Verification
- **URL**: `/users/verify-email/<token>/`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Verify user email with token
- **Response**: 
  ```json
  {
    "message": "Email verified successfully",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "first_name": "First",
      "last_name": "Last",
      "profile": {
        "company_name": "",
        "phone_number": "",
        "address": "",
        "city": null,
        "state": null,
        "country": null,
        "zip_code": null,
        "profile_picture": null,
        "is_email_verified": true
      }
    },
    "tokens": {
      "refresh": "refresh_token",
      "access": "access_token"
    }
  }
  ```

#### Resend Verification Email
- **URL**: `/users/resend-verification/`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Resend verification email
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "If your email exists in our system, a verification link has been sent."
  }
  ```

#### Login
- **URL**: `/users/login/`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticate user and get tokens
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secure_password"
  }
  ```
- **Response**: 
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "first_name": "First",
      "last_name": "Last",
      "profile": {
        "company_name": "",
        "phone_number": "",
        "address": "",
        "city": null,
        "state": null,
        "country": null,
        "zip_code": null,
        "profile_picture": null
      }
    },
    "tokens": {
      "refresh": "refresh_token",
      "access": "access_token"
    }
  }
  ```

#### Refresh Token
- **URL**: `/users/token/refresh/`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Get new access token using refresh token
- **Request Body**:
  ```json
  {
    "refresh": "refresh_token"
  }
  ```
- **Response**: 
  ```json
  {
    "access": "new_access_token"
  }
  ```

#### Get User Profile
- **URL**: `/users/profile/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get current user's profile
- **Response**: 
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "First",
    "last_name": "Last",
    "profile": {
      "company_name": "",
      "phone_number": "",
      "address": "",
      "city": null,
      "state": null,
      "country": null,
      "zip_code": null,
      "profile_picture": null
    }
  }
  ```

#### Update User Profile
- **URL**: `/users/profile/update/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Update user profile
- **Request Body**:
  ```json
  {
    "first_name": "Updated",
    "last_name": "Name",
    "company_name": "Company Inc.",
    "phone_number": "123-456-7890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zip_code": "10001"
  }
  ```
- **Response**: Updated user profile

## Clients API

### Endpoints

#### List Clients
- **URL**: `/clients/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get list of all clients for the authenticated user
- **Query Parameters**:
  - `page`: Page number for pagination
  - `search`: Search term for filtering clients
- **Response**: Paginated list of clients

#### Create Client
- **URL**: `/clients/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new client
- **Request Body**:
  ```json
  {
    "name": "Client Name",
    "email": "client@example.com",
    "phone_number": "123-456-7890",
    "address": "123 Client St",
    "city": "Client City",
    "state": "CS",
    "zip_code": "12345",
    "country": "Country",
    "company_name": "Client Company",
    "notes": "Additional notes"
  }
  ```
- **Response**: Created client object

#### Get Client
- **URL**: `/clients/<uuid>/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific client by ID
- **Response**: Client details

#### Update Client
- **URL**: `/clients/<uuid>/`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a client
- **Request Body**: Client data to update
- **Response**: Updated client object

#### Delete Client
- **URL**: `/clients/<uuid>/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a client
- **Response**: 204 No Content

## Invoices API

### Endpoints

#### List Invoices
- **URL**: `/invoices/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get list of all invoices for the authenticated user
- **Query Parameters**:
  - `page`: Page number for pagination
  - `client`: Filter by client ID
  - `status`: Filter by status (paid, unpaid, overdue)
  - `start_date`: Filter by issue date (start)
  - `end_date`: Filter by issue date (end)
- **Response**: Paginated list of invoices

#### Create Invoice
- **URL**: `/invoices/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new invoice
- **Request Body**:
  ```json
  {
    "client": "client_uuid",
    "issue_date": "2025-09-12",
    "due_date": "2025-10-12",
    "notes": "Invoice notes",
    "payment_terms": "Payment due within 14 days of issue",
    "conditions": "Terms and conditions for this invoice",
    "tax_rate": 10.0,
    "items": [
      {
        "description": "Service 1",
        "quantity": 2,
        "unit_price": 100.00
      },
      {
        "description": "Service 2",
        "quantity": 1,
        "unit_price": 50.00
      }
    ]
  }
  ```
- **Response**: Created invoice with calculated totals

#### Get Invoice
- **URL**: `/invoices/<uuid>/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific invoice by ID
- **Response**: Invoice details with items

#### Update Invoice
- **URL**: `/invoices/<uuid>/`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update an invoice
- **Request Body**: Invoice data to update
- **Response**: Updated invoice object

#### Delete Invoice
- **URL**: `/invoices/<uuid>/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete an invoice
- **Response**: 204 No Content

#### Update Invoice Status
- **URL**: `/invoices/<uuid>/status/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Update invoice status
- **Request Body**:
  ```json
  {
    "status": "paid"
  }
  ```
- **Response**: Updated invoice with new status

## Expenses API

### Endpoints

#### List Expenses
- **URL**: `/expenses/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get list of all expenses for the authenticated user
- **Query Parameters**:
  - `page`: Page number for pagination
  - `category`: Filter by category ID
  - `start_date`: Filter by date (start)
  - `end_date`: Filter by date (end)
- **Response**: Paginated list of expenses

#### Create Expense
- **URL**: `/expenses/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new expense
- **Request Body**:
  ```json
  {
    "category": "category_id",
    "amount": 150.00,
    "date": "2025-09-12",
    "description": "Office supplies",
    "notes": "Monthly supplies"
  }
  ```
- **Response**: Created expense object

#### Get Expense
- **URL**: `/expenses/<uuid>/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific expense by ID
- **Response**: Expense details

#### Update Expense
- **URL**: `/expenses/<uuid>/`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update an expense
- **Request Body**: Expense data to update
- **Response**: Updated expense object

#### Delete Expense
- **URL**: `/expenses/<uuid>/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete an expense
- **Response**: 204 No Content

#### List Expense Categories
- **URL**: `/expenses/categories/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get list of all expense categories
- **Response**: List of expense categories

#### Create Expense Category
- **URL**: `/expenses/categories/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new expense category
- **Request Body**:
  ```json
  {
    "name": "Office Supplies",
    "description": "Office supplies and equipment"
  }
  ```
- **Response**: Created category object

## Analytics API

### Endpoints

#### Income vs Expenses
- **URL**: `/analytics/income-expenses/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get income vs expenses data for charts
- **Query Parameters**:
  - `range`: Predefined range (daily, weekly, monthly, 6months, yearly)
  - `start_date`: Custom start date (YYYY-MM-DD)
  - `end_date`: Custom end date (YYYY-MM-DD)
- **Response**: 
  ```json
  {
    "range_type": "monthly",
    "start_date": "2025-03-12",
    "end_date": "2025-09-12",
    "data": [
      {
        "date": "2025-03-01",
        "label": "Mar 2025",
        "income": 5000.00,
        "expenses": 3000.00,
        "net": 2000.00
      },
      // More months...
    ]
  }
  ```

#### Invoice Status Breakdown
- **URL**: `/analytics/invoice-status-breakdown/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get invoice status breakdown
- **Response**: 
  ```json
  [
    {
      "status": "paid",
      "count": 15,
      "total": 7500.00
    },
    {
      "status": "unpaid",
      "count": 5,
      "total": 2500.00
    },
    {
      "status": "overdue",
      "count": 2,
      "total": 1000.00
    }
  ]
  ```

#### Top Expense Categories
- **URL**: `/analytics/top-expense-categories/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get top expense categories
- **Query Parameters**:
  - `limit`: Number of categories to return (default: 5)
  - `start_date`: Filter by date (start)
  - `end_date`: Filter by date (end)
- **Response**: 
  ```json
  [
    {
      "category": "Office Supplies",
      "total": 1200.00
    },
    {
      "category": "Rent",
      "total": 1000.00
    },
    // More categories...
    {
      "category": "Others",
      "total": 800.00
    }
  ]
  ```

#### Upcoming Payments
- **URL**: `/analytics/upcoming-payments/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get upcoming invoice payments due
- **Query Parameters**:
  - `days`: Number of days to look ahead (default: 30)
- **Response**: 
  ```json
  [
    {
      "invoice_id": "uuid",
      "invoice_number": "INV-2025-09-0001",
      "client_id": "client_uuid",
      "client_name": "Client Name",
      "amount": 1500.00,
      "due_date": "2025-09-20",
      "days_until_due": 8,
      "status": "unpaid"
    },
    // More upcoming payments...
  ]
  ```

#### Growth Rate
- **URL**: `/analytics/growth-rate/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get month-over-month growth rate
- **Response**: 
  ```json
  {
    "current_month_revenue": 5000.00,
    "previous_month_revenue": 4000.00,
    "growth_rate": 25.00,
    "is_positive": true,
    "current_month": "September 2025",
    "previous_month": "August 2025"
  }
  ```

## Subscription API

### Endpoints

#### Get Plans
- **URL**: `/subscription/plans/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get available subscription plans
- **Response**: List of subscription plans

#### Get Current Subscription
- **URL**: `/subscription/current/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get user's current subscription
- **Response**: Current subscription details

#### Subscribe to Plan
- **URL**: `/subscription/subscribe/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Subscribe to a plan
- **Request Body**:
  ```json
  {
    "plan_id": "plan_uuid"
  }
  ```
- **Response**: New subscription details

#### Cancel Subscription
- **URL**: `/subscription/cancel/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Cancel current subscription
- **Response**: Updated subscription with canceled status

#### Get Usage Metrics
- **URL**: `/subscription/usage/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get subscription usage metrics
- **Response**: Usage metrics and limits
