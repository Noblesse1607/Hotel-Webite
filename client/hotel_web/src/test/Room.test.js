import React from 'react'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import Room from '../components/room/Room'
import { getAllRooms } from '../components/utils/ApiFunctions'
import RoomCard from '../components/room/RoomCard'
import RoomFilter from '../components/common/RoomFilter'
import RoomPaginator from '../components/common/RoomPaginator'

// Mock API call and child components
jest.mock('../components/utils/ApiFunctions')
jest.mock('../components/room/RoomCard', () => jest.fn(() => <div>RoomCard</div>))
jest.mock('../components/common/RoomFilter', () => jest.fn(() => <div>RoomFilter</div>))
jest.mock('../components/common/RoomPaginator', () => jest.fn(() => <div>RoomPaginator</div>))

describe('Room Component', () => {
  const mockRooms = [
    { id: '1', name: 'Room 1' },
    { id: '2', name: 'Room 2' },
    { id: '3', name: 'Room 3' },
    { id: '4', name: 'Room 4' },
    { id: '5', name: 'Room 5' },
    { id: '6', name: 'Room 6' },
    { id: '7', name: 'Room 7' },
  ]

  beforeEach(() => {
    getAllRooms.mockResolvedValue(mockRooms)
  })
  
  test('shows loading message when data is loading', () => {
    getAllRooms.mockImplementationOnce(() => new Promise(() => {}))
    render(<Room />)

    expect(screen.getByText('Loading rooms.....')).toBeInTheDocument()
  })

  describe('Room Component - Error Handling', () => {
    test('displays error message when there is an error fetching rooms', async () => {
      // Simulate an error in the API call
      getAllRooms.mockRejectedValueOnce(new Error('Failed to fetch rooms'))
  
      // Render the Room component
      render(<Room />)
  
      // Wait for the error message to appear in the document
      await waitFor(() => {
        expect(screen.getByText(/Error : Failed to fetch rooms/i)).toBeInTheDocument()
      })
  
      // Ensure that the error message is rendered
      expect(screen.getByText('Error : Failed to fetch rooms')).toBeInTheDocument()
    })
  })
  
  test('renders RoomPaginator component', async () => {
    render(<Room />)

    await waitFor(() => expect(getAllRooms).toHaveBeenCalled())

    // Kiểm tra các paginator
    const paginatorElements = screen.getAllByText('RoomPaginator')
    expect(paginatorElements.length).toBe(2) // Có 2 paginator trong component
  })
})