import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'
import ExistingRooms from '../components/room/ExistingRooms'
import { getAllRooms, deleteRoom } from '../components/utils/ApiFunctions'

// Mock the external dependencies
jest.mock('../components/utils/ApiFunctions', () => ({
    getAllRooms: jest.fn(),
    deleteRoom: jest.fn()
}))

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: ({ children, to }) => <a href={to}>{children}</a>
}))

// Mock room filter and paginator
jest.mock('../components/common/RoomFilter', () => {
    return jest.fn(() => <div data-testid="room-filter">Room Filter</div>)
})

jest.mock('../components/common/RoomPaginator', () => {
    return jest.fn(({ currentPage, totalPages, onPageChange }) => (
        <div data-testid="room-paginator">
            Current Page: {currentPage}, Total Pages: {totalPages}
        </div>
    ))
})

// Mock react-icons
jest.mock('react-icons/fa', () => ({
    FaTrashAlt: () => <span>Delete</span>,
    FaEdit: () => <span>Edit</span>,
    FaEye: () => <span>View</span>,
    FaPlus: () => <span>Add</span>
}))

// Dữ liệu mock
const mockRooms = [
    { id: "1", roomType: "Deluxe", roomPrice: "200" },
    { id: "2", roomType: "Standard", roomPrice: "100" },
    { id: "3", roomType: "Deluxe", roomPrice: "250" }
]

describe('ExistingRooms Component Deletion', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        getAllRooms.mockResolvedValue(mockRooms)
    })

    test('renders room filter and paginator', async () => {
        render(
            <MemoryRouter>
                <ExistingRooms />
            </MemoryRouter>
        )

        // Đợi components được render
        await waitFor(() => {
            expect(screen.getByTestId('room-filter')).toBeInTheDocument()
            expect(screen.getByTestId('room-paginator')).toBeInTheDocument()
        })
    })

    test('renders loading state initially', async () => {
        // Giả lập việc loading rooms
        getAllRooms.mockImplementation(() => new Promise(() => {}))

        render(
            <MemoryRouter>
                <ExistingRooms />
            </MemoryRouter>
        )

        // Kiểm tra trạng thái loading
        expect(screen.getByText(/Loading existing rooms/i)).toBeInTheDocument()
    })

    test('handles room deletion', async () => {
        // Setup: Mock successful room deletion
        deleteRoom.mockResolvedValue('')

        // Render the component
        render(
            <BrowserRouter>
                <ExistingRooms />
            </BrowserRouter>
        )

        // Wait for rooms to load
        await waitFor(() => {
            expect(screen.getByText('Existing Rooms')).toBeInTheDocument()
        })

        // Find all delete buttons by their text or a more flexible selector
        const deleteButtons = screen.getAllByText('Delete')
        
        // Simulate clicking the first delete button
        fireEvent.click(deleteButtons[0])

        // Wait for success message
        await waitFor(() => {
            expect(screen.getByText(/Room No 1 was delete/i)).toBeInTheDocument()
        })

        // Verify deleteRoom was called with correct room ID
        expect(deleteRoom).toHaveBeenCalledWith('1')

        // Verify fetchRooms was called after deletion (triggering a re-fetch)
        expect(getAllRooms).toHaveBeenCalled()
    })

    test('handles error when fetching rooms', async () => {
        // Mock lỗi khi lấy danh sách phòng
        const errorMessage = "Error fetching rooms"
        getAllRooms.mockRejectedValue(new Error(errorMessage))

        render(
            <MemoryRouter>
                <ExistingRooms />
            </MemoryRouter>
        )

        // Kiểm tra thông báo lỗi
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument()
        })
    })

    test('navigates to add room page', async () => {
        render(
            <MemoryRouter>
                <ExistingRooms />
            </MemoryRouter>
        )

        // Kiểm tra link "Add Room"
        await waitFor(() => {
            const addRoomLink = screen.getByText(/Add Room/i)
            expect(addRoomLink).toBeInTheDocument()
            expect(addRoomLink.closest('a')).toHaveAttribute('href', '/add-room')
        })
    })

    test('pagination calculation works correctly', async () => {
        render(
            <MemoryRouter>
                <ExistingRooms />
            </MemoryRouter>
        )

        // Đợi paginator render
        await waitFor(() => {
            const paginator = screen.getByTestId('room-paginator')
            expect(paginator).toHaveTextContent('Current Page: 1')
            expect(paginator).toHaveTextContent('Total Pages: 1')
        })
    })

    test('handles room deletion error', async () => {
        // Setup: Mock failed room deletion
        const errorMessage = 'Deletion failed'
        deleteRoom.mockRejectedValue(new Error(errorMessage))

        // Render the component
        render(
            <BrowserRouter>
                <ExistingRooms />
            </BrowserRouter>
        )

        // Wait for rooms to load
        await waitFor(() => {
            expect(screen.getByText('Existing Rooms')).toBeInTheDocument()
        })

        // Find all delete buttons by their text
        const deleteButtons = screen.getAllByText('Delete')
        
        // Simulate clicking the first delete button
        fireEvent.click(deleteButtons[0])

        // Wait for error message
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument()
        })

        // Verify deleteRoom was called with correct room ID
        expect(deleteRoom).toHaveBeenCalledWith('1')
    })
})