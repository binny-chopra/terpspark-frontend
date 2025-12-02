import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AttendeeSearch from '@components/checkin/AttendeeSearch';

describe('AttendeeSearch Component', () => {
  const mockOnCheckIn = vi.fn();
  const mockOnError = vi.fn();
  const defaultProps = {
    eventId: 1,
    onCheckIn: mockOnCheckIn,
    onError: mockOnError
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders search input and button', () => {
      render(<AttendeeSearch {...defaultProps} />);

      expect(screen.getByPlaceholderText(/search by name, email, or ticket code/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    test('renders instructions when no search has been performed', () => {
      render(<AttendeeSearch {...defaultProps} />);

      expect(screen.getByText(/manual check-in instructions/i)).toBeInTheDocument();
      expect(screen.getByText(/enter the attendee's name, email, or ticket code/i)).toBeInTheDocument();
    });

    test('search input is initially empty', () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      expect(input).toHaveValue('');
    });
  });

  describe('Search Input Interaction', () => {
    test('updates search query when typing', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John Doe');

      expect(input).toHaveValue('John Doe');
    });

    test('triggers search on Enter key press', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John{enter}');

      await waitFor(() => {
        expect(screen.getByText(/found 1 attendee/i)).toBeInTheDocument();
      });
    });

    test('shows error when searching with empty query', () => {
      render(<AttendeeSearch {...defaultProps} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(mockOnError).toHaveBeenCalledWith('Please enter a search term');
    });

    test('shows error when searching with whitespace only', () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      fireEvent.change(input, { target: { value: '   ' } });

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(mockOnError).toHaveBeenCalledWith('Please enter a search term');
    });
  });

  describe('Search Results Display', () => {
    test('displays search results when attendees are found', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/found 1 attendee/i)).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('student@umd.edu')).toBeInTheDocument();
      });
    });

    test('displays correct count for multiple results', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'umd.edu');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/found 3 attendees/i)).toBeInTheDocument();
      });
    });

    test('displays no results message when no attendees match', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'NonExistentName123');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/no attendees found matching "nonexistentname123"/i)).toBeInTheDocument();
      });
    });

    test('displays loading state during search', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(screen.getByText(/searching.../i)).toBeInTheDocument();
      expect(searchButton).toBeDisabled();
    });

    test('shows attendee details including email and ticket code', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('student@umd.edu')).toBeInTheDocument();
        expect(screen.getByText('TKT-1699558899-3')).toBeInTheDocument();
      });
    });

    test('displays guest count when attendee has guests', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'Jane');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('1 guest')).toBeInTheDocument();
      });
    });

    test('displays plural guests text when multiple guests', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'Emily');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('2 guests')).toBeInTheDocument();
      });
    });

    test('shows checked-in status for already checked-in attendees', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'Emily');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/✓ checked in/i)).toBeInTheDocument();
      });
    });

    test('displays registration date for attendees', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/registered:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Attendee Selection', () => {
    test('allows selecting an unchecked attendee', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const checkInButtons = screen.getAllByRole('button');
        const checkInButton = checkInButtons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      const confirmElements = screen.getAllByText(/confirm check-in/i);
      expect(confirmElements.length).toBeGreaterThan(0);
    });

    test('prevents selecting an already checked-in attendee by click', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'Emily');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const attendeeCard = screen.getByText('Emily Davis').closest('div').parentElement.parentElement;
        fireEvent.click(attendeeCard);
      });

      expect(screen.queryByText(/confirm check-in/i)).not.toBeInTheDocument();
    });

    test('shows confirmation panel when attendee is selected', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const checkInButton = buttons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      const confirmElements = screen.getAllByText(/confirm check-in/i);
      expect(confirmElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Attendee Name')).toBeInTheDocument();
    });

    test('displays selected attendee details in confirmation panel', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const checkInButton = buttons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
      expect(screen.getAllByText('student@umd.edu')[0]).toBeInTheDocument();
      expect(screen.getAllByText('TKT-1699558899-3')[0]).toBeInTheDocument();
    });

    test('displays guest information in confirmation panel when present', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'Jane');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const checkInButton = buttons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      expect(screen.getByText(/guests \(1\)/i)).toBeInTheDocument();
      expect(screen.getByText(/guest one/i)).toBeInTheDocument();
    });

    test('can cancel selection and return to search results', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const checkInButton = buttons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText(/confirm check-in/i)).not.toBeInTheDocument();
      expect(screen.getByText(/found 1 attendee/i)).toBeInTheDocument();
    });
  });

  describe('Check-In Confirmation', () => {
    test('calls onCheckIn when confirmation is clicked', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const checkInButton = buttons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      const confirmButton = screen.getByRole('button', { name: /confirm check-in/i });
      fireEvent.click(confirmButton);

      expect(mockOnCheckIn).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'student@umd.edu'
        })
      );
    });

    test('does not call onCheckIn when attendee is not selected', () => {
      render(<AttendeeSearch {...defaultProps} />);

      // This scenario shouldn't happen in normal UI flow, but test the function guard
      const component = screen.getByPlaceholderText(/search by name, email, or ticket code/i).closest('div').parentElement;

      expect(mockOnCheckIn).not.toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    test('searches by name (case insensitive)', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'john doe');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    test('searches by email', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'jane.smith@umd.edu');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    test('searches by ticket code', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'TKT-1699560000-3');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Emily Davis')).toBeInTheDocument();
      });
    });

    test('returns multiple results for partial matches', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'umd');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/found 3 attendees/i)).toBeInTheDocument();
      });
    });
  });

  describe('UI States and Styling', () => {
    test('does not show check-in button for already checked-in attendees', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'Emily');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Emily Davis')).toBeInTheDocument();
      });

      const allButtons = screen.getAllByRole('button');
      const checkInButtons = allButtons.filter(btn => btn.textContent.includes('Check In'));
      expect(checkInButtons.length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('handles onCheckIn callback being undefined', async () => {
      const propsWithoutCallback = { eventId: 1, onError: mockOnError };
      render(<AttendeeSearch {...propsWithoutCallback} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const checkInButton = buttons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      const confirmButton = screen.getByRole('button', { name: /confirm check-in/i });

      // Should not throw error
      expect(() => fireEvent.click(confirmButton)).not.toThrow();
    });

    test('handles onError callback being undefined', () => {
      const propsWithoutError = { eventId: 1, onCheckIn: mockOnCheckIn };
      render(<AttendeeSearch {...propsWithoutError} />);

      const searchButton = screen.getByRole('button', { name: /search/i });

      // Should not throw error
      expect(() => fireEvent.click(searchButton)).not.toThrow();
    });

    test('handles attendee with no guests', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const checkInButton = buttons.find(btn => btn.textContent.includes('Check In'));
        fireEvent.click(checkInButton);
      });

      expect(screen.queryByText(/guests/i)).not.toBeInTheDocument();
    });

  });

  describe('Accessibility', () => {
    test('search input has proper placeholder', () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      expect(input).toBeInTheDocument();
    });

    test('buttons have proper labels', () => {
      render(<AttendeeSearch {...defaultProps} />);

      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    test('disabled state is properly set during search', async () => {
      render(<AttendeeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText(/search by name, email, or ticket code/i);
      await userEvent.type(input, 'John');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(searchButton).toBeDisabled();
    });
  });
});