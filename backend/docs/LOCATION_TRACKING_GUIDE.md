# Location-Based Cleaner Availability API Documentation

## Overview

This API provides real-time location tracking and nearby cleaner discovery functionality for the CleanMatch platform. It allows cleaners to share their location when going online and enables customers to find nearby available cleaners after making a payment.

## Database Schema Changes

### New Columns in `cleaner_profiles` Table

```sql
ALTER TABLE cleaner_profiles 
ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP,
ADD COLUMN IF NOT EXISTS location_accuracy DECIMAL(10, 2);
```

### Database Indexes

- `idx_cleaner_profiles_location` - For location-based queries
- `idx_cleaner_profiles_last_location_update` - For finding online users
- `online_cleaners` view - Pre-filtered view of online cleaners

## API Endpoints

### 1. Update Cleaner Availability with Location

**Endpoint:** `PUT /api/users/availability`
**Access:** Private (Cleaners only)
**Purpose:** Update cleaner availability status and location

#### Request Body
```json
{
  "isAvailable": true,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "locationAccuracy": 5.0
}
```

#### Response
```json
{
  "success": true,
  "message": "Availability enabled successfully",
  "data": {
    "isAvailable": true,
    "locationUpdated": true,
    "lastLocationUpdate": "2024-08-14T10:30:00.000Z"
  }
}
```

#### Business Logic
- When `isAvailable: true`, location (latitude/longitude) is required
- When `isAvailable: false`, location data is cleared for privacy
- `last_location_update` is set to current timestamp
- `last_active` is always updated
- Only cleaners online within the last 3 minutes are considered "online"

### 2. Get Nearby Available Cleaners

**Endpoint:** `GET /api/users/nearby-cleaners`
**Access:** Private (Customers only)
**Purpose:** Find available cleaners within a specified radius

#### Query Parameters
```
latitude: 40.7128 (required)
longitude: -74.0060 (required)
radius: 20 (optional, default: 20km)
serviceType: house_cleaning (optional)
minRating: 4.0 (optional, default: 0)
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "firstName": "John",
      "lastName": "Doe",
      "rating": 4.8,
      "totalJobs": 45,
      "hourlyRate": 25.00,
      "experienceYears": 3,
      "distanceKm": "2.5",
      "minutesSinceLastUpdate": 1,
      "isOnline": true,
      "location": {
        "latitude": 40.7200,
        "longitude": -74.0100,
        "lastUpdate": "2024-08-14T10:29:00.000Z"
      }
    }
  ],
  "searchCriteria": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radiusKm": 20,
    "serviceType": "all",
    "minRating": 0
  },
  "stats": {
    "within5km": 3,
    "within10km": 7,
    "within20km": 12,
    "total": 12
  },
  "message": "Found 12 available cleaners within 20km"
}
```

### 3. Get Nearby Cleaners for Specific Booking

**Endpoint:** `GET /api/bookings/:id/nearby-cleaners`
**Access:** Private (Customer or Admin)
**Purpose:** Get available cleaners for a paid booking

#### Query Parameters
```
latitude: 40.7128 (required)
longitude: -74.0060 (required)
radius: 20 (optional, default: 20km)
```

#### Response
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 456,
      "serviceName": "House Cleaning",
      "bookingDate": "2024-08-15",
      "bookingTime": "10:00",
      "durationHours": 3,
      "totalAmount": 75.00,
      "status": "confirmed",
      "address": "123 Main St"
    },
    "cleaners": [
      {
        "id": 123,
        "firstName": "John",
        "lastName": "Doe",
        "distanceKm": "2.5",
        "isOnline": true
      }
    ]
  },
  "searchCriteria": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radiusKm": 20
  },
  "stats": {
    "totalFound": 5,
    "within5km": 2,
    "within10km": 4,
    "onlineNow": 5
  }
}
```

#### Business Logic
- Requires payment_status = "completed"
- Shows cleaners within specified radius
- Ordered by distance, then rating, then total jobs

### 4. Get Online Cleaners Statistics

**Endpoint:** `GET /api/users/online-stats`
**Access:** Private
**Purpose:** Get overall statistics about online cleaners

#### Response
```json
{
  "success": true,
  "stats": {
    "totalOnlineCleaners": 25,
    "averageRating": 4.6,
    "highRatedCleaners": 18,
    "experiencedCleaners": 15,
    "mostRecentUpdateMinutes": 0.5
  },
  "message": "25 cleaners are currently online"
}
```

## Distance Calculation

The API uses the Haversine formula to calculate distances between coordinates:

```sql
(
  6371 * acos(
    cos(radians($1)) * cos(radians(cp.current_latitude)) *
    cos(radians(cp.current_longitude) - radians($2)) +
    sin(radians($1)) * sin(radians(cp.current_latitude))
  )
) AS distance_km
```

## Online Status Definition

A cleaner is considered "online" if:
- `is_available = true`
- `current_latitude` and `current_longitude` are not null
- `last_location_update > (CURRENT_TIMESTAMP - INTERVAL '3 minutes')`

## Privacy and Security

### Location Privacy
- Cleaner locations are cleared when they go offline
- Exact coordinates are only shown to customers with paid bookings
- Location accuracy is tracked but not exposed to customers

### Access Control
- Only cleaners can update their availability/location
- Only customers can search for nearby cleaners
- Booking-specific searches require payment completion
- All endpoints require authentication

## Error Handling

### Common Error Responses

```json
{
  "success": false,
  "error": "Location (latitude and longitude) is required when setting availability to true"
}
```

```json
{
  "success": false,
  "error": "Payment must be completed before viewing available cleaners",
  "paymentStatus": "pending"
}
```

## Usage Examples

### Frontend Implementation (JavaScript)

#### Update Cleaner Availability
```javascript
// Get user's location
navigator.geolocation.getCurrentPosition(async (position) => {
  const response = await fetch('/api/users/availability', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      isAvailable: true,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      locationAccuracy: position.coords.accuracy
    })
  });
  
  const result = await response.json();
  console.log('Availability updated:', result);
});
```

#### Find Nearby Cleaners
```javascript
const findNearbyCleaners = async (userLat, userLng, radius = 20) => {
  const response = await fetch(
    `/api/users/nearby-cleaners?latitude=${userLat}&longitude=${userLng}&radius=${radius}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  return result.data; // Array of nearby cleaners
};
```

## Migration Instructions

1. **Run the SQL migration:**
   ```bash
   # Connect to your database and run:
   psql -f backend/database/location-tracking.sql
   ```

2. **Or use the migration script:**
   ```bash
   cd backend
   node database/location-tracking-migration.js
   ```

3. **Verify the migration:**
   ```sql
   \d cleaner_profiles
   SELECT * FROM online_cleaners LIMIT 1;
   ```

## Performance Considerations

- Location queries use spatial indexes for fast performance
- The online_cleaners view pre-filters for active cleaners
- Distance calculations are optimized with proper indexing
- Results are limited to prevent excessive data transfer

## Future Enhancements

1. **Real-time Updates:** WebSocket integration for live location updates
2. **Geofencing:** Automatic availability updates based on service areas
3. **Route Optimization:** Find cleaners along optimal routes
4. **Predictive Availability:** ML-based availability predictions
5. **Location History:** Track cleaner movement patterns (with consent)
