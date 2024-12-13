import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import RequireAuth from '../components/auth/RequireAuth'

// Mock components for testing
const ProtectedComponent = () => <div>Protected Content</div>
const LoginComponent = () => <div>Login Page</div>

// Helper component to capture Navigate props for state testing
const CaptureNavigate = () => {
  const location = useLocation()
  return <div data-testid="navigate">{JSON.stringify(location.state)}</div>
}

// Utility function to wrap RequireAuth for testing
const TestWrapper = ({ isAuthenticated = false, initialRoute = '/protected' }) => {
  // Set up localStorage based on authentication state
  if (isAuthenticated) {
    localStorage.setItem('userId', 'test-user-id')
  } else {
    localStorage.removeItem('userId')
  }

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginComponent />} 
        />
        <Route 
          path="/protected" 
          element={
            <RequireAuth>
              <ProtectedComponent />
            </RequireAuth>
          } 
        />
        <Route 
          path="/another-route" 
          element={
            <RequireAuth>
              <div>Another Protected Route</div>
            </RequireAuth>
          } 
        />
      </Routes>
      <CaptureNavigate />
    </MemoryRouter>
  )
}

describe('RequireAuth Component', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders children when user is authenticated', () => {
    render(<TestWrapper isAuthenticated={true} />)

    // Check that protected content is rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    // Ensure login page is not rendered
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  test('redirects to login page when user is not authenticated', () => {
    render(<TestWrapper isAuthenticated={false} />)

    // Check that login page is rendered
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    // Ensure protected content is not rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  test('preserves original path in navigation state', () => {
    render(<TestWrapper isAuthenticated={false} />)

    // Verify that the navigation state is captured
    const navigateElement = screen.getByTestId('navigate')
    const stateText = navigateElement.textContent

    // Parse the state JSON
    const state = JSON.parse(stateText)
    
    // Check that the state contains the original path
    expect(state).toEqual({ path: '/protected' })
  })

  test('handles different initial routes', () => {
    render(<TestWrapper isAuthenticated={false} initialRoute="/another-route" />)

    // Check that login page is rendered
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})