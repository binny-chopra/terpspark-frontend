import React from 'react';
import { vi } from 'vitest';

vi.mock('@components/layout/Header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('@components/layout/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
}));


