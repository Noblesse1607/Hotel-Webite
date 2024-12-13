import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Admin from '../components/admin/Admin'

describe('Admin Component', () => {
    test('renders welcome message', () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        )

        // Check welcome message
        expect(screen.getByText('Welcome to Admin Page')).toBeInTheDocument()
    })

    test('renders navigation links', () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        )

        // Check Manage Rooms link
        const manageRoomsLink = screen.getByText('Manage Rooms')
        expect(manageRoomsLink).toBeInTheDocument()
        expect(manageRoomsLink.closest('a')).toHaveAttribute('href', '/existing-rooms')

        // Check Manage Bookings link
        const manageBookingsLink = screen.getByText('Manage Bookings')
        expect(manageBookingsLink).toBeInTheDocument()
        expect(manageBookingsLink.closest('a')).toHaveAttribute('href', '/existing-bookings')
    })

    test('renders inside a container with correct classes', () => {
        const { container } = render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        )

        // Check container section
        const section = container.querySelector('section')
        expect(section).toBeInTheDocument()
        expect(section).toHaveClass('container')
        expect(section).toHaveClass('mt-5')
    })

    test('has a horizontal rule', () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        )

        // Check for horizontal rule
        expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    test('renders links with correct routing', () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        )

        // Verify links exist and are clickable
        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(2)
        
        links.forEach(link => {
            expect(link).toHaveAttribute('href')
        })
    })
})