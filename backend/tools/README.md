# Tools Directory

This directory contains development and monitoring tools for the CleanMatch backend.

## Monitoring Tools
- `db-monitor.js` - Database monitoring and health checks
- `debug-db.js` - Database debugging utilities
- `process-manager.js` - Process management for production

## Data Checking Tools
- `check-cleaners.js` - Validate cleaner data and profiles
- `check-users.js` - Validate user data and accounts

## Usage

Run tools from the backend root directory:

```bash
# Monitor database
npm run db:monitor

# Start with process manager
npm run start:pm

# Check data integrity
node tools/check-cleaners.js
node tools/check-users.js

# Debug database issues
node tools/debug-db.js
```

## Process Manager

The process manager (`process-manager.js`) provides:
- Automatic restart on crashes
- Memory monitoring
- Log management
- Health checks
- Graceful shutdown handling

Use it in production environments for better reliability and monitoring.
