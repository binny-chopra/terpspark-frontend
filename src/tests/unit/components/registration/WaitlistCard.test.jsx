import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WaitlistCard from '@components/registration/WaitlistCard';

describe('WaitlistCard', () => {
  it('renders waitlist information', () => {
    const mockWaitlistEntry = {
      id: 1,
      position: 5,
      notificationPreference: 'email_sms',
      joinedAt: '2025-01-01T10:00:00Z',
      event: {
        title: 'Test Event',
        category: 'academic',
        date: '2025-12-15',
        startTime: '14:00',
        endTime: '16:00',
        venue: 'Test Venue'
      }
    };
    
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={vi.fn()} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/waitlist position: #5/i)).toBeInTheDocument();
    // Text is broken up by <strong> tags, so check for parts of the text
    expect(screen.getByText(/you're/i)).toBeInTheDocument();
    expect(screen.getByText(/on the waitlist/i)).toBeInTheDocument();
  });
});
