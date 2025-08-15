# Real-Time Location Tracking for CleanMatch

This feature adds real-time location tracking for cleaners and proximity-based matching for customers who have completed payments.

## 🚀 Quick Start

### 1. Run Database Migration

```bash
# Option 1: Run SQL directly
psql -d your_database -f backend/database/location-tracking.sql

# Option 2: Use migration script (when database is connected)
cd backend
node database/location-tracking-migration.js
```

### 2. Test the API

```bash
# Install dependencies if needed
npm install axios

# Run tests (update tokens first)
node tests/test-location-api.js
```

## 🎯 Key Features

### For Cleaners
- **Location Sharing**: Share real-time location when going online
- **Privacy Protection**: Location automatically cleared when going offline
- **Online Status**: Automatic detection of online status (active within 3 minutes)
- **Service Radius**: Define service area for better matching

### For Customers
- **Nearby Search**: Find available cleaners within customizable radius (5km, 20km, 30km)
- **Post-Payment Access**: View nearby cleaners only after payment completion
- **Real-Time Data**: See cleaners online now vs recently active
- **Distance Sorting**: Results sorted by proximity, rating, and experience

### For Admin
- **Online Statistics**: Real-time dashboard of active cleaners
- **System Monitoring**: Track location update frequency and system health

## 📱 API Usage Examples

### Cleaner Goes Online
```javascript
// Cleaner shares location when going online
fetch('/api/users/availability', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer cleaner_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    isAvailable: true,
    latitude: 40.7128,
    longitude: -74.0060,
    locationAccuracy: 5.0
  })
})
```

### Customer Finds Nearby Cleaners
```javascript
// Option 1: Search by coordinates
fetch('/api/users/nearby-cleaners?latitude=40.7128&longitude=-74.0060&radius=20', {
  headers: { 'Authorization': 'Bearer customer_token' }
})

// Option 2: Search by zipcode (with automatic geocoding)
fetch('/api/users/nearby-cleaners?zipCode=07094&radius=20', {
  headers: { 'Authorization': 'Bearer customer_token' }
})
.then(res => res.json())
.then(data => {
  console.log(`Found ${data.data.length} cleaners nearby`);
  console.log(`Geocoded ${data.searchCriteria.originalZipCode} to: ${data.searchCriteria.geocodedAddress}`);
  data.data.forEach(cleaner => {
    console.log(`${cleaner.firstName}: ${cleaner.distanceKm}km away`);
  });
});
```

### Booking-Specific Search
```javascript
// Search for cleaners for a specific paid booking (supports both methods)
fetch('/api/bookings/123/nearby-cleaners?zipCode=10001&radius=15', {
  headers: { 'Authorization': 'Bearer customer_token' }
})
// OR
fetch('/api/bookings/123/nearby-cleaners?latitude=40.7128&longitude=-74.0060&radius=15', {
  headers: { 'Authorization': 'Bearer customer_token' }
})
```

## 🔒 Security & Privacy

### Location Privacy
- Cleaner locations are only stored when they're actively online
- Locations are automatically cleared when cleaners go offline
- Exact coordinates only visible to customers with paid bookings
- Location accuracy is tracked but not exposed to customers

### Access Control
- Only authenticated cleaners can update their availability/location
- Only authenticated customers can search for nearby cleaners
- Booking-specific searches require payment completion
- Admin endpoints require admin privileges

## 🗄️ Database Schema

### New Columns Added to `cleaner_profiles`
```sql
current_latitude     DECIMAL(10, 8)  -- Current latitude (cleared when offline)
current_longitude    DECIMAL(11, 8)  -- Current longitude (cleared when offline)
last_location_update TIMESTAMP       -- When location was last updated
location_accuracy    DECIMAL(10, 2)  -- GPS accuracy in meters
```

### New Indexes for Performance
```sql
-- For location-based queries
idx_cleaner_profiles_location
-- For finding recent online users
idx_cleaner_profiles_last_location_update
```

### Online Cleaners View
```sql
CREATE VIEW online_cleaners AS
SELECT cp.*, u.first_name, u.last_name, u.email, u.phone
FROM cleaner_profiles cp
JOIN users u ON cp.user_id = u.id
WHERE cp.is_available = true 
  AND cp.last_location_update > (CURRENT_TIMESTAMP - INTERVAL '3 minutes')
  AND cp.current_latitude IS NOT NULL;
```

## 📊 Distance Calculation

Uses the Haversine formula for accurate distance calculation:
```sql
6371 * acos(
  cos(radians(lat1)) * cos(radians(lat2)) *
  cos(radians(lng2) - radians(lng1)) +
  sin(radians(lat1)) * sin(radians(lat2))
) AS distance_km
```

## 🎮 Frontend Integration

### React/Vue Example
```javascript
// Hook for cleaner availability
const useCleanerAvailability = () => {
  const [isOnline, setIsOnline] = useState(false);
  
  const goOnline = async () => {
    const position = await getCurrentPosition();
    const response = await updateAvailability({
      isAvailable: true,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      locationAccuracy: position.coords.accuracy
    });
    setIsOnline(response.data.isAvailable);
  };
  
  const goOffline = async () => {
    await updateAvailability({ isAvailable: false });
    setIsOnline(false);
  };
  
  return { isOnline, goOnline, goOffline };
};

// Hook for finding nearby cleaners
const useNearbyCleaners = (userLocation, radius = 20) => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const searchNearby = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/nearby-cleaners?latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius=${radius}`
      );
      const data = await response.json();
      setCleaners(data.data);
    } finally {
      setLoading(false);
    }
  };
  
  return { cleaners, loading, searchNearby };
};
```

## 🔧 Configuration

### Environment Variables
```env
# Google Geocoding API for zipcode conversion
GOOGLE_GEO_API_KEY=your_google_geocoding_api_key

# Minimum location accuracy required (meters)
MIN_LOCATION_ACCURACY=50

# Online status timeout (minutes)
ONLINE_TIMEOUT_MINUTES=3

# Maximum search radius (km)
MAX_SEARCH_RADIUS=50

# Default search radius (km)
DEFAULT_SEARCH_RADIUS=20
```

### Google Geocoding API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Geocoding API"
4. Create API credentials (API key)
5. Add the API key to your `.env` file as `GOOGLE_GEO_API_KEY`
6. (Optional) Restrict the API key to your server's IP address

## 📈 Performance Optimization

### Query Optimization
- Spatial indexes on location columns
- Filtered indexes for online cleaners only
- View-based pre-filtering for common queries
- Limited result sets to prevent large data transfers

### Caching Strategy
- Redis cache for frequently accessed online cleaner lists
- TTL-based cache invalidation (30 seconds)
- Location-based cache keys for geographic regions

## 🧪 Testing

### Unit Tests
```bash
# Run location-specific tests
npm test -- --grep "location"

# Run integration tests
npm run test:integration
```

### Manual Testing Checklist
- [ ] Cleaner can go online with location
- [ ] Cleaner location cleared when going offline
- [ ] Customer can find nearby cleaners
- [ ] Distance calculations are accurate
- [ ] Payment required for booking-specific searches
- [ ] Online status updates within 3 minutes
- [ ] Privacy: offline cleaners not in results

## 🚨 Troubleshooting

### Common Issues

**1. No cleaners found**
- Check if cleaners are online (last_location_update within 3 minutes)
- Verify search radius is appropriate
- Ensure location permissions granted

**2. Inaccurate distances**
- Verify latitude/longitude format (decimal degrees)
- Check coordinate system (WGS84)
- Validate Haversine formula implementation

**3. Location not updating**
- Check GPS accuracy and permissions
- Verify network connectivity
- Check server-side location validation

### Debug Queries
```sql
-- Check online cleaners
SELECT * FROM online_cleaners;

-- Check location updates
SELECT user_id, last_location_update, 
       EXTRACT(EPOCH FROM (NOW() - last_location_update))/60 as minutes_ago
FROM cleaner_profiles 
WHERE current_latitude IS NOT NULL
ORDER BY last_location_update DESC;

-- Test distance calculation
SELECT calculate_distance(40.7128, -74.0060, 40.7589, -73.9851) as distance_km;
```

## 🔮 Future Enhancements

### Planned Features
1. **Real-time WebSocket Updates**: Live location streaming
2. **Geofencing**: Automatic availability based on service areas
3. **Route Optimization**: Find cleaners along optimal routes
4. **Predictive Availability**: ML-based availability predictions
5. **Location History**: Track movement patterns (with consent)

### Scalability Considerations
- Database sharding by geographic regions
- CDN for location-based static content
- Message queues for high-volume location updates
- Read replicas for search-heavy workloads

## 📞 Support

For technical support or questions:
- Check the [API Documentation](./docs/LOCATION_TRACKING_GUIDE.md)
- Review [Database Schema](./database/location-tracking.sql)
- Run [Test Suite](./tests/test-location-api.js)
- Contact: backend-support@cleanmatch.com
