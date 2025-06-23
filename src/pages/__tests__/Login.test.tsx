import React from 'react';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock de l'API
jest.mock('../../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  },
  userAPI: {
    getMe: jest.fn(() => Promise.resolve(null))
  }
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Login', () => {
  test('se rend sans erreur', async () => {
    await act(async () => {
      const { container } = render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );
      expect(container).toBeTruthy();
    });
  });
});