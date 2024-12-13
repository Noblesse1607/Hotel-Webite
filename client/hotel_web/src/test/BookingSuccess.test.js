import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BookingSuccess from '../components/booking/BookingSuccess'
import Header from '../components/common/Header'

// Mock Header component
jest.mock('../components/common/Header', () => {
    return function MockHeader(props) {
        return <div data-testid="mock-header">{props.title}</div>
    }
})

describe('BookingSuccess Component', () => {
    const renderComponent = (initialEntries = [{ state: {} }]) => {
        return render(
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/" element={<BookingSuccess />} />
                </Routes>
            </MemoryRouter>
        )
    }

    test('renders Header component with correct title', () => {
        renderComponent()
        const headerElement = screen.getByTestId('mock-header')
        expect(headerElement).toBeInTheDocument()
        expect(headerElement).toHaveTextContent('Booking Success')
    })

    test('renders success message when message is provided', () => {
        const successMessage = 'Your booking is confirmed!'
        renderComponent([{ 
            pathname: '/', 
            state: { message: successMessage } 
        }])

        // Check success heading
        const successHeading = screen.getByText('Booking Success!')
        expect(successHeading).toBeInTheDocument()
        expect(successHeading).toHaveClass('text-success')

        // Check success message
        const successMessageElement = screen.getByText(successMessage)
        expect(successMessageElement).toBeInTheDocument()
        expect(successMessageElement).toHaveClass('text-success')
    })

    test('renders error message when error is provided', () => {
        const errorMessage = 'Booking could not be completed'
        renderComponent([{ 
            pathname: '/', 
            state: { error: errorMessage } 
        }])

        // Check error heading
        const errorHeading = screen.getByText('Error Booking Room!')
        expect(errorHeading).toBeInTheDocument()
        expect(errorHeading).toHaveClass('text-danger')

        // Check error message
        const errorMessageElement = screen.getByText(errorMessage)
        expect(errorMessageElement).toBeInTheDocument()
        expect(errorMessageElement).toHaveClass('text-danger')
    })

    test('renders default state when no message or error is provided', () => {
        renderComponent()

        // Check error heading (default)
        const errorHeading = screen.getByText('Error Booking Room!')
        expect(errorHeading).toBeInTheDocument()
        expect(errorHeading).toHaveClass('text-danger')
    })

    test('component structure and CSS classes', () => {
        renderComponent([{ 
            pathname: '/', 
            state: { message: 'Test Message' } 
        }])

        // Debug logging to understand the DOM structure
        const messageDiv = screen.getByText('Test Message')
        const parentDivs = screen.getAllByRole('generic')

        // Find the div with 'mt-5' class
        const mtDiv = parentDivs.find(div => 
            div.classList.contains('mt-5') && 
            div.contains(messageDiv)
        )

        // If no div found, log all divs for debugging
        if (!mtDiv) {
            console.log('Available divs:', parentDivs.map(div => ({
                classList: Array.from(div.classList),
                innerHTML: div.innerHTML
            })))
        }

        // Assertion with more detailed error message
        expect(mtDiv).toBeTruthy()
        expect(mtDiv).toHaveClass('mt-5')
    })
})