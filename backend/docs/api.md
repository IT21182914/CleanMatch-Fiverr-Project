# CleanMatch API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **customer**: Can book services, make payments, leave reviews
- **cleaner**: Can receive bookings, update availability, manage profile
- **admin**: Full access to all endpoints and admin functions

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {}, // response data
  "error": "error message", // only present if success is false
  "message": "success message" // optional
}
```

## Error Codes

- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Endpoints

### Authentication (`/auth`)

#### POST /auth/register
Register a new user account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer",
  "address": "123 Main St", // required for cleaners
  "city": "New York",       // required for cleaners
  "state": "NY",           // required for cleaners
  "zipCode": "10001"       // required for cleaners
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### POST /auth/login
Login with email and password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Users (`/users`)

#### GET /users/profile
Get current user's profile. **Requires authentication.**

#### PUT /users/profile
Update user profile. **Requires authentication.**

#### PUT /users/cleaner-profile
Update cleaner-specific profile. **Requires cleaner role.**

#### GET /users/bookings
Get user's bookings with pagination.

**Query Parameters:**
- `status` - Filter by booking status
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Services (`/services`)

#### GET /services
Get all active services.

**Query Parameters:**
- `category` - Filter by service category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### GET /services/:id
Get service details by ID.

#### GET /services/:id/pricing
Get service pricing with potential discounts.

**Query Parameters:**
- `hours` - Number of hours (default: 1)
- `membershipTier` - User's membership tier for discounts

### Bookings (`/bookings`)

#### POST /bookings
Create a new booking. **Requires customer role.**

**Body:**
```json
{
  "serviceId": 1,
  "bookingDate": "2024-07-15",
  "bookingTime": "10:00",
  "durationHours": 2,
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "specialInstructions": "Focus on kitchen",
  "autoAssign": true
}
```

#### GET /bookings/:id
Get booking details. **Requires authentication.**

#### PUT /bookings/:id/status
Update booking status. **Requires authentication with proper permissions.**

**Body:**
```json
{
  "status": "confirmed"
}
```

Valid statuses:
- `pending` - Waiting for cleaner assignment
- `confirmed` - Cleaner assigned and confirmed
- `in_progress` - Service is currently being performed
- `completed` - Service finished
- `cancelled` - Booking cancelled

#### GET /bookings/:id/recommendations
Get cleaner recommendations for a booking. **Requires customer role or admin.**

#### POST /bookings/:id/assign
Manually assign cleaner to booking. **Requires customer role or admin.**

**Body:**
```json
{
  "cleanerId": 5
}
```

#### POST /bookings/:id/review
Add review for completed booking. **Requires authentication.**

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service!"
}
```

### Payments (`/payments`)

#### POST /payments/create-payment-intent
Create Stripe payment intent for booking. **Requires customer role.**

**Body:**
```json
{
  "bookingId": 1
}
```

#### POST /payments/create-subscription
Create subscription for membership. **Requires customer role.**

**Body:**
```json
{
  "planName": "Premium",
  "priceId": "price_premium_monthly"
}
```

#### PUT /payments/cancel-subscription
Cancel active subscription. **Requires customer role.**

#### POST /payments/connect-account
Create Stripe Connect account for cleaner. **Requires cleaner role.**

#### GET /payments/connect-status
Get Connect account status. **Requires cleaner role.**

#### POST /payments/webhook
Stripe webhook endpoint. **Public endpoint with signature verification.**

### Admin (`/admin`)

All admin endpoints require admin role.

#### GET /admin/dashboard
Get comprehensive dashboard statistics.

#### GET /admin/users
Get all users with filters and pagination.

**Query Parameters:**
- `role` - Filter by user role
- `status` - Filter by active/inactive status
- `search` - Search by name or email
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### PUT /admin/users/:id/status
Activate or deactivate user account.

**Body:**
```json
{
  "isActive": true
}
```

#### GET /admin/bookings
Get all bookings with filters.

**Query Parameters:**
- `status` - Filter by booking status
- `paymentStatus` - Filter by payment status
- `search` - Search by customer/cleaner name or service
- `page` - Page number
- `limit` - Items per page

#### PUT /admin/cleaners/:id/background-check
Update cleaner background check status.

**Body:**
```json
{
  "status": "approved"
}
```

Valid statuses: `pending`, `approved`, `rejected`

#### GET /admin/payments
Get payment analytics and transactions.

#### GET /admin/analytics/revenue
Get revenue analytics by period.

**Query Parameters:**
- `period` - `daily`, `weekly`, `monthly`, `yearly`
- `year` - Filter by specific year

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address. When the limit is exceeded, the API returns a 429 status code.

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page` - Page number (starting from 1)
- `limit` - Number of items per page

**Response includes pagination info:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Webhooks

### Stripe Webhooks

Endpoint: `POST /api/payments/webhook`

The application handles these Stripe webhook events:
- `payment_intent.succeeded`
- `invoice.payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Webhook signature verification is required using the Stripe webhook secret.

## Testing with cURL

### Register a new customer:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Get services:
```bash
curl -X GET http://localhost:5000/api/services
```

### Create booking (with token):
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "serviceId": 1,
    "bookingDate": "2024-07-15",
    "bookingTime": "10:00",
    "durationHours": 2,
    "address": "123 Test St",
    "city": "Test City",
    "state": "TS",
    "zipCode": "12345"
  }'
```
