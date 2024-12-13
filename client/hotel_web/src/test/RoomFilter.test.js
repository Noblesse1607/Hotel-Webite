import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomFilter from '../components/common/RoomFilter'; // Adjust import path as needed

describe('RoomFilter Component', () => {
  // Sample mock data for rooms
  const mockRooms = [
    { id: 1, roomType: 'Standard Room' },
    { id: 2, roomType: 'Deluxe Room' },
    { id: 3, roomType: 'Suite' },
    { id: 4, roomType: 'Executive Suite' }
  ];

  // Mocking setFilteredData function
  const mockSetFilteredData = jest.fn();

  // Utility function to render component
  const renderComponent = (rooms = mockRooms) => {
    return render(
      <RoomFilter 
        data={rooms} 
        setFilteredData={mockSetFilteredData}
      />
    );
  };

  // Test 1: Component renders correctly
  test('renders room filter component', () => {
    renderComponent();

    // Check for filter label
    expect(screen.getByText('Filter rooms by type')).toBeInTheDocument();

    // Check for default select option
    expect(screen.getByText('Select a room type to filter.....')).toBeInTheDocument();

    // Check for Clear Filter button
    expect(screen.getByText('Clear Filter')).toBeInTheDocument();
  });

  // Test 2: Correct room types are populated in select
  test('populates room types correctly', () => {
    renderComponent();

    // Get the select element
    const select = screen.getByRole('combobox');

    // Check each option individually
    const expectedTypes = ['', 'Standard Room', 'Deluxe Room', 'Suite', 'Executive Suite'];
    
    expectedTypes.forEach(type => {
      const options = screen.getAllByRole('option');
      const matchingOption = options.find(option => 
        option.textContent?.trim() === String(type).trim()
      );
      expect(matchingOption).toBeInTheDocument();
    });
  });

  // Test 3: Filtering functionality
  test('filters rooms correctly when type is selected', () => {
    renderComponent();

    // Select 'Deluxe Room'
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Deluxe Room' } });

    // Check if setFilteredData was called with correct filtered rooms
    expect(mockSetFilteredData).toHaveBeenCalledWith([
      { id: 2, roomType: 'Deluxe Room' }
    ]);
  });

  // Test 4: Clear filter functionality
  test('clears filter when Clear Filter button is clicked', () => {
    renderComponent();

    // First, apply a filter
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Suite' } });

    // Then click Clear Filter
    const clearButton = screen.getByText('Clear Filter');
    fireEvent.click(clearButton);

    // Check if filter is reset and all rooms are returned
    expect(mockSetFilteredData).toHaveBeenCalledWith(mockRooms);
  });

  // Test 5: Case-insensitive filtering
  test('performs case-insensitive filtering', () => {
    renderComponent();

    // Select 'suite' (lowercase)
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'suite' } });

    // Check if both 'Suite' and 'Executive Suite' are filtered
    expect(mockSetFilteredData).toHaveBeenCalledWith([
      { id: 3, roomType: 'Suite' },
      { id: 4, roomType: 'Executive Suite' }
    ]);
  });

  // Test 6: Handles empty room list gracefully
  test('renders correctly with empty room list', () => {
    renderComponent([]);

    // Ensure component still renders without crashing
    expect(screen.getByText('Filter rooms by type')).toBeInTheDocument();
    
    // Verify select options with empty list
    const selectOptions = screen.getAllByRole('option');
    expect(selectOptions).toHaveLength(2); // Default + empty option
    expect(selectOptions[0]).toHaveTextContent('Select a room type to filter.....');
    expect(selectOptions[1]).toHaveTextContent('');
  });

  // Test 7: Verify initial state and attributes
  test('verifies initial component state and attributes', () => {
    renderComponent();

    const select = screen.getByRole('combobox');
    const clearButton = screen.getByText('Clear Filter');

    // Check initial select value is empty
    expect(select).toHaveValue('');

    // Check button and select attributes
    expect(select).toHaveClass('form-select');
    expect(clearButton).toHaveClass('btn btn-hotel');
  });
});