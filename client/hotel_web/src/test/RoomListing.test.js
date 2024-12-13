import React from 'react'
import { render, screen } from '@testing-library/react'
import RoomListing from '../components/room/RoomListing'
import Room from '../components/room/Room'

// Mock Room component
jest.mock('../components/room/Room', () => {
    return jest.fn(() => <div data-testid="mocked-room">Mocked Room Component</div>)
})

describe('RoomListing Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks()
    })

    test('renders the section with correct classes', () => {
        render(<RoomListing />)

        // Kiểm tra section được render với các class đúng
        const sectionElement = screen.getByTestId('mocked-room').closest('section')
        expect(sectionElement).toBeInTheDocument()
        expect(sectionElement).toHaveClass('bg-light')
        expect(sectionElement).toHaveClass('p-2')
        expect(sectionElement).toHaveClass('mb-5')
        expect(sectionElement).toHaveClass('mt-5')
        expect(sectionElement).toHaveClass('shadow')
    })

    test('renders Room component inside the section', () => {
        render(<RoomListing />)

        // Kiểm tra Room component được render
        const roomComponent = screen.getByTestId('mocked-room')
        expect(roomComponent).toBeInTheDocument()
        expect(roomComponent.textContent).toBe('Mocked Room Component')
    })

    test('Room component is rendered exactly once', () => {
        render(<RoomListing />)

        // Đảm bảo Room component chỉ được render một lần
        expect(Room).toHaveBeenCalledTimes(1)
    })
})