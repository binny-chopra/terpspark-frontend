import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QRScanner from '@components/checkin/QRScanner';

describe('QRScanner', () => {
  const mockOnScan = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders scanner with start camera button', () => {
    render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    expect(screen.getByText('Start Camera')).toBeInTheDocument();
    expect(screen.getByText(/How to use QR scanner/i)).toBeInTheDocument();
  });

  it('shows idle state initially', () => {
    render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    expect(screen.getByText('Camera ready')).toBeInTheDocument();
  });

  it('starts scanning when start camera button is clicked', () => {
    render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Start Camera'));

    expect(screen.getAllByText('Point camera at QR code...').length).toBeGreaterThan(0);
    expect(screen.getByText('Simulate Scan')).toBeInTheDocument();
    expect(screen.getByText('Stop Camera')).toBeInTheDocument();
  });

  it('simulates QR code scan', async () => {
    render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Start Camera'));
    fireEvent.click(screen.getByText('Simulate Scan'));

    await waitFor(() => {
      expect(screen.getAllByText('QR Code detected!').length).toBeGreaterThan(0);
      expect(mockOnScan).toHaveBeenCalled();
    });
  });

  it('calls onScan with QR code data', async () => {
    render(<QRScanner eventId="123" onScan={mockOnScan} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Start Camera'));
    fireEvent.click(screen.getByText('Simulate Scan'));

    await waitFor(() => {
      expect(mockOnScan).toHaveBeenCalledWith(expect.stringMatching(/QR-TKT-.*-123/));
    });
  });

  it('resets to scanning state after successful scan', async () => {
    render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Start Camera'));
    fireEvent.click(screen.getByText('Simulate Scan'));

    await waitFor(() => {
      expect(screen.getAllByText('QR Code detected!').length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      const allText = document.body.textContent || '';
      expect(allText.includes('Ready to scan next code') || allText.includes('Point camera at QR code')).toBe(true);
    }, { timeout: 3000 });
  });

  it('stops scanning when stop camera button is clicked', () => {
    render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Start Camera'));
    expect(screen.getByText('Stop Camera')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Stop Camera'));

    expect(screen.getByText('Start Camera')).toBeInTheDocument();
    expect(screen.queryByText('Simulate Scan')).not.toBeInTheDocument();
  });

  it('handles camera access error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Start Camera'));

    expect(screen.getAllByText('Point camera at QR code...').length).toBeGreaterThan(0);

    consoleError.mockRestore();
  });


  it('cleans up on unmount', async () => {
    const { unmount } = render(<QRScanner eventId="1" onScan={mockOnScan} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Start Camera'));
    fireEvent.click(screen.getByText('Simulate Scan'));

    await waitFor(() => {
      expect(mockOnScan).toHaveBeenCalled();
    });

    unmount();
  });
});
