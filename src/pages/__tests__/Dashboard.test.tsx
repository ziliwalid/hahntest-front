import React from 'react';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock de l'API
jest.mock('../../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  },
  userAPI: {
    getMe: jest.fn(() => Promise.resolve({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00Z'
    }))
  },
  tasksAPI: {
    getStatistics: jest.fn(() => Promise.resolve({
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0
    })),
    getTasks: jest.fn(() => Promise.resolve([]))
  }
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Dashboard', () => {
  test('se rend sans erreur', async () => {
    await act(async () => {
      const { container } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );
      expect(container).toBeTruthy();
    });
  });
});