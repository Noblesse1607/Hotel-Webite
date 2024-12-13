import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Bookings from '../components/booking/Bookings'
import { getAllBookings, cancelBooking } from '../components/utils/ApiFunctions'

// Mock the API functions
jest.mock('../components/utils/ApiFunctions', () => ({
  getAllBookings: jest.fn(),
  cancelBooking: jest.fn()
}))

// Mock the child components
jest.mock('../components/common/Header', () => ({ title }) => <div data-testid="header">{title}</div>)
jest.mock('../components/booking/BookingsTable', () => ({ bookingInfo, handleBookingCancellation }) => (
  <div data-testid="bookings-table">
    {bookingInfo.map(booking => (
      <div key={booking.id} data-testid={`booking-${booking.id}`}>
        {booking.id}
        <button onClick={() => handleBookingCancellation(booking.id)}>Cancel</button>
      </div>
    ))}
  </div>
))

describe('Bookings Component', () => {
  const mockBookings = [
    { id: '1', name: 'Booking 1' },
    { id: '2', name: 'Booking 2' }
  ]

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  test('renders loading state initially', async () => {
    // Simulate a delay in fetching bookings
    getAllBookings.mockImplementation(() => new Promise(() => {}))

    render(<Bookings />)

    // Check if loading text is displayed
    expect(screen.getByText('Loading existing bookings')).toBeInTheDocument()
  })

  test('renders header with correct title', async () => {
    getAllBookings.mockResolvedValue(mockBookings)

    render(<Bookings />)

    // Wait for component to render
    await waitFor(() => {
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Existing Bookings')
    })
  })
})