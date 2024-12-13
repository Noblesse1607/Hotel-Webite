import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import moment from 'moment'
import BookingSummary from '../components/booking/BookingSummary'

// Mock useNavigate hook
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}))

describe('BookingSummary Component', () => {
    const mockBooking = {
        guestFullName: 'John Doe',
        guestEmail: 'john@example.com',
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-18',
        numOfAdults: 2,
        numOfChildren: 1
    }

    const mockPayment = 500
    const mockOnConfirm = jest.fn()

    const renderComponent = (props = {}) => {
        const defaultProps = {
            booking: mockBooking,
            payment: mockPayment,
            isFormValid: true,
            onConfirm: mockOnConfirm
        }

        return render(
            <MemoryRouter>
                <BookingSummary {...defaultProps} {...props} />
            </MemoryRouter>
        )
    }

    test('shows error message when payment is zero or negative', () => {
        renderComponent({ payment: 0 })
        expect(screen.getByText(/Check-out date must be after check-in date./i)).toBeInTheDocument()
    })

    test('renders confirm booking button when form is valid', () => {
        renderComponent()
        const confirmButton = screen.getByText(/Confirm Booking & proceed to payment/i)
        expect(confirmButton).toBeInTheDocument()
    })

    test('handles booking confirmation process', async () => {
        jest.useFakeTimers()

        renderComponent()
        const confirmButton = screen.getByText(/Confirm Booking & proceed to payment/i)
        
        fireEvent.click(confirmButton)

        // Check processing state
        expect(screen.getByText(/Booking Confirmed, redirecting to payment.../i)).toBeInTheDocument()

        // Fast-forward timers
        jest.runAllTimers()

        // Wait for navigation
        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/booking-success')
            expect(mockOnConfirm).toHaveBeenCalled()
        })

        jest.useRealTimers()
    })

    test('does not show confirm button when form is invalid', () => {
        renderComponent({ isFormValid: false })
        const confirmButton = screen.queryByText(/Confirm Booking & proceed to payment/i)
        expect(confirmButton).not.toBeInTheDocument()
    })

    test('handles singular/plural for adults', () => {
        // Single adult
        const { rerender } = renderComponent({ booking: { ...mockBooking, numOfAdults: 1 } })
        expect(screen.getByText(/Adult : 1/i)).toBeInTheDocument()

        // Multiple adults
        rerender(
            <MemoryRouter>
                <BookingSummary 
                    booking={{...mockBooking, numOfAdults: 2}} 
                    payment={mockPayment} 
                    isFormValid={true} 
                    onConfirm={mockOnConfirm} 
                />
            </MemoryRouter>
        )
        expect(screen.getByText(/Adults : 2/i)).toBeInTheDocument()
    })
})