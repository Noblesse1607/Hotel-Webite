import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Registration from '../components/auth/Registration'
import { registerUser } from '../components/utils/ApiFunctions'

// Mock the registerUser function
jest.mock('../components/utils/ApiFunctions', () => ({
  registerUser: jest.fn()
}))

// Wrapper component to provide routing context
const WrappedRegistration = () => (
  <BrowserRouter>
    <Registration />
  </BrowserRouter>
)

describe('Registration Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders registration form with all input fields', () => {
    render(<WrappedRegistration />)
  
    // Check form title (specifically the h2 element)
    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument()
  
    // Check input fields
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
  
    // Check register button
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument()
  
    // Check login link using a more flexible approach
    const loginLink = screen.getByRole('link', { name: /Login/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  test('updates input values on change', () => {
    render(<WrappedRegistration />)

    const firstNameInput = screen.getByLabelText(/First Name/i)
    const lastNameInput = screen.getByLabelText(/Last Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    // Simulate user typing
    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Check if values are updated
    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john.doe@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  test('submits form successfully', async () => {
    // Mock successful registration
    registerUser.mockResolvedValue('Registration successful')

    render(<WrappedRegistration />)

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }))

    // Wait for success message
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      })
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument()
    })

    // Check that form is cleared
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('')
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('')
    expect(screen.getByLabelText(/Email/i)).toHaveValue('')
    expect(screen.getByLabelText(/Password/i)).toHaveValue('')
  })

  test('displays error message on registration failure', async () => {
    // Mock registration failure
    const errorMessage = 'Test error message'
    registerUser.mockRejectedValue(new Error(errorMessage))

    render(<WrappedRegistration />)

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }))

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Registration error : Test error message/i)).toBeInTheDocument()
    })
})

test('clears success and error messages after 5 seconds', async () => {
    // Mock successful registration
    registerUser.mockResolvedValue('Registration successful')
  
    // Use fake timers
    jest.useFakeTimers()
  
    render(<WrappedRegistration />)
  
    // Fill out the form and submit
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })
  
    fireEvent.click(screen.getByRole('button', { name: /Register/i }))
  
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument()
    })
  
    // Fast forward time
    jest.advanceTimersByTime(5000)
  
    // Use runAllTimers to ensure all timers are processed
    jest.runAllTimers()
  
    // Check messages are cleared
    await waitFor(() => {
      expect(screen.queryByText(/Registration successful/i)).toBeNull()
    })
  
    // Restore real timers
    jest.useRealTimers()
  })
})