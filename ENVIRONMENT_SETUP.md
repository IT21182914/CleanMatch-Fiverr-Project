# Environment Configuration Guide

This project supports both **local** and **hosted/production** environments with easy switching.

## 🔧 Environment Files

### Frontend
- `.env` - Current active environment
- `.env.local` - Local development (connects to localhost:5000)
- `.env.production` - Production/hosted environment (connects to Heroku)

### Backend
- `.env` - Current active environment
- `.env.local` - Local development setup
- `.env.production` - Production/hosted setup with CORS for Heroku

## 🚀 Quick Switch Commands

### Method 1: Using the Switch Script (Recommended)
```bash
# Switch to local development
switch-env.bat local

# Switch to production/hosted
switch-env.bat production
```

### Method 2: Using npm scripts
```bash
# Frontend
cd frontend
npm run dev:local        # Run with local backend
npm run dev:production   # Run with hosted backend

# Backend
cd backend
npm run dev:local        # Run with local configuration
npm run dev:production   # Run with hosted configuration
```

### Method 3: Manual Copy (PowerShell)
```powershell
# Switch to local
Copy-Item "frontend\.env.local" "frontend\.env" -Force
Copy-Item "backend\.env.local" "backend\.env" -Force

# Switch to production
Copy-Item "frontend\.env.production" "frontend\.env" -Force
Copy-Item "backend\.env.production" "backend\.env" -Force
```

## 🌐 Environment Configurations

### Local Development
- **Frontend**: Connects to `http://localhost:5000/api`
- **Backend**: Accepts requests from `http://localhost:5173`
- **Database**: Same Supabase instance
- **NODE_ENV**: `development`

### Production/Hosted
- **Frontend**: Connects to `https://young-cliffs-57962-dbd5fa993e19.herokuapp.com/api`
- **Backend**: Accepts requests from local frontend + hosted URLs
- **Database**: Same Supabase instance
- **NODE_ENV**: `production`

## 📝 Current Settings

Check your current environment:
```bash
# Frontend API URL
type frontend\.env | findstr VITE_API_URL

# Backend environment
type backend\.env | findstr NODE_ENV
```

## 🔄 Typical Workflow

1. **Local Development**: Use `switch-env.bat local` when developing locally
2. **Testing with Hosted Backend**: Use `switch-env.bat production` to test against the hosted API
3. **Before Deployment**: Ensure production settings are correct

## ⚠️ Important Notes

- The switch script copies the environment-specific files to `.env`
- Always commit `.env.local` and `.env.production` but NOT `.env` files
- Restart your development servers after switching environments
- The hosted backend URL is: `https://young-cliffs-57962-dbd5fa993e19.herokuapp.com/`
