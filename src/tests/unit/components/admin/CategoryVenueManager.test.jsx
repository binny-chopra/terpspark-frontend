import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryVenueManager from '@components/admin/CategoryVenueManager';

describe('CategoryVenueManager', () => {
  it('renders', () => {
    render(
      <CategoryVenueManager
        type="category"
        items={[]}
        onAdd={vi.fn()}
        onUpdate={vi.fn()}
        onRetire={vi.fn()}
        loading={false}
      />
    );
    
    // Component should render without errors
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });
});
