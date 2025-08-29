# Comfort Life Membership System

## Overview

The CleanMatch platform now features the **Comfort Life Membership System** with three tiers: Moon, Star, and Sun. Each tier offers different service discount ranges and pricing options.

## Membership Tiers

### 🌙 Comfort Life Moon
- **Discount Range**: Services priced $18-$22
- **Service Discount**: 15% off eligible services
- **Target**: Budget-conscious customers seeking basic protection

### ⭐ Comfort Life Star
- **Discount Range**: Services priced $18-$32
- **Service Discount**: 20% off eligible services
- **Target**: Regular customers with moderate service needs

### ☀️ Comfort Life Sun
- **Discount Range**: Services priced $18-$45
- **Service Discount**: 25% off eligible services
- **Target**: Premium customers with comprehensive service needs

## Duration Options

Each tier offers 4 duration options with progressive discounts:

### 1 Month
- **Moon**: $36.90/month
- **Star**: $63.90/month
- **Sun**: $96.30/month

### 3 Months (10% plan discount)
- **Moon**: $99.63 (was $110.70)
- **Star**: $172.53 (was $191.70)
- **Sun**: $260.01 (was $288.90)

### 6 Months (15% plan discount)
- **Moon**: $188.19 (was $221.40)
- **Star**: $325.77 (was $383.40)
- **Sun**: $491.31 (was $577.80)

### 12 Months (20% plan discount)
- **Moon**: $354.24 (was $442.80)
- **Star**: $613.44 (was $766.80)
- **Sun**: $924.96 (was $1155.60)

## Payment Options

- **One-time Payment**: Pay once for the entire duration
- **Recurring Payment**: Automatic billing based on selected duration

## Features

### All Plans Include:
- Priority booking
- 24/7 customer support
- Service guarantee
- Flexible scheduling

### Additional Features by Tier:
- **Star**: Extended service range
- **Sun**: Premium service range + Concierge support

## Business Logic

### Discount Calculation
1. Check if service price falls within membership tier's discount range
2. Apply tier-specific percentage discount:
   - Moon: 15%
   - Star: 20%
   - Sun: 25%
3. Return discounted price or original price if outside range

### Membership Rules
- Users can upgrade between any plans
- Downgrade from annual to monthly is not allowed while annual plan is active
- Plan changes require canceling current membership and subscribing to new plan

## API Endpoints

### Get Plans
```http
GET /api/memberships/plans
```

### Subscribe to Plan
```http
POST /api/memberships/subscribe
{
  "tier": "moon_1_month",
  "isRecurring": false
}
```

### Calculate Service Discount
```http
POST /api/memberships/calculate-discount
{
  "membershipTier": "star_12_months",
  "servicePrice": 25.00
}
```

## Database Schema

### Memberships Table
- `tier`: VARCHAR - e.g., 'moon_1_month', 'star_12_months'
- `status`: VARCHAR - 'active', 'cancelled', 'expired'
- `auto_renewal`: BOOLEAN
- `start_date`: TIMESTAMP
- `end_date`: TIMESTAMP

## Frontend Implementation

### Key Components
1. **Tier Selector**: Choose between Moon, Star, Sun
2. **Duration Selector**: Choose 1, 3, 6, or 12 months
3. **Payment Toggle**: One-time vs Recurring
4. **Plan Details**: Dynamic display of selected plan features

### User Experience
- Visual tier indicators with icons and colors
- Clear pricing with original prices struck through for discounted plans
- Discount range clearly displayed
- Active membership status indicators
- Upgrade/downgrade restrictions clearly communicated

## Stripe Integration

### Price IDs Required
Each plan needs 2 Stripe Price IDs:
- One for recurring payments
- One for one-time payments

Example environment variables:
```
STRIPE_MOON_1_MONTH_RECURRING=price_moon_1_month_recurring
STRIPE_MOON_1_MONTH_ONETIME=price_moon_1_month_onetime
```

## Migration Notes

### From Previous System
- Old 'supersaver_month' and 'supersaver_year' plans are replaced
- Users with existing memberships should be migrated to equivalent new plans
- Update all references in booking and payment systems

### Database Migration
```sql
-- Add new membership tier support
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS tier_category VARCHAR(10);
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS duration_months INTEGER;

-- Update existing memberships
UPDATE memberships SET 
  tier_category = CASE 
    WHEN tier = 'supersaver_month' THEN 'moon'
    WHEN tier = 'supersaver_year' THEN 'moon'
    ELSE 'moon'
  END,
  duration_months = CASE 
    WHEN tier = 'supersaver_month' THEN 1
    WHEN tier = 'supersaver_year' THEN 12
    ELSE 1
  END;
```

## Testing

### Test Scenarios
1. Plan selection and tier switching
2. Duration changes within same tier
3. Upgrade/downgrade restrictions
4. Discount calculation for various service prices
5. Payment processing for both one-time and recurring
6. Membership status changes and renewals

### Discount Testing
Test with service prices:
- $15 (below all ranges)
- $20 (Moon range)
- $25 (Moon/Star range)
- $35 (Star/Sun range)
- $50 (Sun range only)
