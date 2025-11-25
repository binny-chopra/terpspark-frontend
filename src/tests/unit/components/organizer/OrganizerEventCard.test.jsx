import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrganizerEventCard from '@components/organizer/OrganizerEventCard';

const mockEvent = {
  id: 1,
  title: 'Test Event',
  date: '2025-12-15',
  category: 'academic',
  venue: 'Test Venue',
  registeredCount: 50,
  capacity: 100,
  status: 'published',
  createdAt: '2025-01-01T00:00:00Z'
};

describe('OrganizerEventCard', () => {
  it('renders event information', () => {
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onDuplicate={vi.fn()}
        onViewAttendees={vi.fn()}
      />
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const mockEventEditable = { ...mockEvent, status: 'draft' };
    
    render(
      <OrganizerEventCard 
        event={mockEventEditable} 
        onEdit={mockOnEdit}
        onCancel={vi.fn()}
        onDuplicate={vi.fn()}
        onViewAttendees={vi.fn()}
      />
    );

    // Open the menu
    const menuButton = screen.getByRole('button');
    await user.click(menuButton);

    // Click edit button
    const editButton = screen.getByText(/edit event/i);
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockEventEditable.id);
  });
});
