import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BookingForm from '../components/booking/BookingForm'
import * as ApiFunctions from '../components/utils/ApiFunctions'

// Mock dependencies
jest.mock('../components/utils/ApiFunctions', () => ({
  bookRoom: jest.fn(),
  getRoomById: jest.fn()
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ roomId: '123' })
}))

describe('BookingForm Component', () => {
  const mockLocalStorage = {
    getItem: jest.fn()
  }
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  })

  beforeEach(() => {
    ApiFunctions.getRoomById.mockResolvedValue({ roomPrice: 100 })
    mockLocalStorage.getItem.mockReturnValue('user123')
    jest.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/book/123']}>
        <Routes>
          <Route path="/book/:roomId" element={<BookingForm />} />
        </Routes>
      </MemoryRouter>
    )
  }

  test('renders booking form correctly', async () => {
    renderComponent()

    expect(screen.getByText('Reserve Room')).toBeInTheDocument()
    expect(screen.getByLabelText(/fullname/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/adults/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/children/i)).toBeInTheDocument()
  })

  test('validates form inputs', async () => {
    renderComponent()

    const submitButton = screen.getByText('Continue')
    fireEvent.click(submitButton)

    // Check validation messages
    expect(screen.getByText(/please enter your fullname/i)).toBeInTheDocument()
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/please select a check in date/i)).toBeInTheDocument()
  })

  test('handles valid booking submission', async () => {
    ApiFunctions.bookRoom.mockResolvedValue('CONF123')
    renderComponent()

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/fullname/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2024-07-15' } })
    fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2024-07-20' } })
    fireEvent.change(screen.getByLabelText(/adults/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/children/i), { target: { value: '1' } })

    const submitButton = screen.getByText('Continue')
    fireEvent.click(submitButton)

    // Debugging: Log all text content
    const allElements = screen.getAllByRole('heading')
    console.log('All headings:', allElements.map(el => el.textContent))

    // Wait for booking summary to appear
    await waitFor(() => {
      const summaryElements = screen.getAllByRole('heading')
      const hasSummaryHeading = summaryElements.some(el => 
        el.textContent.toLowerCase().includes('summary')
      )
      expect(hasSummaryHeading).toBe(true)
    })
  })

  test('validates guest count', () => {
    renderComponent()

    // Fill out the form with invalid guest count
    fireEvent.change(screen.getByLabelText(/fullname/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2024-07-15' } })
    fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2024-07-20' } })
    fireEvent.change(screen.getByLabelText(/adults/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/children/i), { target: { value: '0' } })

    const submitButton = screen.getByText('Continue')
    fireEvent.click(submitButton)

    // Validate that form is not submitted
    expect(screen.queryByText(/summary/i)).not.toBeInTheDocument()
  })

  test('validates check-out date', () => {
    renderComponent()

    // Fill out the form with invalid dates
    fireEvent.change(screen.getByLabelText(/fullname/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2024-07-20' } })
    fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2024-07-15' } })
    fireEvent.change(screen.getByLabelText(/adults/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/children/i), { target: { value: '1' } })

    const submitButton = screen.getByText('Continue')
    fireEvent.click(submitButton)

    // Check for error message about check-out date
    expect(screen.getByText(/check-out date must be after check-in date/i)).toBeInTheDocument()
  })
})