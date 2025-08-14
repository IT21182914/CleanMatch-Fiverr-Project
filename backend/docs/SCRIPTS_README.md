# Scripts Directory

This directory contains setup, seeding, and utility scripts for the CleanMatch backend.

## Setup Scripts
- `setup.js` - Main project setup script
- `setup-offers.js` - Setup service offers
- `setup-supabase-storage.js` - Configure Supabase storage
- `setup-trust.js` - Setup trust and safety features

## Database Scripts
- `seed.js` - Seed the database with initial data

## Admin Scripts
- `create-admin.js` - Create admin users
- `create-sample-documents.js` - Create sample documents for testing
- `create-test-freelancers.js` - Create test freelancer accounts
- `create-trust-setup.js` - Setup trust and verification system

## Usage

Run scripts from the backend root directory:

```bash
# Setup the project
npm run setup

# Seed the database
npm run seed

# Setup storage
npm run setup:storage

# Create admin user
node scripts/create-admin.js

# Create test data
node scripts/create-test-freelancers.js
```
