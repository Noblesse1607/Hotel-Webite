import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';
import RoomSearch from '../components/common/RoomSearch';
import { getAvailableRooms } from '../components/utils/ApiFunctions';

// Mock the API function
jest.mock('../components/utils/ApiFunctions', () => ({
  getAvailableRooms: jest.fn()
}));

// Mock the RoomTypeSelector and RoomSearchResults components
jest.mock('../components/common/RoomTypeSelector', () => {
  return function MockRoomTypeSelector(props) {
    return (
      <select 
        name="roomType" 
        data-testid="room-type-selector"
        onChange={(e) => props.handleRoomInputChange(e)}
      >
        <option value="">Select Room Type</option>
        <option value="STANDARD">Standard</option>
        <option value="DELUXE">Deluxe</option>
      </select>
    );
  };
});

jest.mock('../components/common/RoomSearchResult', () => {
  return function MockRoomSearchResults(props) {
    return (
      <div data-testid="room-search-results">
        {props.results.map((room, index) => (
          <div key={index}>{room.roomType}</div>
        ))}
        <button onClick={props.onClearSearch}>Clear Results</button>
      </div>
    );
  };
});

describe('RoomSearch Component', () => {
  const today = moment().format('YYYY-MM-DD');
  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
  const dayAfterTomorrow = moment().add(2, 'days').format('YYYY-MM-DD');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search form with correct elements', () => {
    render(<RoomSearch />);

    // Check form elements
    expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument();
    expect(screen.getByTestId('room-type-selector')).toBeInTheDocument();

    // Use a specific selector for the search button
    const searchButton = screen.getByRole('button', {
      name: /search/i,
      selector: 'button[type="submit"]'
    });
    expect(searchButton).toBeInTheDocument();
  });

  test('validates date inputs', () => {
    render(<RoomSearch />);

    const checkInInput = screen.getByLabelText(/check-in date/i);
    const checkOutInput = screen.getByLabelText(/check-out date/i);
    const searchButton = screen.getByRole('button', {
      name: /search/i,
      selector: 'button[type="submit"]'
    });

    // Try to submit with invalid dates
    fireEvent.change(checkInInput, { target: { value: tomorrow } });
    fireEvent.change(checkOutInput, { target: { value: today } });
    fireEvent.click(searchButton);

    // Check for error message
    expect(screen.getByText(/check-out date must be after check-in date/i)).toBeInTheDocument();
  });

  test('searches for available rooms successfully', async () => {
    const mockRooms = [
      { id: 1, roomType: 'STANDARD', roomPrice: 100 },
      { id: 2, roomType: 'DELUXE', roomPrice: 200 }
    ];
    getAvailableRooms.mockResolvedValue({ data: mockRooms });

    render(<RoomSearch />);

    const checkInInput = screen.getByLabelText(/check-in date/i);
    const checkOutInput = screen.getByLabelText(/check-out date/i);
    const roomTypeSelector = screen.getByTestId('room-type-selector');
    const searchButton = screen.getByRole('button', {
      name: /search/i,
      selector: 'button[type="submit"]'
    });

    fireEvent.change(checkInInput, { target: { value: today } });
    fireEvent.change(checkOutInput, { target: { value: dayAfterTomorrow } });
    fireEvent.change(roomTypeSelector, { target: { value: 'STANDARD' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('room-search-results')).toBeInTheDocument();
    });

    expect(getAvailableRooms).toHaveBeenCalledWith(today, dayAfterTomorrow, 'STANDARD');
  });

  test('clears search results', async () => {
    const mockRooms = [
      { id: 1, roomType: 'STANDARD', roomPrice: 100 }
    ];
    getAvailableRooms.mockResolvedValue({ data: mockRooms });

    render(<RoomSearch />);

    const checkInInput = screen.getByLabelText(/check-in date/i);
    const checkOutInput = screen.getByLabelText(/check-out date/i);
    const roomTypeSelector = screen.getByTestId('room-type-selector');
    const searchButton = screen.getByRole('button', {
      name: /search/i,
      selector: 'button[type="submit"]'
    });

    fireEvent.change(checkInInput, { target: { value: today } });
    fireEvent.change(checkOutInput, { target: { value: dayAfterTomorrow } });
    fireEvent.change(roomTypeSelector, { target: { value: 'STANDARD' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('room-search-results')).toBeInTheDocument();
    });

    const clearButton = screen.getByText(/clear results/i);
    fireEvent.click(clearButton);

    expect(checkInInput).toHaveValue('');
    expect(checkOutInput).toHaveValue('');
  });
});
