# TerpSpark Phase 2 - Event Discovery & Browse

## 🎉 New Features Added

Phase 2 introduces comprehensive event browsing and discovery functionality with advanced filtering and search capabilities.

---

## ✅ Features Implemented

### 1. **Event Catalog System**
- Display of all published events in grid or list view
- Responsive card-based layout
- Event cards show key information at a glance
- Toggle between grid and list view modes

### 2. **Advanced Search & Filtering (FR-5)**
- **Text Search**: Search by event title, description, or tags
- **Category Filter**: Filter by event category (Academic, Career, Cultural, etc.)
- **Date Range Filter**: Filter events by start and end dates
- **Organizer Filter**: Search events by organizer name
- **Availability Filter**: Show only events with available spots
- **Sort Options**: Sort by date, title, or popularity

### 3. **Event Detail View**
- Comprehensive event information modal
- Event details including:
  - Date, time, and location
  - Capacity and registration status
  - Organizer information
  - Full description
  - Tags for categorization
  - Waitlist information (if applicable)
- Call-to-action buttons for registration

### 4. **Capacity Tracking**
- Visual capacity indicators with color-coded progress bars
- Real-time remaining spots display
- Waitlist count visibility
- Status badges (Available, Full, Today, Past Event)

### 5. **Category System**
- 8 predefined event categories with color coding:
  - Academic (Blue)
  - Career (Green)
  - Cultural (Purple)
  - Sports (Red)
  - Arts (Pink)
  - Technology (Indigo)
  - Wellness (Teal)
  - Environmental (Emerald)

### 6. **User Experience Enhancements**
- Loading states during data fetch
- Empty state when no events match filters
- Clear filters option
- Results count display
- Mobile-responsive design
- Smooth animations and transitions

---

## 📦 New Files Added

### Data Files
- `src/data/mockEvents.json` - Mock event data with 8 sample events, categories, and venues

### Service Files
- `src/services/eventService.js` - Event-related API calls and data fetching

### Utility Files
- `src/utils/eventUtils.js` - Event formatting and helper functions

### Component Files
- `src/components/events/EventCard.jsx` - Event card component for grid/list view
- `src/components/events/EventFilters.jsx` - Advanced filtering interface
- `src/components/events/EventDetailModal.jsx` - Detailed event view modal

### Page Files
- `src/pages/EventsPage.jsx` - Main events browse page

### Updated Files
- `src/App.jsx` - Added events route
- `src/components/layout/Navigation.jsx` - Made navigation functional with routing
- `src/pages/DashboardPage.jsx` - Added navigation to events page

---

## 🚀 How to Use

### Installation (if not done already)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Testing Phase 2 Features

1. **Login** with any role:
   - Student: `student@umd.edu` / `student123`
   - Organizer: `organizer@umd.edu` / `organizer123`
   - Admin: `admin@umd.edu` / `admin123`

2. **Navigate to Events**:
   - Click "Browse Events" in the navigation bar
   - Or click the "Browse Events" button on the dashboard

3. **Browse Events**:
   - View 8 sample events in grid view (default)
   - Toggle to list view using the view mode buttons
   - Click on any event card to see full details

4. **Use Filters**:
   - **Search**: Type keywords in the search box
   - **Category**: Select a category from the dropdown
   - **Sort**: Choose sorting option (Date, Title, Popular)
   - **Available Only**: Check to show only events with spots available
   - **Advanced Filters**: Click to reveal date range and organizer filters

5. **View Event Details**:
   - Click any event card to open the detail modal
   - View full event information
   - See capacity indicators and waitlist info
   - Click "Register for Event" (will show Phase 3 message)

6. **Clear Filters**:
   - Click "Clear all filters" to reset all filter options

---

## 📊 Mock Data Structure

### Events JSON Structure

```json
{
  "id": 1,
  "title": "Event Title",
  "description": "Event description...",
  "category": "career",
  "organizer": {
    "id": 2,
    "name": "Organizer Name",
    "email": "organizer@umd.edu"
  },
  "date": "2025-11-15",
  "startTime": "10:00",
  "endTime": "16:00",
  "venue": "Location Name",
  "location": "Building Name",
  "capacity": 500,
  "registeredCount": 347,
  "waitlistCount": 23,
  "status": "published",
  "tags": ["tag1", "tag2"],
  "isFeatured": true
}
```

### Categories Structure

```json
{
  "id": 1,
  "name": "Academic",
  "slug": "academic",
  "description": "Academic events and lectures",
  "color": "blue"
}
```

---

## 🔌 API Endpoints for Backend Team

### Events Endpoints

```
GET /api/events
Query Parameters:
  - search: string (search query)
  - category: string (category slug)
  - sortBy: string (date|title|popular)
  - availableOnly: boolean
  - startDate: string (ISO date)
  - endDate: string (ISO date)
  - organizer: string (organizer name)
Response: { success: true, events: [], total: number }

GET /api/events/:id
Response: { success: true, event: {} }

GET /api/events/featured
Response: { success: true, events: [] }

GET /api/events/upcoming
Query Parameters:
  - limit: number (default: 5)
Response: { success: true, events: [] }

GET /api/categories
Response: { success: true, categories: [] }

GET /api/search?q=query
Response: { success: true, events: [], query: string }
```

---

## 🎨 Component Architecture

### EventsPage (Container Component)
- Manages state for events, filters, and selected event
- Handles data fetching and filtering
- Coordinates child components

### EventFilters (Filter Component)
- Search input
- Category dropdown
- Sort options
- Advanced filters (date range, organizer)
- Clear filters functionality

### EventCard (Presentation Component)
- Displays event summary
- Shows capacity indicator
- Category and status badges
- Organizer information
- Click to view details

### EventDetailModal (Detail Component)
- Full event information
- Detailed capacity tracking
- Registration call-to-action
- Organizer contact info
- Tags display

---

## 🛠️ Utility Functions

### eventUtils.js

Key utility functions for event handling:

- `formatEventDate(dateString)` - Format date to readable string
- `formatEventTime(timeString)` - Format time (12-hour format)
- `formatTimeRange(start, end)` - Format time range
- `getRemainingCapacity(capacity, registered)` - Calculate remaining spots
- `isEventFull(capacity, registered)` - Check if event is full
- `getCapacityPercentage(capacity, registered)` - Get capacity percentage
- `getCapacityColor(percentage)` - Get color based on capacity
- `isEventPast(date, time)` - Check if event has passed
- `isEventToday(date)` - Check if event is today
- `getDaysUntilEvent(date)` - Calculate days until event
- `getEventStatusBadge(event)` - Generate status badge
- `getCategoryColor(category)` - Get category color scheme
- `truncateText(text, maxLength)` - Truncate long text

---

## 🎯 Requirements Met

### Functional Requirements
- ✅ **FR-5**: Searchable calendar/list with filters (date, category, organizer)
- ✅ Event display with title, date/time, venue, remaining capacity
- ✅ Category-based filtering
- ✅ Date range filtering
- ✅ Organizer filtering
- ✅ Search functionality

### Non-Functional Requirements
- ✅ **NFR-1**: Responsive UI design
- ✅ **NFR-2**: Modern browser compatibility
- ✅ **NFR-3**: Fast page load times (simulated with delays)
- ✅ Clean, maintainable code structure

---

## 📱 Responsive Design

Phase 2 is fully responsive across:

- **Desktop** (1920px+): 3-column grid, full filter sidebar
- **Tablet** (768px - 1024px): 2-column grid, collapsible filters
- **Mobile** (< 768px): Single column, stacked filters

---

## 🐛 Known Limitations

1. Registration functionality shows placeholder message (Phase 3)
2. Calendar view not yet implemented (grid/list only)
3. Mock data only - no real backend integration
4. No pagination (all events load at once)
5. No infinite scroll
6. Featured events not prominently displayed on browse page

---

## 🔜 Next Steps (Phase 3)

- Student registration flow
- Session selection for multi-day events
- Capacity enforcement
- Waitlist management
- Guest/plus-one handling
- My Registrations page

---

## 📝 Testing Checklist

- [ ] Login and navigate to Events page
- [ ] View events in grid mode
- [ ] Toggle to list mode
- [ ] Search for events by keyword
- [ ] Filter by category
- [ ] Filter by date range
- [ ] Sort by different criteria
- [ ] Toggle "available only" filter
- [ ] Clear all filters
- [ ] Click event card to view details
- [ ] Close event detail modal
- [ ] Test on mobile device/responsive mode
- [ ] Verify all 8 sample events load
- [ ] Check capacity indicators
- [ ] Verify status badges display correctly

---

## 💡 Tips for Developers

1. **Adding New Events**: Edit `src/data/mockEvents.json`
2. **Changing Categories**: Update categories array in mockEvents.json
3. **Customizing Colors**: Modify category colors in eventUtils.js
4. **Adjusting Filters**: Update EventFilters component
5. **Styling Changes**: Use Tailwind classes throughout

---

## 📞 Support

For questions about Phase 2 implementation, contact the development team.

---

**Phase 2 Complete! ✨**

Ready to proceed with Phase 3: Student Registration Flow