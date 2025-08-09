# Enhanced Automated Cleaner Assignment System

## Overview

This document describes the enhanced automated cleaner assignment system that provides ZIP code-based matching with priority scoring, concurrent booking protection, and comprehensive admin override capabilities.

## Features

### 🎯 Core Features
- **ZIP Code Priority Matching**: Exact ZIP matches get highest priority, followed by area and regional matches
- **Automated Assignment**: Intelligent cleaner selection based on multiple factors
- **Concurrency Protection**: Row-level locking prevents double-bookings during high-traffic periods
- **Admin Override**: Manual assignment capabilities with reason tracking
- **Retry Mechanism**: Automatic and manual retry for failed assignments
- **Comprehensive Notifications**: Real-time updates to customers, cleaners, and admins

### 🔄 Assignment Priority Algorithm

The system uses a multi-factor scoring system (0-1000 points):

1. **ZIP Code Proximity (300 points max)** - Highest priority
   - Exact match: 300 points
   - Same area (3-digit prefix): 225 points  
   - Same region (2-digit prefix): 150 points
   - Different region: 75 points

2. **Workload Balance (200 points max)** - Prioritizes less busy cleaners
   - Fewer active jobs = higher score
   - Promotes fair distribution of work

3. **Performance Rating (150 points max)** - Quality assurance
   - Based on customer ratings (1-5 stars)

4. **Experience (100 points max)** - Professional competency
   - Years of cleaning experience

5. **Distance (100 points max)** - Geographic efficiency  
   - Closer cleaners get higher scores

6. **Recent Activity (50 points max)** - Engagement bonus
   - Recently active cleaners preferred

7. **Completion Rate (50 points max)** - Reliability metric
   - Historical job completion percentage

8. **Service Area Match (50 points max)** - Coverage bonus
   - Explicit service area definition bonus

## API Endpoints

### Customer Endpoints

#### Create Booking with Auto-Assignment
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": 1,
  "bookingDate": "2024-12-25",
  "bookingTime": "10:00",
  "durationHours": 3,
  "address": "123 Main St",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90210",
  "autoAssign": true,
  "specialInstructions": "Please use eco-friendly products"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Booking created and cleaner assigned successfully",
  "data": {
    "id": 123,
    "status": "confirmed",
    "cleaner_id": 45,
    "assignment_score": 847.5,
    "cleaner": {
      "name": "John Smith",
      "rating": 4.8,
      "phone": "+1-555-0123"
    }
  }
}
```

**Response (No Cleaner Available):**
```json
{
  "success": true,
  "message": "Booking created but pending cleaner assignment",
  "data": {
    "id": 123,
    "status": "pending_assignment",
    "reason": "no_cleaner_available"
  }
}
```

### Admin Override Endpoints

#### Manual Cleaner Assignment
```http
POST /api/bookings/123/assign
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "cleanerId": 67,
  "overrideReason": "Customer specifically requested this cleaner"
}
```

#### Retry Failed Auto-Assignment
```http
POST /api/bookings/123/retry-assignment
Authorization: Bearer <admin-token>
```

#### Get Assignment Status & Recommendations
```http
GET /api/bookings/123/assignment-status
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": 123,
    "status": "pending_assignment",
    "assignmentAttempts": 2,
    "location": {
      "zipCode": "90210",
      "address": "123 Main St"
    }
  },
  "availableActions": {
    "canRetryAssignment": true,
    "canManualAssign": true
  },
  "recommendations": [
    {
      "id": 45,
      "name": "Jane Doe",
      "priorityScore": 892.5,
      "zipMatch": "exact",
      "currentJobs": 1
    }
  ]
}
```

### Admin Analytics Endpoints

#### Assignment System Metrics
```http
GET /api/admin/assignment-metrics
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_bookings": 250,
      "assigned_bookings": 225,
      "pending_assignment": 15,
      "admin_assigned": 45,
      "avg_assignment_attempts": 1.2
    },
    "insights": {
      "assignmentSuccessRate": 90.0,
      "adminInterventionRate": 18.0,
      "areasNeedingAttention": 3
    },
    "zipCodePerformance": [
      {
        "zip_code": "90210",
        "total_bookings": 15,
        "assigned_bookings": 12,
        "assignment_success_rate": 80.0
      }
    ],
    "recommendations": [
      {
        "priority": "high",
        "category": "coverage", 
        "message": "3 ZIP codes have no available cleaners",
        "action": "Recruit cleaners in: 90211, 90212, 90213"
      }
    ]
  }
}
```

## Database Schema Changes

The system adds several new tables and columns:

### New Tables

#### `cleaner_service_areas`
```sql
CREATE TABLE cleaner_service_areas (
    id SERIAL PRIMARY KEY,
    cleaner_id INTEGER REFERENCES users(id),
    zip_code VARCHAR(10),
    zip_prefix VARCHAR(5),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Enhanced Existing Tables

#### `bookings` - New Columns
```sql
ALTER TABLE bookings ADD COLUMN assigned_at TIMESTAMP;
ALTER TABLE bookings ADD COLUMN assignment_attempts INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN assigned_by_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE bookings ADD COLUMN admin_override_reason TEXT;
```

#### `notifications` - Enhanced Metadata
```sql
ALTER TABLE notifications ADD COLUMN metadata JSONB;
```

#### `cleaner_profiles` - Performance Tracking
```sql
ALTER TABLE cleaner_profiles ADD COLUMN last_active TIMESTAMP;
ALTER TABLE cleaner_profiles ADD COLUMN completion_rate DECIMAL(5,2);
```

## Installation & Setup

### 1. Run Database Migration
```bash
cd backend
node database/run-enhanced-assignment-migration.js
```

### 2. Verify Installation
The migration script will automatically verify all components:
- ✅ Tables created
- ✅ Indexes added  
- ✅ Triggers installed
- ✅ Initial data populated

### 3. Monitor System Health
```bash
# Check assignment metrics
curl -H "Authorization: Bearer <admin-token>" \
     http://localhost:3000/api/admin/assignment-metrics

# View pending assignments
curl -H "Authorization: Bearer <admin-token>" \
     http://localhost:3000/api/admin/assignment-metrics | jq '.data.pendingAssignments'
```

## Configuration

### Environment Variables
```env
# Assignment Algorithm Tuning
MAX_ASSIGNMENT_ATTEMPTS=3
ASSIGNMENT_RETRY_DELAY=300000  # 5 minutes
AUTO_ASSIGN_BY_DEFAULT=true

# Notification Settings  
SEND_ASSIGNMENT_NOTIFICATIONS=true
ADMIN_ALERT_EMAIL=admin@cleanmatch.com

# Performance Settings
MAX_CONCURRENT_ASSIGNMENTS=10
ASSIGNMENT_TIMEOUT=30000  # 30 seconds
```

### Algorithm Parameters
You can fine-tune the priority scoring by modifying `utils/matchCleaner.js`:

```javascript
// Scoring weights (adjust as needed)
const SCORING_WEIGHTS = {
  ZIP_PROXIMITY: 300,    // Highest priority
  WORKLOAD_BALANCE: 200, // Fair distribution
  RATING: 150,          // Quality assurance
  EXPERIENCE: 100,      // Professional competency
  DISTANCE: 100,        // Geographic efficiency
  RECENT_ACTIVITY: 50,  // Engagement bonus
  COMPLETION_RATE: 50,  // Reliability
  SERVICE_AREA: 50      // Coverage bonus
};
```

## Monitoring & Maintenance

### Key Metrics to Monitor

1. **Assignment Success Rate** - Should stay above 85%
2. **Admin Intervention Rate** - Should stay below 20%
3. **Average Assignment Attempts** - Should stay below 1.5
4. **ZIP Code Coverage** - Monitor underserved areas

### Troubleshooting Common Issues

#### Low Assignment Success Rate
- Check cleaner availability schedules
- Review ZIP code coverage gaps
- Verify cleaner profile completeness

#### High Admin Intervention
- Review algorithm parameters
- Check for scheduling conflicts
- Ensure cleaner availability is up-to-date

#### Performance Issues
- Monitor database query performance
- Check for concurrent assignment deadlocks
- Review connection pool settings

### Maintenance Tasks

#### Weekly
- Review assignment metrics dashboard
- Check pending assignments requiring manual intervention
- Update cleaner service areas based on demand patterns

#### Monthly
- Analyze ZIP code coverage gaps
- Review and tune algorithm parameters
- Clean up old notification data
- Update cleaner completion rates

## Best Practices

### For Administrators

1. **Regular Monitoring**: Check assignment metrics daily
2. **Proactive Coverage**: Recruit cleaners in high-demand, low-coverage areas
3. **Quick Response**: Address pending assignments within 24 hours
4. **Data-Driven Decisions**: Use analytics to guide cleaner recruitment

### For Cleaners

1. **Keep Availability Updated**: Maintain accurate availability schedules
2. **Expand Service Areas**: Add additional ZIP codes to increase assignment opportunities  
3. **Maintain Quality**: High ratings improve assignment priority
4. **Stay Active**: Recent activity boosts assignment scoring

### For Customers

1. **Flexible Scheduling**: Off-peak hours have better cleaner availability
2. **Popular Areas**: Urban ZIP codes typically have more cleaner options
3. **Advance Booking**: Book 24-48 hours ahead for better assignment success

## Security Considerations

- All assignment operations use database transactions with row-level locking
- Admin override actions are logged with reason tracking
- Notification metadata is sanitized before storage
- Cleaner personal information is protected in recommendations

## Performance Optimization

- Database indexes on critical assignment query columns
- Connection pooling for concurrent assignment requests  
- Query optimization for large datasets
- Async processing for notification delivery

## Support & Troubleshooting

For issues with the assignment system:

1. Check the assignment metrics dashboard
2. Review server logs for assignment errors
3. Verify database connection and query performance
4. Contact technical support with specific booking IDs and error messages

---

*This enhanced assignment system provides scalable, efficient cleaner matching with comprehensive admin controls and detailed analytics for optimal service delivery.*
