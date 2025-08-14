# Complete Review and Rating System Documentation

## Overview

This document describes the comprehensive review and rating system implemented for the CleanMatch service marketplace platform. The system ensures only verified customers who have completed bookings can post reviews, while also providing admin functionality for creating marketing reviews.

## System Features

### 🔐 **Strict Validation & Security**
- Only customers with completed bookings can review their assigned cleaner
- One review per booking per customer (prevents duplicate reviews)
- Comprehensive validation on both frontend and backend
- JWT authentication required for all review operations
- Role-based authorization (customer/admin)

### ⭐ **Review Components**
- **Rating**: 1-5 stars (required)
- **Comment**: Optional text feedback (max 500 chars for customers, 1000 for admin)
- **Timestamp**: Automatic creation and update timestamps
- **Verification**: All legitimate reviews marked as verified
- **Visibility**: Reviews can be hidden by admins if needed

### 🛡️ **Admin Features**
- Create individual admin reviews for marketing purposes
- Bulk create multiple admin reviews for a cleaner
- Manage review visibility (show/hide)
- Delete inappropriate reviews
- Comprehensive admin dashboard with statistics
- Internal audit trail for all admin actions
- Admin-created reviews marked internally but appear normal publicly

## Database Schema

### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cleaner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  is_admin_created BOOLEAN DEFAULT FALSE,
  admin_created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_id, customer_id)
);
```

### Admin Review Audit Table
```sql
CREATE TABLE admin_review_audit (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cleaner Review Statistics View
```sql
CREATE VIEW cleaner_review_stats AS
SELECT 
  cleaner_id,
  COUNT(*) as total_reviews,
  AVG(rating)::DECIMAL(3,2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
  MAX(created_at) as latest_review_date
FROM reviews 
WHERE is_visible = true
GROUP BY cleaner_id;
```

## API Endpoints

### Public Endpoints

#### Get Cleaner Reviews
```http
GET /api/reviews/cleaner/:cleanerId?page=1&limit=10&sort=newest
```
- Returns paginated reviews for a cleaner
- Includes rating statistics and distribution
- Only shows visible reviews
- Sorting options: newest, oldest, highest, lowest

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent service!",
      "customer_name": "John D.",
      "service_name": "House Cleaning",
      "created_at": "2025-01-15T10:00:00Z",
      "is_verified": true
    }
  ],
  "stats": {
    "averageRating": 4.8,
    "totalReviews": 25,
    "distribution": {
      "5": 20,
      "4": 3,
      "3": 1,
      "2": 1,
      "1": 0
    }
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Customer Endpoints

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": 123,
  "rating": 5,
  "comment": "Great cleaning service!"
}
```

#### Check Review Eligibility
```http
GET /api/reviews/can-review/:bookingId
Authorization: Bearer <token>
```

#### Get My Reviews
```http
GET /api/reviews/my-reviews?page=1&limit=10
Authorization: Bearer <token>
```

#### Update Review
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review comment"
}
```

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

### Admin Endpoints

#### Admin Dashboard
```http
GET /api/reviews/admin/dashboard
Authorization: Bearer <admin-token>
```

Returns comprehensive statistics including:
- Total reviews (customer vs admin created)
- Average ratings
- Recent admin actions
- Top admin-reviewed cleaners

#### Create Admin Review
```http
POST /api/reviews/admin/create
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "cleanerId": 456,
  "rating": 5,
  "comment": "Professional and thorough cleaning",
  "customerName": "Sarah Johnson",
  "serviceName": "Deep Cleaning",
  "adminNotes": "Created for marketing campaign"
}
```

#### Bulk Create Admin Reviews
```http
POST /api/reviews/admin/bulk-create
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "cleanerId": 456,
  "adminNotes": "Bulk created for new cleaner promotion",
  "reviews": [
    {
      "rating": 5,
      "comment": "Amazing attention to detail!",
      "customerName": "Mike Wilson"
    },
    {
      "rating": 4,
      "comment": "Very professional service",
      "customerName": "Lisa Chen"
    }
  ]
}
```

#### Get All Reviews (Admin)
```http
GET /api/reviews/admin/all?page=1&limit=20&cleanerId=456&rating=5&visible=true
Authorization: Bearer <admin-token>
```

#### Get Admin-Created Reviews
```http
GET /api/reviews/admin/admin-reviews?page=1&limit=20
Authorization: Bearer <admin-token>
```

#### Toggle Review Visibility
```http
PUT /api/reviews/admin/:id/toggle-visibility
Authorization: Bearer <admin-token>
```

#### Delete Review (Admin)
```http
DELETE /api/reviews/admin/:id
Authorization: Bearer <admin-token>
```

## Frontend Components

### CleanerReviews Component
Located: `frontend/src/components/reviews/EnhancedCleanerReviews.jsx`

**Features:**
- Displays review statistics with visual rating distribution
- Paginated review list with sorting options
- Star rating visualization
- Responsive design
- Loading states and error handling

**Usage:**
```jsx
import CleanerReviews from '../components/reviews/EnhancedCleanerReviews';

<CleanerReviews 
  cleanerId={cleanerId}
  showAddReview={true}
  onAddReview={() => setShowReviewForm(true)}
  showTitle={true}
/>
```

### ReviewForm Component
Located: `frontend/src/components/reviews/ReviewForm.jsx`

**Features:**
- Interactive star rating selection
- Character-limited comment field
- Review eligibility checking
- Form validation and submission
- Success/error feedback

### AdminReviewManagement Component
Located: `frontend/src/components/admin/AdminReviewManagement.jsx`

**Features:**
- Comprehensive admin dashboard with statistics
- Tabbed interface (Dashboard, All Reviews, Admin Reviews)
- Individual and bulk admin review creation
- Review management (show/hide, delete)
- Recent admin actions tracking
- Real-time statistics updates

**Usage in Admin Panel:**
```jsx
import AdminReviewManagement from '../components/admin/AdminReviewManagement';

<AdminReviewManagement />
```

## Validation Rules

### Customer Reviews
- **booking_id**: Must be valid completed booking belonging to customer
- **rating**: Required integer between 1-5
- **comment**: Optional, max 500 characters
- **uniqueness**: One review per booking per customer

### Admin Reviews
- **cleaner_id**: Must be valid active cleaner
- **rating**: Required integer between 1-5
- **comment**: Optional, max 1000 characters
- **customer_name**: Optional, max 100 characters
- **service_name**: Optional, max 100 characters
- **admin_notes**: Optional, max 500 characters (internal only)

### Bulk Admin Reviews
- **cleaner_id**: Required valid cleaner ID
- **reviews**: Array of 1-20 review objects
- **admin_notes**: Optional global notes for all reviews

## Security Considerations

### Authentication & Authorization
- All endpoints require valid JWT tokens
- Role-based access control (customer/admin)
- Admin endpoints restricted to admin users only

### Data Validation
- Server-side validation using Joi schemas
- SQL injection prevention through parameterized queries
- XSS protection through input sanitization

### Review Integrity
- Booking completion verification before review creation
- Prevention of duplicate reviews per booking
- Audit trail for all admin actions

### Privacy
- Customer names partially obscured in public display
- Admin notes never exposed to public
- Synthetic customer accounts for admin reviews

## Performance Optimizations

### Database Indexes
- Optimized queries with strategic indexes on:
  - cleaner_id + is_visible (public review lookup)
  - booking_id (review eligibility checking)
  - created_at (chronological sorting)
  - rating (rating-based filtering)

### Caching Strategy
- Rating statistics cached in cleaner profiles
- Automatic cache invalidation on review changes
- Database views for complex aggregations

### Pagination
- All list endpoints support pagination
- Configurable page sizes
- Optimized count queries

## Monitoring & Analytics

### Admin Dashboard Metrics
- Total reviews (customer vs admin created)
- Average platform rating
- Review distribution (1-5 stars)
- Recent admin actions
- Top admin-reviewed cleaners

### Audit Trail
- All admin actions logged with:
  - Action type (create, update, delete, toggle_visibility)
  - Old and new values (JSON)
  - Reason/notes
  - Timestamp and admin user

## Deployment Considerations

### Database Migration
Run the database enhancement script:
```bash
cd backend
node database/enhance-reviews-system.js
```

### Environment Variables
Ensure proper database configuration in `.env`:
```env
DATABASE_URL=postgresql://user:pass@host:port/db
NODE_ENV=production # for SSL configuration
```

### Integration Testing
Test all endpoints with various user roles and edge cases:
- Review creation validation
- Admin functionality
- Public review display
- Rating calculations

## Future Enhancements

### Potential Improvements
1. **Review Responses**: Allow cleaners to respond to reviews
2. **Photo Reviews**: Support image uploads with reviews
3. **Review Templates**: Predefined review templates for admin use
4. **Advanced Analytics**: More detailed review analytics and reporting
5. **Review Moderation**: Automated content filtering and moderation
6. **Review Incentives**: Rewards for customers who leave reviews
7. **Multi-language Support**: Internationalization for review content

### API Versioning
Current implementation is v1. Future versions should maintain backward compatibility or provide clear migration paths.

---

This review system provides a robust, secure, and scalable solution for managing customer reviews and ratings in the CleanMatch platform while maintaining data integrity and enabling effective marketing through admin-created reviews.
