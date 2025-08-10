# Ticketing System Implementation Guide

## Overview
A comprehensive ticketing system has been implemented for CleanMatch to handle customer complaints and support requests. The system includes both backend API and frontend components.

## Database Schema

### New Tables Created:
1. **tickets** - Main ticket table with all ticket information
2. **ticket_messages** - Messages/comments on tickets
3. **ticket_attachments** - File attachments for tickets
4. **ticket_timeline** - Timeline of all ticket actions

### Key Features:
- Tickets linked to bookings and/or freelancers
- Category system (service_quality, lateness, damage, payment, other)
- Priority levels (low, normal, high, urgent)
- Status tracking (open, in_progress, waiting_customer, resolved, closed)
- SLA timestamp tracking
- Internal admin notes
- Complete audit trail

## Backend Implementation

### Controllers
- **ticketsController.js** - Handles all ticket operations
  - Create ticket (customers only)
  - Get tickets (filtered by user role)
  - Get ticket details with messages
  - Add messages to tickets
  - Update ticket status/priority (admin only)
  - Get ticket statistics (admin only)

### Routes
- **routes/tickets.js** - API endpoints with proper validation and authorization
  - POST /api/tickets - Create ticket
  - GET /api/tickets - Get tickets (with filters)
  - GET /api/tickets/stats - Get statistics (admin only)
  - GET /api/tickets/:id - Get ticket details
  - POST /api/tickets/:id/messages - Add message
  - PUT /api/tickets/:id - Update ticket (admin only)

### Database Integration
- Tables added to **config/database.js**
- Proper indexes for performance
- Trigger for automatic timestamp updates
- Foreign key relationships maintained

### Notifications
- Automatic notifications sent when:
  - New ticket created (to admins)
  - Admin responds (to customer)
  - Customer responds (to assigned admin or all admins)
  - Status changes (to customer)

## Frontend Implementation

### Components
1. **CreateTicket.jsx** - Form for customers to create new tickets
2. **TicketList.jsx** - List view with filtering for both customers and admins
3. **TicketDetails.jsx** - Detailed ticket view with messaging

### Pages
1. **customer/Tickets.jsx** - Customer ticket management page
2. **customer/TicketDetails.jsx** - Customer ticket detail page
3. **admin/Tickets.jsx** - Admin ticket management with statistics
4. **admin/TicketDetails.jsx** - Admin ticket detail page

### API Integration
- Added ticket functions to **lib/api.js**
- Proper error handling and loading states
- Real-time updates after actions

## Key Features Implemented

### For Customers:
- Create support tickets linked to bookings
- View all their tickets with status tracking
- Add messages to existing tickets
- Filter tickets by status and category
- Automatic notifications for updates

### For Admins:
- View all tickets across the system
- Filter and search tickets
- Update ticket status and priority
- Assign tickets to specific admins
- Add internal notes (not visible to customers)
- Add resolution messages
- View comprehensive statistics and analytics
- Track response times and SLA metrics

### Advanced Features:
- Attachment support (database schema ready)
- Timeline tracking of all actions
- Category-based organization
- Priority-based sorting
- SLA timestamp tracking
- Performance analytics

## Installation Steps

1. **Database Migration** (already added to database.js):
   ```bash
   # Tables will be created automatically when server starts
   # Or run manually: node database/run-tickets-migration.js
   ```

2. **Backend**: No additional dependencies needed

3. **Frontend**: Components are ready for integration into routing

## Usage Examples

### Customer Creating a Ticket:
```javascript
const ticketData = {
  bookingId: 123,
  category: "service_quality",
  priority: "high",
  summary: "Cleaner arrived 2 hours late",
  description: "The cleaner was supposed to arrive at 10 AM but came at 12 PM without prior notice..."
};
```

### Admin Updating Ticket:
```javascript
const updateData = {
  status: "in_progress",
  priority: "high",
  assignedAdminId: 5,
  internalNotes: "Following up with the cleaner"
};
```

## Security Features
- Role-based access control
- Customers can only see their own tickets
- Admin-only operations properly protected
- Input validation and sanitization
- SQL injection protection

## Performance Considerations
- Proper database indexes for fast queries
- Pagination for large datasets
- Efficient filtering and searching
- Optimized join queries

## Future Enhancements
- File attachment upload functionality
- Email notifications integration
- Advanced search and filtering
- Ticket categorization automation
- Integration with freelancer rating system
- Customer satisfaction surveys

## Files Modified/Created

### Backend:
- `database/setup-tickets.sql` - SQL schema
- `database/run-tickets-migration.js` - Migration script
- `controllers/ticketsController.js` - Main controller
- `routes/tickets.js` - API routes
- `config/database.js` - Added table creation and indexes
- `server.js` - Added route registration

### Frontend:
- `components/tickets/CreateTicket.jsx`
- `components/tickets/TicketList.jsx`
- `components/tickets/TicketDetails.jsx`
- `pages/customer/Tickets.jsx`
- `pages/customer/TicketDetails.jsx`
- `pages/admin/Tickets.jsx`
- `pages/admin/TicketDetails.jsx`
- `lib/api.js` - Added ticket API functions

The ticketing system is now fully implemented and ready for use. The database schema supports all required features, the backend provides comprehensive API endpoints, and the frontend offers intuitive interfaces for both customers and administrators.
