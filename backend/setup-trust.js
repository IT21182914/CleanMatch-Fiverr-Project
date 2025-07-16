
const { Pool } = require('pg');
const config = require('./config/database');

const trustBadges = [
  {
    "name": "Better Business Bureau A+",
    "description": "Accredited business with A+ rating from the Better Business Bureau",
    "type": "certification",
    "icon_url": "/images/badges/bbb-logo.png",
    "display_order": 1,
    "is_active": true
  },
  {
    "name": "Bonded & Insured",
    "description": "All our cleaners are bonded and insured for your protection",
    "type": "guarantee",
    "icon_url": "/images/badges/bonded-insured.png",
    "display_order": 2,
    "is_active": true
  },
  {
    "name": "Background Checked",
    "description": "Comprehensive background checks on all cleaning professionals",
    "type": "guarantee",
    "icon_url": "/images/badges/background-check.png",
    "display_order": 3,
    "is_active": true
  },
  {
    "name": "Satisfaction Guarantee",
    "description": "100% satisfaction guarantee or we'll make it right",
    "type": "guarantee",
    "icon_url": "/images/badges/satisfaction-guarantee.png",
    "display_order": 4,
    "is_active": true
  },
  {
    "name": "As Seen on Local News",
    "description": "Featured on ABC7, NBC4, and CBS2 for exceptional service",
    "type": "media",
    "icon_url": "/images/badges/media-coverage.png",
    "display_order": 5,
    "is_active": true
  },
  {
    "name": "HomeAdvisor Elite Service",
    "description": "Top-rated cleaning service on HomeAdvisor platform",
    "type": "award",
    "icon_url": "/images/badges/homeadvisor-elite.png",
    "display_order": 6,
    "is_active": true
  },
  {
    "name": "Angie's List Super Service Award",
    "description": "Winner of Angie's List Super Service Award 2023",
    "type": "award",
    "icon_url": "/images/badges/angies-list-award.png",
    "display_order": 7,
    "is_active": true
  },
  {
    "name": "Green Cleaning Certified",
    "description": "Certified in eco-friendly and non-toxic cleaning methods",
    "type": "certification",
    "icon_url": "/images/badges/green-certified.png",
    "display_order": 8,
    "is_active": true
  }
];
const testimonials = [
  {
    "customer_name": "Sarah Johnson",
    "content": "CleanMatch found me the perfect cleaner! Maria has been cleaning my home for 6 months now and she's absolutely wonderful. Always on time, thorough, and my house sparkles when she's done.",
    "rating": 5,
    "service_type": "Regular Cleaning",
    "location": "Brooklyn, NY",
    "is_featured": true,
    "created_at": "2024-01-15T00:00:00.000Z"
  },
  {
    "customer_name": "Michael Chen",
    "content": "I was skeptical about hiring a cleaning service, but CleanMatch made it so easy. The cleaner they matched me with, Rosa, is trustworthy and does an amazing job. Highly recommend!",
    "rating": 5,
    "service_type": "Deep Cleaning",
    "location": "Manhattan, NY",
    "is_featured": true,
    "created_at": "2024-01-20T00:00:00.000Z"
  },
  {
    "customer_name": "Emily Davis",
    "content": "Best decision ever! My cleaner Ana is like family now. She takes such good care of my home and I can always count on her. The booking process was seamless.",
    "rating": 5,
    "service_type": "Move-in Cleaning",
    "location": "Queens, NY",
    "is_featured": true,
    "created_at": "2024-02-01T00:00:00.000Z"
  },
  {
    "customer_name": "David Rodriguez",
    "content": "CleanMatch saved my sanity! As a busy dad, I needed help keeping the house clean. The cleaner they found, Carmen, is incredible with kids and pets. Couldn't be happier.",
    "rating": 5,
    "service_type": "Family Home Cleaning",
    "location": "Bronx, NY",
    "is_featured": true,
    "created_at": "2024-02-10T00:00:00.000Z"
  },
  {
    "customer_name": "Jennifer Wilson",
    "content": "Professional, reliable, and thorough. My office building has never looked better since we started using CleanMatch. The team they provided is fantastic.",
    "rating": 5,
    "service_type": "Commercial Cleaning",
    "location": "Staten Island, NY",
    "is_featured": false,
    "created_at": "2024-02-15T00:00:00.000Z"
  },
  {
    "customer_name": "Robert Thompson",
    "content": "I've tried other cleaning services before, but none compare to what CleanMatch offers. Great communication, fair pricing, and exceptional cleaning quality.",
    "rating": 5,
    "service_type": "Apartment Cleaning",
    "location": "Manhattan, NY",
    "is_featured": false,
    "created_at": "2024-02-20T00:00:00.000Z"
  },
  {
    "customer_name": "Lisa Martinez",
    "content": "The AI matching system really works! They found me a cleaner who specializes in eco-friendly products, which was exactly what I needed for my family.",
    "rating": 5,
    "service_type": "Eco-Friendly Cleaning",
    "location": "Brooklyn, NY",
    "is_featured": true,
    "created_at": "2024-02-25T00:00:00.000Z"
  },
  {
    "customer_name": "James Anderson",
    "content": "Quick, efficient, and affordable. The cleaner arrived exactly on time and did an outstanding job. Will definitely book again through CleanMatch.",
    "rating": 4,
    "service_type": "One-Time Cleaning",
    "location": "Queens, NY",
    "is_featured": false,
    "created_at": "2024-03-01T00:00:00.000Z"
  }
];

async function setupTrustData() {
  const pool = new Pool(config.database);
  
  try {
    console.log('Setting up trust data...');
    
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trust_badges (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          type VARCHAR(100) DEFAULT 'certification',
          icon_url TEXT,
          display_order INTEGER DEFAULT 1,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS testimonials (
          id SERIAL PRIMARY KEY,
          customer_name VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          service_type VARCHAR(255),
          location VARCHAR(255),
          is_featured BOOLEAN DEFAULT false,
          booking_id INTEGER REFERENCES bookings(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_trust_badges_active ON trust_badges(is_active, display_order);
      CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, rating DESC);
      CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
    `);
    
    // Insert trust badges
    for (const badge of trustBadges) {
      await pool.query(`
        INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (name) DO UPDATE SET
          description = EXCLUDED.description,
          type = EXCLUDED.type,
          icon_url = EXCLUDED.icon_url,
          display_order = EXCLUDED.display_order,
          is_active = EXCLUDED.is_active
      `, [badge.name, badge.description, badge.type, badge.icon_url, badge.display_order, badge.is_active]);
    }
    
    // Insert testimonials
    for (const testimonial of testimonials) {
      await pool.query(`
        INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [testimonial.customer_name, testimonial.content, testimonial.rating, testimonial.service_type, testimonial.location, testimonial.is_featured, testimonial.created_at]);
    }
    
    console.log('Trust data setup completed!');
    console.log(`- ${trustBadges.length} trust badges created`);
    console.log(`- ${testimonials.length} testimonials created`);
    
  } catch (error) {
    console.error('Error setting up trust data:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  setupTrustData();
}

module.exports = { setupTrustData, trustBadges, testimonials };
