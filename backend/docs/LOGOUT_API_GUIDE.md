# Logout API Documentation

## Overview
The CleanMatch application now includes a robust logout API that properly invalidates user sessions both on the client and server side. This implementation ensures enhanced security by blacklisting tokens and preventing their reuse after logout.

## Features

### 1. Individual Device Logout (`/api/auth/logout`)
- **Method**: `POST`
- **Access**: Private (requires authentication)
- **Purpose**: Logs out the user from the current device/session

**Request:**
```javascript
POST /api/auth/logout
Headers: {
  Authorization: 'Bearer <jwt_token>'
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Logout successful"
}
```

### 2. All Devices Logout (`/api/auth/logout-all`)
- **Method**: `POST`
- **Access**: Private (requires authentication)
- **Purpose**: Logs out the user from all devices by invalidating all existing tokens

**Request:**
```javascript
POST /api/auth/logout-all
Headers: {
  Authorization: 'Bearer <jwt_token>'
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Successfully logged out from all devices"
}
```

## Security Implementation

### Token Blacklisting
1. **Individual Token Blacklisting**: When a user logs out, their specific JWT token is added to a blacklist table
2. **Mass Token Invalidation**: The `logout-all` endpoint sets a `token_invalidation_date` on the user record, making all tokens issued before this date invalid
3. **Automatic Cleanup**: Expired blacklisted tokens are automatically cleaned up hourly via a cron job

### Database Schema

#### Token Blacklist Table
```sql
CREATE TABLE token_blacklist (
  id SERIAL PRIMARY KEY,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  reason VARCHAR(50) DEFAULT 'logout' CHECK (reason IN ('logout', 'password_reset', 'account_suspended'))
);
```

#### Users Table Additions
```sql
ALTER TABLE users 
ADD COLUMN token_invalidation_date TIMESTAMP,
ADD COLUMN last_logout_at TIMESTAMP;
```

## Middleware Enhancement

The authentication middleware now checks for:
1. **Token Blacklist**: Verifies if the token is in the blacklist table
2. **Mass Invalidation**: Checks if the token was issued before the user's `token_invalidation_date`
3. **User Status**: Ensures the user account is still active

```javascript
// Enhanced auth middleware flow:
1. Extract token from Authorization header
2. Check if token is blacklisted
3. Verify JWT signature and decode
4. Check if user exists and is active
5. Check if token was issued before mass invalidation date
6. Attach user and token to request object
```

## Frontend Integration

### AuthContext Enhancement
The frontend `AuthContext` has been updated to:
1. Call the logout API before clearing local storage
2. Handle both individual and mass logout scenarios
3. Gracefully handle API failures while still clearing client-side data

```javascript
// Updated logout function
const logout = async (fromAllDevices = false) => {
  try {
    const endpoint = fromAllDevices ? "/api/auth/logout-all" : "/api/auth/logout";
    await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    // Continue with client-side cleanup even if API fails
  }
  
  // Clear all client-side storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
  // ... clear sessionStorage as well
};
```

## Background Tasks

### Automatic Token Cleanup
A scheduled job runs every hour to clean up expired blacklisted tokens:
```javascript
// Runs at minute 0 of every hour
cron.schedule("0 * * * *", cleanupExpiredTokens);
```

## Error Handling

### Common Error Responses

**401 Unauthorized - Invalid Token:**
```javascript
{
  "error": "Token has been invalidated. Please log in again."
}
```

**401 Unauthorized - No Token:**
```javascript
{
  "error": "Access denied. No token provided."
}
```

**401 Unauthorized - User Deactivated:**
```javascript
{
  "error": "Account is deactivated."
}
```

## Testing

The implementation includes comprehensive tests:

1. **Basic Logout Test**: Verifies individual token invalidation
2. **Logout All Devices Test**: Verifies mass token invalidation
3. **Edge Cases**: Tests for expired tokens, invalid tokens, etc.

### Running Tests
```bash
cd backend
node tests/test-logout-basic.js
```

## Security Benefits

1. **Server-Side Token Invalidation**: Tokens are invalidated on the server, not just client-side
2. **Immediate Effect**: Blacklisted tokens are rejected immediately
3. **Mass Logout Capability**: Users can log out from all devices for security
4. **Automatic Cleanup**: No database bloat from expired blacklist entries
5. **Audit Trail**: Logout events are tracked with timestamps

## Usage Examples

### Regular Logout (Frontend)
```javascript
// Using the logout button
const handleLogout = () => {
  logout(); // Calls API and clears storage
  navigate("/");
};
```

### Logout All Devices (Frontend)
```javascript
// For security settings page
const handleLogoutAllDevices = () => {
  logout(true); // fromAllDevices = true
  navigate("/login");
};
```

### Manual API Calls
```javascript
// Individual logout
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }
});

// Logout from all devices
await fetch('/api/auth/logout-all', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }
});
```

## Performance Considerations

1. **Indexed Lookups**: Token hash lookups use database indexes for fast performance
2. **Efficient Cleanup**: Automated cleanup prevents database bloat
3. **Minimal Overhead**: Token validation adds minimal latency to requests
4. **Caching Considerations**: Blacklist checks are performed on each request

## Future Enhancements

Potential future improvements:
1. **Redis Cache**: Cache blacklisted tokens for faster lookups
2. **Token Refresh Blacklisting**: Also blacklist refresh tokens
3. **Geographic Logout**: Log out sessions from specific geographic regions
4. **Session Management UI**: Admin interface for managing user sessions
