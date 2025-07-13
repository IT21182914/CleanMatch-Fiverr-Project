#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 CleanMatch Backend Setup Script\n');

// Generate secure random strings for JWT secrets
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from template...');
    
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Replace placeholder secrets with secure random values
    envContent = envContent.replace(
      'your_super_secret_jwt_key_here_change_in_production',
      generateSecret()
    );
    envContent = envContent.replace(
      'your_refresh_token_secret_here',
      generateSecret()
    );
    envContent = envContent.replace(
      'your_session_secret_here',
      generateSecret(32)
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created with secure random secrets');
  } else {
    console.log('❌ .env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Setup Checklist:');
console.log('1. ✅ Dependencies installed');
console.log('2. ✅ Environment file created');
console.log('3. ⏳ Configure your .env file with:');
console.log('   - Database credentials (PostgreSQL)');
console.log('   - Stripe API keys');
console.log('   - Email service credentials');
console.log('4. ⏳ Create PostgreSQL database');
console.log('5. ⏳ Run database seeder (optional)');

console.log('\n🔧 Next Steps:');
console.log('1. Edit .env file with your configuration');
console.log('2. Create PostgreSQL database: cleanmatch_db');
console.log('3. Run: npm run seed (to create sample data)');
console.log('4. Run: npm run dev (to start development server)');

console.log('\n📚 Documentation:');
console.log('- API Documentation: ./docs/api.md');
console.log('- README: ./README.md');
console.log('- Health Check: http://localhost:5000/health');

console.log('\n🎉 CleanMatch Backend setup complete!');
console.log('Happy coding! 🧹✨');
