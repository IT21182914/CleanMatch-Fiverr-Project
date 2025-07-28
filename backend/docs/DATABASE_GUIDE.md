# CleanMatch Backend - Database Connection & Deployment Guide

## Overview
This guide provides solutions for maintaining stable database connections in production environments, especially for platforms like Render, Heroku, and other cloud providers.

## Key Improvements Made

### 1. Enhanced Database Connection (`config/database.js`)
- **Connection Pooling**: Optimized pool settings with proper timeouts
- **Automatic Reconnection**: Handles connection failures and automatically reconnects
- **Connection Monitoring**: Health checks every 30 seconds
- **Graceful Error Handling**: Retries failed queries up to 3 times
- **IPv6 Support**: Improved compatibility with cloud providers

### 2. Process Management (`process-manager.js`)
- **Automatic Restarts**: Restarts server on unexpected crashes
- **Restart Limits**: Max 5 restarts to prevent infinite loops
- **Graceful Shutdown**: Handles SIGINT and SIGTERM signals properly
- **Health Monitoring**: Resets restart count after stable operation

### 3. Database Monitoring (`db-monitor.js`)
- **Real-time Connection Monitoring**: Checks database health every 10 seconds
- **Connection Diagnostics**: Shows server time and database version
- **Standalone Tool**: Can be run independently for debugging

## Usage

### Development
```bash
# Start development server with hot reload
npm run dev

# Monitor database connection
npm run db:monitor

# Check database health once
npm run db:health
```

### Production
```bash
# Standard start (recommended for most deployments)
npm start

# Start with process manager (for environments without PM2)
npm run start:pm
```

## Environment Variables

### Required
```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=5000
NODE_ENV=production
```

### Optional (for enhanced features)
```env
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ENABLE_CRON_JOBS=true
```

## Database Connection Settings

The connection pool is configured with:
- **Max Connections**: 20
- **Connection Timeout**: 10 seconds
- **Idle Timeout**: 30 seconds
- **Keep-Alive**: Enabled
- **SSL**: Required with `rejectUnauthorized: false`

## Deployment Platforms

### Render
1. Set `NODE_ENV=production`
2. Configure `DATABASE_URL` in environment variables
3. Use `npm start` as the start command
4. Enable health checks at `/health`

### Heroku
1. Install Heroku Postgres addon
2. Set environment variables through Heroku dashboard
3. Use `npm start` in Procfile
4. Enable health checks

### Railway
1. Connect PostgreSQL database
2. Set environment variables
3. Use `npm start` command
4. Configure health check endpoint

## Health Check Endpoint

The `/health` endpoint provides comprehensive status information:

```json
{
  "status": "OK",
  "timestamp": "2025-07-17T18:54:02.602Z",
  "environment": "production",
  "version": "1.0.0",
  "uptime": 123.45,
  "memory": {
    "rss": 45678912,
    "heapTotal": 23456789,
    "heapUsed": 12345678
  },
  "database": {
    "status": "healthy",
    "connected": true
  }
}
```

## Troubleshooting

### Common Issues

1. **ENETUNREACH Error**
   - Usually caused by IPv6 connectivity issues
   - Ensure DATABASE_URL uses IPv4 address or hostname
   - Check firewall and security group settings

2. **Connection Timeout**
   - Increase `connectionTimeoutMillis` in database config
   - Verify database server is accessible
   - Check if database is behind a firewall

3. **SSL Certificate Issues**
   - Ensure `ssl: { rejectUnauthorized: false }` is set
   - For production, use proper SSL certificates

4. **Pool Exhaustion**
   - Monitor connection pool usage
   - Adjust `max` connections in pool config
   - Ensure connections are properly released

### Debug Commands

```bash
# Test database connection
npm run db:health

# Monitor connection continuously
npm run db:monitor

# Check server logs
npm start

# Test with process manager
npm run start:pm
```

## Production Checklist

- [ ] Database connection string configured
- [ ] Environment variables set
- [ ] SSL certificates configured
- [ ] Health check endpoint working
- [ ] Connection pooling optimized
- [ ] Monitoring and alerting set up
- [ ] Backup and recovery plan in place
- [ ] Security measures implemented

## Monitoring

The system provides several monitoring capabilities:

1. **Health Check**: `/health` endpoint for load balancer checks
2. **Database Monitor**: Real-time connection monitoring
3. **Process Manager**: Automatic restart on failures
4. **Connection Pool Events**: Detailed logging of pool activity

## Performance Optimization

- Connection pooling with optimal pool size
- Query retry mechanism for transient failures
- Proper connection lifecycle management
- Memory usage monitoring
- Automatic cleanup of idle connections

## Security Considerations

- SSL/TLS encryption for database connections
- Environment variable protection
- Connection string security
- Regular security updates
- Proper error handling without exposing sensitive information
