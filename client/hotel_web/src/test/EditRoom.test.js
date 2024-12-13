import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EditRoom from '../components/room/EditRoom'
import { getRoomById, updateRoom } from '../components/utils/ApiFunctions'

// Mock toàn cục cho URL.createObjectURL
const createObjectURL = jest.fn()
const revokeObjectURL = jest.fn()

// Mock toàn cục
global.URL = {
    createObjectURL,
    revokeObjectURL
}

// Mock các hàm API
jest.mock('../components/utils/ApiFunctions', () => ({
    getRoomById: jest.fn(),
    updateRoom: jest.fn()
}))

// Mock useParams của react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ roomId: '123' })
}))

const mockRoom = {
    roomType: 'Deluxe Room',
    roomPrice: '200',
    photo: 'base64encodedimage'
}

describe('EditRoom Component', () => {
    beforeEach(() => {
        // Reset mock functions trước mỗi test
        getRoomById.mockClear()
        updateRoom.mockClear()
        createObjectURL.mockClear()
        revokeObjectURL.mockClear()
    })

    test('renders edit room form with initial data', async () => {
        // Mock việc lấy dữ liệu phòng
        getRoomById.mockResolvedValue(mockRoom)

        render(
            <MemoryRouter initialEntries={['/edit-room/123']}>
                <Routes>
                    <Route path="/edit-room/:roomId" element={<EditRoom />} />
                </Routes>
            </MemoryRouter>
        )

        // Kiểm tra các trường input được điền đúng giá trị
        await waitFor(() => {
            expect(screen.getByDisplayValue('Deluxe Room')).toBeInTheDocument()
            expect(screen.getByDisplayValue('200')).toBeInTheDocument()
        })
    })

    test('handles image upload', async () => {
        // Mock việc lấy dữ liệu phòng
        getRoomById.mockResolvedValue({
            ...mockRoom,
            photo: 'base64encodedimage'
        })

        // Mock createObjectURL trả về một URL giả
        createObjectURL.mockReturnValue('mocked-object-url')

        render(
            <MemoryRouter initialEntries={['/edit-room/123']}>
                <Routes>
                    <Route path="/edit-room/:roomId" element={<EditRoom />} />
                </Routes>
            </MemoryRouter>
        )

        // Tạo file mock
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' })

        await waitFor(() => {
            const fileInput = screen.getByLabelText(/Photo/i)
            
            // Mô phỏng việc chọn file
            fireEvent.change(fileInput, { target: { files: [file] } })
        })

        // Kiểm tra preview ảnh được hiển thị
        await waitFor(() => {
            // Kiểm tra createObjectURL đã được gọi
            expect(createObjectURL).toHaveBeenCalledWith(expect.any(File))
            
            // Kiểm tra ảnh preview
            const imagePreview = screen.getByAltText('Room preview')
            expect(imagePreview).toBeInTheDocument()
        })
    })
})