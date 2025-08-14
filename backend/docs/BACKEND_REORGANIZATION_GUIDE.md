# Backend Reorganization Migration Guide

This guide helps developers update their scripts and references after the backend folder reorganization.

## 🔄 File Movements

### Test Files → `tests/`
**Old Locations** → **New Locations**
```
check-cleaners-simple.js → tests/check-cleaners-simple.js
check-cleaners.js → tests/check-cleaners.js
check-notifications-schema.js → tests/check-notifications-schema.js
create-sample-reviews.js → tests/create-sample-reviews.js
test-review-api.js → tests/test-review-api.js
```

### Database/Migration Files → `migrations/`
**Old Locations** → **New Locations**
```
database/add-rating-columns.js → migrations/add-rating-columns.js
database/enhance-reviews-system.js → migrations/enhance-reviews-system.js
database/enhanced-assignment-system.sql → migrations/enhanced-assignment-system.sql
database/fix-reviews-table.js → migrations/fix-reviews-table.js
database/migrate-membership.js → migrations/migrate-membership.js
database/run-enhanced-assignment-migration.js → migrations/run-enhanced-assignment-migration.js
database/run-migration.js → migrations/run-migration.js
database/run-tickets-migration.js → migrations/run-tickets-migration.js
database/setup-tickets.sql → migrations/setup-tickets.sql
database/setup-trust.sql → migrations/setup-trust.sql
database/update-document-urls.js → migrations/update-document-urls.js
database/update-services.js → migrations/update-services.js
add-metadata-column.sql → migrations/add-metadata-column.sql
setup-test-cleaners.sql → migrations/setup-test-cleaners.sql
```

### Seed Files → `seeds/`
**Old Locations** → **New Locations**
```
scripts/seed.js → seeds/seed.js
scripts/create-admin.js → seeds/create-admin.js
scripts/create-test-freelancers.js → seeds/create-test-freelancers.js
scripts/create-sample-documents.js → seeds/create-sample-documents.js
```

### Documentation → `docs/`
**Old Locations** → **New Locations**
```
ASSIGNMENT_SYSTEM_STATUS.md → docs/ASSIGNMENT_SYSTEM_STATUS.md
ORGANIZATION_GUIDE.md → docs/ORGANIZATION_GUIDE.md
database/README.md → docs/DATABASE_README.md
scripts/README.md → docs/SCRIPTS_README.md
```

### Removed Folders
- `database/` - Consolidated into `migrations/`

## 🔧 Update Your Scripts

### If you have custom scripts or package.json commands that reference old paths:

#### Update package.json scripts:
```json
// Old
"test": "node test-review-api.js"
"migrate": "node database/run-migration.js"
"seed": "node scripts/seed.js"

// New
"test": "node tests/test-review-api.js"
"migrate": "node migrations/run-migration.js"
"seed": "node seeds/seed.js"
```

#### Update import/require statements:
```javascript
// Old
const migration = require('./database/run-migration');
const testData = require('./create-sample-reviews');

// New
const migration = require('./migrations/run-migration');
const testData = require('./tests/create-sample-reviews');
```

#### Update shell scripts:
```bash
# Old
node database/migrate-membership.js
node scripts/create-admin.js
node test-review-api.js

# New
node migrations/migrate-membership.js
node seeds/create-admin.js
node tests/test-review-api.js
```

## 📋 Checklist for Developers

- [ ] Update any custom scripts that reference old file paths
- [ ] Update package.json scripts section
- [ ] Update documentation that references old folder structure
- [ ] Update CI/CD pipeline scripts if applicable
- [ ] Update Docker/deployment scripts if they reference specific files
- [ ] Update IDE workspace configurations
- [ ] Update any symbolic links or aliases

## 🆘 Need Help?

If you encounter issues after the reorganization:

1. **Check the folder-specific README files** for detailed documentation
2. **Use the file search** functionality in your IDE to find moved files
3. **Check this migration guide** for the exact new location of files
4. **Update relative path references** in your code

## 📝 Benefits

After updating your references, you'll benefit from:
- ✅ **Better Organization**: Related files are grouped logically
- ✅ **Easier Navigation**: Clear folder purposes
- ✅ **Improved Maintainability**: Consistent structure
- ✅ **Better Documentation**: Each folder has comprehensive README
- ✅ **Cleaner Root**: Less clutter in the main directory
