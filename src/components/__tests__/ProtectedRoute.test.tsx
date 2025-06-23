import React from 'react';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
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

describe('ProtectedRoute', () => {
  test('se rend sans erreur', async () => {
    await act(async () => {
      const { container } = render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Contenu protégé</div>
          </ProtectedRoute>
        </TestWrapper>
      );
      expect(container).toBeTruthy();
    });
  });
});