import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuditLogTable from '@components/admin/AuditLogTable';

describe('AuditLogTable', () => {
  it('renders', () => {
    render(<AuditLogTable logs={[]} />);
    
    // Component should render empty state
    expect(screen.getByText(/no audit logs found/i)).toBeInTheDocument();
  });
});
