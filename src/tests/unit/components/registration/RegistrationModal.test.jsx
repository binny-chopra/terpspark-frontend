import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationModal from '@components/registration/RegistrationModal';

describe('RegistrationModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();
  const mockEvent = {
    id: 1,
    title: 'Test Event',
    date: '2024-12-15',
    startTime: '10:00',
    endTime: '12:00',
    capacity: 100,
    registeredCount: 50,
    waitlistCount: 5
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration modal with event details', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Register for Event')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Confirm Registration')).toBeInTheDocument();
  });

  it('renders waitlist modal when isWaitlist is true', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isWaitlist={true}
      />
    );

    expect(screen.getByRole('heading', { name: 'Join Waitlist' })).toBeInTheDocument();
    expect(screen.getByText(/Event is Currently Full/i)).toBeInTheDocument();
    const waitlistText = screen.getByText(/Current waitlist:/i).closest('p').textContent;
    expect(waitlistText).toContain('5');
    expect(waitlistText).toContain('people');
  });

  it('closes modal when close button is clicked', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when cancel button is clicked', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays remaining capacity for regular registration', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const capacityText = screen.getByText(/Remaining capacity:/i).closest('p').textContent;
    expect(capacityText).toContain('50');
    expect(capacityText).toContain('spots');
  });

  it('does not show guest section for waitlist registration', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isWaitlist={true}
      />
    );

    expect(screen.queryByText(/Bring Guests/i)).not.toBeInTheDocument();
  });

  it('validates guest name is required', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText('Guest name is required')).toBeInTheDocument();
  });

  it('validates guest email is required', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText('Guest email is required')).toBeInTheDocument();
  });

  it('validates guest email must be UMD email', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@gmail.com' } });
    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText('Guest must have a UMD email address')).toBeInTheDocument();
  });

  it('adds guest when valid information is provided', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@umd.edu')).toBeInTheDocument();
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
  });

  it('prevents adding more than 2 guests', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    // Add first guest
    fireEvent.change(nameInput, { target: { value: 'Guest 1' } });
    fireEvent.change(emailInput, { target: { value: 'guest1@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    // Add second guest
    fireEvent.change(nameInput, { target: { value: 'Guest 2' } });
    fireEvent.change(emailInput, { target: { value: 'guest2@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    // Try to add third guest
    fireEvent.change(nameInput, { target: { value: 'Guest 3' } });
    fireEvent.change(emailInput, { target: { value: 'guest3@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText('Maximum 2 guests allowed per registration')).toBeInTheDocument();
    expect(screen.getAllByText(/Guest \d/)).toHaveLength(2);
  });

  it('removes guest when remove button is clicked', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const removeButton = screen.getByLabelText('Remove guest');
    fireEvent.click(removeButton);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('submits registration with guests', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    fireEvent.click(screen.getByText('Confirm Registration'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      guests: expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@umd.edu'
        })
      ]),
      sessions: [],
      notificationPreference: 'email'
    });
  });

  it('validates capacity when submitting with too many guests', () => {
    const limitedEvent = {
      ...mockEvent,
      capacity: 100,
      registeredCount: 99
    };

    render(
      <RegistrationModal
        event={limitedEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    // Add a guest (total would be 2: user + 1 guest, but only 1 spot remains)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    fireEvent.click(screen.getByText('Confirm Registration'));

    expect(screen.getByText(/Only 1 spot\(s\) remaining/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('allows submission when capacity is sufficient', () => {
    const limitedEvent = {
      ...mockEvent,
      capacity: 100,
      registeredCount: 98
    };

    render(
      <RegistrationModal
        event={limitedEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    fireEvent.click(screen.getByText('Confirm Registration'));

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(screen.queryByText(/Only.*spot/i)).not.toBeInTheDocument();
  });

  it('submits waitlist registration without capacity validation', () => {
    const fullEvent = {
      ...mockEvent,
      capacity: 100,
      registeredCount: 100
    };

    render(
      <RegistrationModal
        event={fullEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isWaitlist={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Join Waitlist' });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      guests: [],
      sessions: [],
      notificationPreference: 'email'
    });
  });

  it('displays guest count correctly', () => {
    render(
      <RegistrationModal
        event={mockEvent}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
    
    const nameInput = screen.getByPlaceholderText("Enter guest's full name");
    const emailInput = screen.getByPlaceholderText('guest@umd.edu');

    fireEvent.change(nameInput, { target: { value: 'Guest 1' } });
    fireEvent.change(emailInput, { target: { value: 'guest1@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText(/Guests \(1\/2\)/)).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Guest 2' } });
    fireEvent.change(emailInput, { target: { value: 'guest2@umd.edu' } });
    fireEvent.click(screen.getByText('Add Guest'));

    expect(screen.getByText(/Guests \(2\/2\)/)).toBeInTheDocument();
  });
});
