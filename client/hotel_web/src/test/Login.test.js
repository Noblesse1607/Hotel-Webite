import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'
import Login from '../components/auth/Login'
import { loginUser } from '../components/utils/ApiFunctions'

// Mock dependencies
jest.mock('../components/utils/ApiFunctions', () => ({
  loginUser: jest.fn()
}))

// Mock AuthProvider
const mockHandleLogin = jest.fn()
jest.mock('../components/auth/AuthProvider', () => ({
  useAuth: () => ({
    handleLogin: mockHandleLogin
  })
}))

// Mock useNavigate
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({
    state: { path: '/' }
  })
}))

// Wrapper component to provide necessary context
const LoginWrapper = () => (
  <MemoryRouter>
    <Login />
  </MemoryRouter>
)

describe('Login Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    loginUser.mockClear()
    mockHandleLogin.mockClear()
    mockedNavigate.mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('allows entering email and password', () => {
    render(<LoginWrapper />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  test('displays error message for invalid login', async () => {
    // Mock login failure
    loginUser.mockResolvedValue(false)

    render(<LoginWrapper />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument()
    })
  })

  test('successful login redirects user', async () => {
    // Mock successful login
    const mockToken = 'fake-jwt-token'
    loginUser.mockResolvedValue({ token: mockToken })

    render(<LoginWrapper />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } })
    
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'correctpassword'
      })
      expect(mockHandleLogin).toHaveBeenCalledWith(mockToken)
      expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  test('navigates to register page', () => {
    render(<LoginWrapper />)
    
    const registerLink = screen.getByText(/register/i)
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})