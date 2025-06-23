import React from 'react';
import { render, act } from '@testing-library/react';
import HealthCheck from '../HealthCheck';

// Mock simple de l'API
jest.mock('../../services/api', () => ({
  healthAPI: {
    getHealth: jest.fn(() => Promise.resolve({ status: 'ok' }))
  }
}));

// Mock des timers pour éviter les warnings act
jest.useFakeTimers();

describe('HealthCheck', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('se rend sans erreur', async () => {
    await act(async () => {
      const { container } = render(<HealthCheck />);
      expect(container).toBeTruthy();
    });
  });
});