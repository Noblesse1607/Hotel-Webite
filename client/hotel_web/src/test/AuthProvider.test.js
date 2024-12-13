import React from 'react';
import { render, act } from '@testing-library/react';
import { jwtDecode } from 'jwt-decode';
import { AuthProvider, AuthContext, useAuth } from '../components/auth/AuthProvider'; // Adjust the import path as needed

// Mock jwt-decode
jest.mock('jwt-decode');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthContext', () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJyb2xlcyI6InVzZXIifQ.mockSignature';
  const mockDecodedUser = {
    sub: '123456',
    roles: 'user'
  };

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('provides initial context values', () => {
    const TestComponent = () => {
      const { user, handleLogin, handleLogout } = useAuth();
      expect(user).toBeNull();
      expect(handleLogin).toBeInstanceOf(Function);
      expect(handleLogout).toBeInstanceOf(Function);
      return null;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  });

  test('handles login correctly', () => {
    // Mock jwt-decode to return predefined decoded user
    jwtDecode.mockReturnValue(mockDecodedUser);

    const TestComponent = () => {
      const { user, handleLogin } = useAuth();
      const [testUser, setTestUser] = React.useState(null);

      React.useEffect(() => {
        // Perform login
        act(() => {
          handleLogin(mockToken);
        });

        // Set the user for assertion in the next render
        setTestUser(user);
      }, [handleLogin]);

      // Only run assertions when testUser is set
      if (testUser) {
        expect(testUser).toEqual(mockDecodedUser);
      }

      return null;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Check localStorage items
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userId', '123456');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userRole', 'user');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  test('handles logout correctly', () => {
    // First, simulate a login
    jwtDecode.mockReturnValue(mockDecodedUser);

    const TestComponent = () => {
      const { handleLogin, handleLogout } = useAuth();
      
      React.useEffect(() => {
        act(() => {
          handleLogin(mockToken);
          handleLogout();
        });
      }, []);

      const { user } = useAuth();
      expect(user).toBeNull();
      return null;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Check localStorage items were removed
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userRole');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });
});
