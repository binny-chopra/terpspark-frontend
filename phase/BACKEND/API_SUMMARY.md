# TerpSpark Backend API - Quick Reference Guide

## Phase-by-Phase API Summary

---

# Phase 1: Authentication & User Management

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/login` | POST | User login with email/password | No |
| `/api/auth/logout` | POST | Logout and invalidate session | Yes |
| `/api/auth/validate` | GET | Validate JWT token | Yes |
| `/api/auth/user` | GET | Get current user details | Yes |

**Total Endpoints: 4**

---

# Phase 2: Event Discovery & Browse

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/events` | GET | List/search events with filters | No | All |
| `/api/events/:id` | GET | Get event details | No | All |
| `/api/categories` | GET | List active categories | No | All |
| `/api/venues` | GET | List active venues | No | All |

**Total Endpoints: 4**

**Query Parameters for `/api/events`:**
- `search` - Search text
- `category` - Category slug
- `startDate` - Start date filter
- `endDate` - End date filter
- `organizer` - Organizer name
- `availability` - Show only available events
- `sortBy` - Sort order (date/title/popularity)
- `page` - Page number
- `limit` - Items per page

---

# Phase 3: Student Registration Flow

## Registration APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/registrations` | POST | Register for event | Yes | Student/Organizer/Admin |
| `/api/registrations` | GET | Get user's registrations | Yes | Student/Organizer/Admin |
| `/api/registrations/:id` | DELETE | Cancel registration | Yes | Student/Organizer/Admin |

## Waitlist APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/waitlist` | POST | Join waitlist | Yes | Student/Organizer/Admin |
| `/api/waitlist` | GET | Get user's waitlist entries | Yes | Student/Organizer/Admin |
| `/api/waitlist/:id` | DELETE | Leave waitlist | Yes | Student/Organizer/Admin |
| `/api/waitlist/promote` | POST | Auto-promote from waitlist (internal) | N/A | System |

**Total Endpoints: 7**

---

# Phase 4: Organizer Event Management

## Event Management APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/organizer/events` | POST | Create new event | Yes | Organizer |
| `/api/organizer/events` | GET | List organizer's events | Yes | Organizer |
| `/api/organizer/events/:id` | PUT | Update event | Yes | Organizer |
| `/api/organizer/events/:id/cancel` | POST | Cancel event | Yes | Organizer |
| `/api/organizer/events/:id/duplicate` | POST | Duplicate event | Yes | Organizer |

## Attendee Management APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/organizer/events/:id/attendees` | GET | Get event attendees | Yes | Organizer |
| `/api/organizer/events/:id/attendees/export` | GET | Export attendees CSV | Yes | Organizer |

## Communication APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/organizer/events/:id/announcements` | POST | Send announcement | Yes | Organizer |

## Statistics APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/organizer/statistics` | GET | Get organizer stats | Yes | Organizer |

**Total Endpoints: 9**

---

# Phase 5: Admin Console & Management

## Organizer Approval APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/admin/approvals/organizers` | GET | List organizer requests | Yes | Admin |
| `/api/admin/approvals/organizers/:id/approve` | POST | Approve organizer | Yes | Admin |
| `/api/admin/approvals/organizers/:id/reject` | POST | Reject organizer | Yes | Admin |

## Event Approval APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/admin/approvals/events` | GET | List pending events | Yes | Admin |
| `/api/admin/approvals/events/:id/approve` | POST | Approve event | Yes | Admin |
| `/api/admin/approvals/events/:id/reject` | POST | Reject event | Yes | Admin |

## Category Management APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/admin/categories` | GET | List all categories | Yes | Admin |
| `/api/admin/categories` | POST | Create category | Yes | Admin |
| `/api/admin/categories/:id` | PUT | Update category | Yes | Admin |
| `/api/admin/categories/:id` | DELETE | Retire/reactivate category | Yes | Admin |

## Venue Management APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/admin/venues` | GET | List all venues | Yes | Admin |
| `/api/admin/venues` | POST | Create venue | Yes | Admin |
| `/api/admin/venues/:id` | PUT | Update venue | Yes | Admin |
| `/api/admin/venues/:id` | DELETE | Retire/reactivate venue | Yes | Admin |

## Audit Log APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/admin/audit-logs` | GET | View audit logs | Yes | Admin |
| `/api/admin/audit-logs/export` | GET | Export audit logs CSV | Yes | Admin |

## Analytics APIs

| Endpoint | Method | Purpose | Auth Required | Role |
|----------|--------|---------|---------------|------|
| `/api/admin/analytics` | GET | Get system analytics | Yes | Admin |
| `/api/admin/analytics/export` | GET | Export analytics CSV | Yes | Admin |
| `/api/admin/dashboard` | GET | Get dashboard stats | Yes | Admin |

**Total Endpoints: 21**

---

# Complete API Summary by Phase

| Phase | Total Endpoints | Authentication | Public Endpoints |
|-------|----------------|----------------|------------------|
| Phase 1 | 4 | SSO-style | 1 (login) |
| Phase 2 | 4 | Optional | 4 (browse events) |
| Phase 3 | 7 | Required | 0 |
| Phase 4 | 9 | Required (Organizer) | 0 |
| Phase 5 | 21 | Required (Admin) | 0 |
| **Total** | **45** | - | **5** |

---

# API Endpoints by HTTP Method

| Method | Count | Usage |
|--------|-------|-------|
| GET | 21 | Retrieve data |
| POST | 18 | Create/action |
| PUT | 4 | Update |
| DELETE | 6 | Cancel/remove |
| **Total** | **49** | - |

---

# Data Models Summary

| Model | Primary Use | Key Fields |
|-------|-------------|------------|
| User | Authentication & roles | id, email, role, isApproved |
| Event | Event management | id, title, date, capacity, status |
| Registration | Student registrations | id, userId, eventId, ticketCode |
| WaitlistEntry | Queue management | id, eventId, position |
| Category | Event categorization | id, name, slug, color |
| Venue | Event locations | id, name, capacity |
| AuditLog | Activity tracking | id, action, actor, timestamp |

---

# Business Rules Quick Reference

## Registration Rules
- Max 2 guests per registration
- All emails must be @umd.edu
- Capacity includes guests (1 registration + 2 guests = 3 spots)
- Auto-join waitlist when full
- FIFO waitlist promotion

## Event Status Flow
```
Draft → Pending → Published → Cancelled
         ↓
      Rejected
```

## Role Permissions

### Student Can:
- Browse events
- Register for events
- Join waitlists
- View/cancel own registrations

### Organizer Can:
- Everything Student can do
- Create events (pending approval)
- Manage own events
- View attendees
- Send announcements
- Export attendee lists

### Admin Can:
- Everything Organizer can do
- Approve/reject organizers
- Approve/reject events
- Manage categories/venues
- View audit logs
- View system analytics

---

# Error Codes by Category

## Authentication Errors (401, 403)
- `INVALID_CREDENTIALS`
- `ORGANIZER_NOT_APPROVED`
- `INVALID_TOKEN`
- `INSUFFICIENT_PERMISSIONS`

## Validation Errors (400, 422)
- `VALIDATION_FAILED`
- `INVALID_DATE`
- `INVALID_CAPACITY`

## Resource Errors (404)
- `EVENT_NOT_FOUND`
- `USER_NOT_FOUND`
- `REGISTRATION_NOT_FOUND`

## Conflict Errors (409)
- `ALREADY_REGISTERED`
- `ALREADY_ON_WAITLIST`
- `EVENT_FULL`
- `INSUFFICIENT_CAPACITY`

## Business Logic Errors (400)
- `CANNOT_CANCEL_PAST_EVENT`
- `CANNOT_EDIT_CANCELLED_EVENT`

## Rate Limiting Errors (429)
- `RATE_LIMIT_EXCEEDED`

---

# Required Headers

## All Authenticated Endpoints
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## Public Endpoints
```
Content-Type: application/json
```

---

# Response Format Standards

## Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

## Error Response
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

---

# Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Login | 5 attempts | 15 min |
| Registration | 10 requests | 1 hour |
| Announcements | 10 requests | 1 day |
| General API | 100 requests | 1 min |
| Export | 5 requests | 1 hour |

---

# Pagination Standards

For paginated endpoints:

**Query Parameters:**
```
page=1          # Page number (1-indexed)
limit=20        # Items per page
```

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

# Notification Types

| Type | Trigger | Recipients | Channels |
|------|---------|-----------|----------|
| Registration Confirmation | User registers | Registrant | Email/SMS |
| Waitlist Join | User joins waitlist | Registrant | Email/SMS |
| Waitlist Promotion | Spot opens | First in waitlist | Email/SMS |
| Event Reminder | 24h before event | All registrants | Email/SMS |
| Event Cancellation | Organizer cancels | All registrants | Email/SMS |
| Event Update | Event changed | All registrants | Email/SMS |
| Organizer Approval | Admin approves | Organizer | Email |
| Organizer Rejection | Admin rejects | Organizer | Email |
| Event Approval | Admin approves | Organizer | Email |
| Event Rejection | Admin rejects | Organizer | Email |
| Announcement | Organizer sends | All registrants | Email/SMS |

---

# Database Indexes Priority

## Critical (Must Have)
1. `users.email` - Login lookups
2. `events.status` - Filter published events
3. `registrations.eventId` - Find event registrations
4. `registrations.userId` - User's registrations

## Important (Should Have)
5. `events.date` - Date-based queries
6. `events.organizerId` - Organizer's events
7. `waitlist.eventId + position` - Queue order

## Optional (Nice to Have)
8. `events.categoryId` - Category filtering
9. `audit_logs.timestamp` - Log queries
10. `audit_logs.action` - Action filtering

---

# Testing Checklist by Phase

## Phase 1 Testing
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Login as unapproved organizer
- [ ] Logout and verify token invalidation
- [ ] Session validation with valid token
- [ ] Session validation with expired token

## Phase 2 Testing
- [ ] Browse events without auth
- [ ] Search events by keyword
- [ ] Filter by category
- [ ] Filter by date range
- [ ] Sort by date/title/popularity
- [ ] View event details
- [ ] Pagination works correctly

## Phase 3 Testing
- [ ] Register for available event
- [ ] Register with guests (1-2)
- [ ] Attempt duplicate registration
- [ ] Register for full event (should fail)
- [ ] Join waitlist for full event
- [ ] Cancel registration
- [ ] Verify waitlist promotion
- [ ] View user registrations
- [ ] View user waitlist

## Phase 4 Testing
- [ ] Create event as organizer
- [ ] Edit draft event
- [ ] Edit pending event (limited)
- [ ] Cancel published event
- [ ] Duplicate event
- [ ] View event attendees
- [ ] Export attendees CSV
- [ ] Send announcement
- [ ] View organizer statistics

## Phase 5 Testing
- [ ] Approve organizer request
- [ ] Reject organizer request
- [ ] Approve event submission
- [ ] Reject event submission
- [ ] Create category
- [ ] Update category
- [ ] Retire/reactivate category
- [ ] Create venue
- [ ] Update venue
- [ ] Retire/reactivate venue
- [ ] View audit logs
- [ ] Filter audit logs
- [ ] Export audit logs
- [ ] View analytics dashboard
- [ ] Export analytics

---

# Integration Points

## External Services

| Service | Purpose | Phase |
|---------|---------|-------|
| Email Provider (SMTP) | Notifications | All |
| SMS Gateway | SMS notifications | All |
| Storage Service (S3) | Event images | 2+ |
| QR Code Generator | Ticket QR codes | 3 |

## Future Integrations

- Calendar export (iCal)
- Social media sharing
- Payment processing (for paid events)
- Student ID verification
- Mobile app API

---

# Security Checklist

- [ ] All passwords hashed (bcrypt)
- [ ] JWT tokens with expiration
- [ ] Role-based access control
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting implemented
- [ ] HTTPS only
- [ ] Audit logging for sensitive actions
- [ ] Email verification for organizers
- [ ] Secure session management

---

# Performance Optimization

## Caching Strategy

| Data | TTL | Invalidation |
|------|-----|--------------|
| Categories | 1 hour | On update |
| Venues | 1 hour | On update |
| Event list | 5 min | On event change |
| User data | In JWT | On login/logout |
| Analytics | 15 min | On demand |

## Query Optimization

- Use pagination for large datasets
- Implement proper indexes
- Use connection pooling
- Cache frequently accessed data
- Use read replicas for reports

---

# Monitoring & Alerts

## Key Metrics to Track

1. **Request Latency**
   - P50, P95, P99 response times
   - Target: <200ms for most endpoints

2. **Error Rates**
   - 4xx errors (client errors)
   - 5xx errors (server errors)
   - Target: <1% error rate

3. **Registration Success Rate**
   - Failed registrations
   - Waitlist promotion success
   - Target: >99% success rate

4. **Database Performance**
   - Query execution time
   - Connection pool utilization
   - Slow query detection

5. **Queue Depth**
   - Email queue
   - SMS queue
   - Notification processing time

## Alerts to Configure

- API error rate >5%
- Database connection issues
- Queue backlog >1000 items
- Disk space <20%
- Memory usage >90%
- Registration endpoint latency >1s

---

# Development Workflow

## API Development Checklist

For each new endpoint:

1. **Design**
   - [ ] Define request/response format
   - [ ] Document business rules
   - [ ] Identify validation requirements

2. **Implementation**
   - [ ] Create route handler
   - [ ] Implement business logic
   - [ ] Add input validation
   - [ ] Add authorization checks
   - [ ] Add error handling

3. **Testing**
   - [ ] Write unit tests
   - [ ] Write integration tests
   - [ ] Test error scenarios
   - [ ] Test authorization

4. **Documentation**
   - [ ] Update API documentation
   - [ ] Add code comments
   - [ ] Update changelog

5. **Review**
   - [ ] Code review
   - [ ] Security review
   - [ ] Performance check

---

# Deployment Checklist

## Pre-Deployment

- [ ] All tests passing
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] Rate limits configured
- [ ] Monitoring setup
- [ ] Backup strategy verified
- [ ] Rollback plan ready

## Deployment

- [ ] Database backup taken
- [ ] Run database migrations
- [ ] Deploy API servers
- [ ] Verify health checks
- [ ] Run smoke tests
- [ ] Monitor error rates
- [ ] Check performance metrics

## Post-Deployment

- [ ] Verify all endpoints working
- [ ] Check notification delivery
- [ ] Monitor error logs
- [ ] User acceptance testing
- [ ] Document any issues
- [ ] Update runbook

---

# Quick Command Reference

## Database Queries

```sql
-- Count events by status
SELECT status, COUNT(*) FROM events GROUP BY status;

-- Find full events
SELECT * FROM events WHERE registeredCount >= capacity;

-- Active registrations count
SELECT eventId, COUNT(*) FROM registrations 
WHERE status = 'confirmed' GROUP BY eventId;

-- Waitlist positions
SELECT * FROM waitlist WHERE eventId = :id ORDER BY position;
```

## Testing Endpoints

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@umd.edu","password":"student123"}'

# Browse events
curl http://localhost:3000/api/events?category=academic

# Register for event
curl -X POST http://localhost:3000/api/registrations \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"eventId":"1","guests":[]}'
```

---

This quick reference guide provides fast lookup for:
- API endpoints by phase
- Business rules
- Error codes
- Testing procedures
- Performance guidelines
- Security requirements

For detailed specifications, refer to the main BACKEND_API_DOCUMENTATION.md file.