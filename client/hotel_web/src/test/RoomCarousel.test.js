import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RoomCarousel from '../components/common/RoomCarousel'; // Adjust import path as needed
import { getAllRooms } from '../components/utils/ApiFunctions';

// Mock the API function and React Router
jest.mock('../components/utils/ApiFunctions');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('RoomCarousel Component', () => {
  // Sample mock data for rooms
  const mockRooms = [
    {
      id: "1",
      roomType: "Standard Room",
      roomPrice: "100",
      photo: "base64encodedimage1"
    },
    {
      id: "2",
      roomType: "Deluxe Room",
      roomPrice: "200",
      photo: "base64encodedimage2"
    },
    {
      id: "3",
      roomType: "Suite",
      roomPrice: "300",
      photo: "base64encodedimage3"
    },
    {
      id: "4",
      roomType: "Executive Suite",
      roomPrice: "400",
      photo: "base64encodedimage4"
    },
    {
      id: "5",
      roomType: "Penthouse",
      roomPrice: "500",
      photo: "base64encodedimage5"
    }
  ];

  // Wrap component with Router for testing
  const renderComponent = (rooms, error = null) => {
    getAllRooms.mockImplementation(() => {
      if (error) {
        return Promise.reject(new Error(error));
      }
      return Promise.resolve(rooms);
    });

    return render(
      <BrowserRouter>
        <RoomCarousel />
      </BrowserRouter>
    );
  };

  // Test 1: Component renders loading state
  test('displays loading state initially', async () => {
    getAllRooms.mockImplementation(() => new Promise(() => {})); // Never resolves to keep loading state
    render(
      <BrowserRouter>
        <RoomCarousel />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading rooms.../i)).toBeInTheDocument();
  });

  // Test 2: Component renders rooms successfully
  test('renders rooms carousel successfully', async () => {
    renderComponent(mockRooms);

    // Wait for rooms to load
    await waitFor(() => {
      // Check if "Browse all rooms" link exists
      expect(screen.getByText(/Browse all rooms/i)).toBeInTheDocument();

      // Check if room details are rendered
      mockRooms.forEach(room => {
        expect(screen.getByText(room.roomType)).toBeInTheDocument();
        expect(screen.getByText(`$${room.roomPrice}/night`)).toBeInTheDocument();
      });
    });
  });

  // Test 3: Error handling
  test('displays error message when room fetch fails', async () => {
    const errorMessage = "Failed to fetch rooms";
    renderComponent([], errorMessage);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error : Failed to fetch rooms/i)).toBeInTheDocument();
    });
  });

  // Test 5: Book Now links
  test('book now links are correct for each room', async () => {
    renderComponent(mockRooms);

    await waitFor(() => {
      mockRooms.forEach(room => {
        const bookNowLinks = screen.getAllByText(/Book Now/i);
        const bookNowLink = bookNowLinks.find(link => 
          link.closest('a').getAttribute('href') === `/book-room/${room.id}`
        );
        expect(bookNowLink).toBeInTheDocument();
      });
    });
  });

  // Test 6: Room images rendering
  test('renders room images with correct attributes', async () => {
    renderComponent(mockRooms);

    await waitFor(() => {
      mockRooms.forEach(room => {
        const roomImages = screen.getAllByAltText('Room Photo');
        const roomImage = roomImages.find(img => 
          img.getAttribute('src') === `data:image/png;base64, ${room.photo}`
        );
        expect(roomImage).toBeInTheDocument();
        expect(roomImage).toHaveClass('w-100');
        expect(roomImage).toHaveStyle({ height: '200px' });
      });
    });
  });
});