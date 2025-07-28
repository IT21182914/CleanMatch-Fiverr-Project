# CleanMatch Backend

An AI-powered cleaning services marketplace backend built with Node.js, Express, PostgreSQL, and Stripe integration.

## 🚀 Features

### Core Features
- **Multi-role Authentication**: Customer, Cleaner, and Admin roles with JWT authentication
- **AI-Powered Cleaner Matching**: Intelligent algorithm to match customers with nearby available cleaners
- **Booking Management**: Complete booking lifecycle from creation to completion
- **Payment Processing**: Stripe integration for one-time payments and subscriptions
- **Review System**: Customer and cleaner rating system
- **Real-time Notifications**: Email and in-app notifications
- **Admin Dashboard**: Comprehensive admin panel for managing users, bookings, and analytics

### Technical Features
- **Role-based Access Control**: Secure API endpoints with proper authorization
- **Automated Scheduling**: Cron jobs for reminders, rating updates, and cleanup
- **Error Handling**: Comprehensive error handling and logging
- **Data Validation**: Input validation using Joi
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, and other security middleware

## 🏗️ Architecture

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection and table creation
├── controllers/             # Business logic controllers
├── middleware/
│   ├── auth.js             # Authentication and authorization
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Request validation schemas
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── users.js            # User management
│   ├── services.js         # Service management
│   ├── bookings.js         # Booking operations
│   ├── payments.js         # Payment processing
│   └── admin.js            # Admin operations
├── utils/
│   ├── matchCleaner.js     # AI cleaner matching algorithm
│   ├── stripe.js           # Stripe payment utilities
│   ├── email.js            # Email sending utilities
│   └── scheduler.js        # Cron job management
├── scripts/                # Setup and utility scripts
│   ├── setup.js            # Main project setup
│   ├── seed.js             # Database seeding
│   └── create-admin.js     # Admin user creation
├── database/               # Database scripts and migrations
│   ├── migrations/         # Database migration files
│   ├── add-rating-columns.js # Add rating functionality
│   └── migrate-membership.js # Membership migrations
├── tools/                  # Development and monitoring tools
│   ├── db-monitor.js       # Database monitoring
│   ├── process-manager.js  # Production process management
│   └── check-users.js      # Data validation tools
├── tests/                  # Test files
│   ├── test-server.js      # Server tests
│   ├── test-api.js         # API endpoint tests
│   └── test-comprehensive.js # Full system tests
├── docs/                   # Documentation
│   ├── api.md              # API documentation
│   ├── DATABASE_GUIDE.md   # Database setup guide
│   └── PROJECT_OVERVIEW.md # Project overview
├── uploads/                # File uploads directory
├── server.js               # Express server setup
├── package.json            # Dependencies and scripts
└── .env.example            # Environment variables template
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- Stripe Account
- Email Service (Gmail or SMTP)

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=CleanMatch_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE CleanMatch_db;
```

The application will automatically create tables on first run.

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates sample users and services:
- Admin: `admin@CleanMatch.com` / `admin123!`
- Customer: `customer@example.com` / `customer123!`
- Cleaners: `cleaner1@example.com` / `cleaner123!`

### 5. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer", // or "cleaner"
  "address": "123 Main St", // required for cleaners
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": 1,
  "bookingDate": "2024-07-15",
  "bookingTime": "10:00",
  "durationHours": 2,
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "specialInstructions": "Please focus on kitchen",
  "autoAssign": true
}
```

#### Get Cleaner Recommendations
```http
GET /api/bookings/{bookingId}/recommendations
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /api/payments/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": 1
}
```

#### Create Stripe Connect Account (Cleaners)
```http
POST /api/payments/connect-account
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

#### Manage Users
```http
GET /api/admin/users?role=cleaner&page=1&limit=20
Authorization: Bearer <token>
```

## 🤖 AI Cleaner Matching Algorithm

The matching algorithm considers multiple factors:

1. **Geographic Proximity**: Distance from customer location
2. **Availability**: Real-time availability checking
3. **Rating**: Cleaner's average customer rating
4. **Experience**: Years of experience and total jobs completed
5. **Rate Competitiveness**: Hourly rate comparison
6. **Service Area**: Cleaner's defined service radius

**Match Score Calculation:**
- Distance Score: 30 points (closer = higher score)
- Rating Score: 25 points (higher rating = higher score)
- Experience Score: 20 points (more experience = higher score)
- Job Completion: 15 points (more jobs = higher score)
- Rate Competitiveness: 10 points (competitive rates = higher score)

## 💳 Stripe Integration

### Payment Flows

1. **One-time Payments**: Booking payments using Payment Intents
2. **Subscriptions**: Membership plans with recurring billing
3. **Connect Accounts**: Cleaner payouts using Stripe Connect
4. **Webhooks**: Real-time payment status updates

### Supported Features

- Payment processing with multiple payment methods
- Automatic platform fee deduction (10% configurable)
- Refund processing
- Failed payment handling
- Subscription management

## 📧 Email Notifications

Automated emails for:
- Welcome messages
- Booking confirmations
- Booking reminders (24 hours before)
- Password reset requests
- Service completion invoices

## ⏰ Scheduled Tasks

Daily cron jobs handle:
- **9:00 AM**: Send booking reminders for next day
- **12:00 AM**: Update cleaner ratings and job counts
- **11:00 PM**: Auto-complete overdue bookings
- **Weekly**: Clean up old notifications (30+ days)

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection with parameterized queries

## 🚀 Deployment

### Environment Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Use secure, random JWT secrets
3. Configure production database
4. Set up SSL/TLS
5. Configure email service
6. Set up Stripe webhooks

### Supported Platforms

- **Railway**: Database and app hosting
- **Render**: Web service deployment
- **Heroku**: Container deployment
- **AWS**: EC2/RDS/Lambda deployment
- **DigitalOcean**: Droplet deployment

### Docker Support (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```bash
tests/
├── auth.test.js        # Authentication tests
├── bookings.test.js    # Booking functionality tests
├── payments.test.js    # Payment processing tests
├── matching.test.js    # AI matching algorithm tests
└── admin.test.js       # Admin functionality tests
```

## 📊 Monitoring & Analytics

### Available Analytics

- Revenue tracking (daily, weekly, monthly)
- Booking conversion rates
- User growth metrics
- Service popularity
- Cleaner performance metrics
- Geographic distribution

### Health Monitoring

Health check endpoint: `GET /health`

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-07-13T10:00:00.000Z",
  "environment": "production"
}
```

## 🔧 Configuration

### Database Configuration

Supports both PostgreSQL and Supabase:

```javascript
// PostgreSQL (recommended for production)
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

// Supabase (alternative)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
```

### Email Configuration

Supports various email providers:

```javascript
// Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // App-specific password
  }
});

// Custom SMTP
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support:
- Create an issue in the repository
- Email: support@CleanMatch.com
- Documentation: [API Docs](./docs/api.md)

## 🔮 Future Enhancements

- [ ] Real-time chat between customers and cleaners
- [ ] Mobile app API optimization
- [ ] Machine learning for better matching
- [ ] Multi-language support
- [ ] IoT device integration
- [ ] Advanced analytics dashboard
- [ ] Third-party calendar integration
- [ ] Automated quality assurance
- [ ] Dynamic pricing algorithm
- [ ] Loyalty program system
