import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../components/home/Home'

// Mock child components
jest.mock('../components/layout/MainHeader', () => {
    return jest.fn(() => <div data-testid="main-header">Main Header</div>)
})

jest.mock('../components/common/RoomSearch', () => {
    return jest.fn(() => <div data-testid="room-search">Room Search</div>)
})

jest.mock('../components/common/RoomCarousel', () => {
    return jest.fn(() => <div data-testid="room-carousel">Room Carousel</div>)
})

jest.mock('../components/common/Parallax', () => {
    return jest.fn(() => <div data-testid="parallax">Parallax</div>)
})

jest.mock('../components/common/HotelService', () => {
    return jest.fn(() => <div data-testid="hotel-service">Hotel Service</div>)
})

describe('Home Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks()
    })

    test('renders all child components', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        // Check if MainHeader is rendered
        expect(screen.getByTestId('main-header')).toBeInTheDocument()

        // Check if RoomSearch is rendered
        expect(screen.getByTestId('room-search')).toBeInTheDocument()

        // Check if RoomCarousel is rendered twice
        const roomCarousels = screen.getAllByTestId('room-carousel')
        expect(roomCarousels).toHaveLength(2)

        // Check if Parallax is rendered twice
        const parallaxes = screen.getAllByTestId('parallax')
        expect(parallaxes).toHaveLength(2)

        // Check if HotelService is rendered
        expect(screen.getByTestId('hotel-service')).toBeInTheDocument()
    })

    test('renders components in the correct order', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        // Get all test ids in order
        const componentOrder = screen.getAllByTestId(/main-header|room-search|room-carousel|parallax|hotel-service/)
        
        // Expected order of components
        const expectedComponentNames = [
            'main-header', 
            'room-search', 
            'room-carousel', 
            'parallax', 
            'hotel-service', 
            'parallax', 
            'room-carousel'
        ]

        // Check component order
        componentOrder.forEach((component, index) => {
            expect(component).toHaveAttribute('data-testid', expectedComponentNames[index])
        })
    })
})