import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getRoomTypes } from '../components/utils/ApiFunctions';
import RoomTypeSelector from '../components/common/RoomTypeSelector';

jest.mock('../components/utils/ApiFunctions', () => ({
  getRoomTypes: jest.fn(),
}));

describe('RoomTypeSelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders room type selector with initial options', async () => {
    getRoomTypes.mockResolvedValue(['STANDARD', 'DELUXE']);

    render(
      <RoomTypeSelector handleRoomInputChange={jest.fn()} newRoom={false} />
    );

    await waitFor(() => {
      expect(screen.getByText('Select a room type')).toBeInTheDocument();
    });

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4); // Includes "Select a room type" and "Add New"
    expect(screen.getByText('STANDARD')).toBeInTheDocument();
    expect(screen.getByText('DELUXE')).toBeInTheDocument();
  });

  test('displays input field when "Add New" is selected', async () => {
    getRoomTypes.mockResolvedValue(['STANDARD']);

    render(
      <RoomTypeSelector handleRoomInputChange={jest.fn()} newRoom={false} />
    );

    const selector = screen.getByRole('combobox', { name: '' });
    fireEvent.change(selector, { target: { value: 'Add New' } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a new room type')).toBeInTheDocument();
    });
  });

  test('adds a new room type and resets input field', async () => {
    getRoomTypes.mockResolvedValue(['STANDARD']);

    render(
      <RoomTypeSelector handleRoomInputChange={jest.fn()} newRoom={false} />
    );

    const selector = screen.getByRole('combobox', { name: '' });
    fireEvent.change(selector, { target: { value: 'Add New' } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a new room type')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Enter a new room type');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'SUITE' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter a new room type')).not.toBeInTheDocument();
      expect(screen.getByText('SUITE')).toBeInTheDocument();
    });
  });

  test('handles empty new room type input gracefully', async () => {
    getRoomTypes.mockResolvedValue(['STANDARD']);

    render(
      <RoomTypeSelector handleRoomInputChange={jest.fn()} newRoom={false} />
    );

    const selector = screen.getByRole('combobox', { name: '' });
    fireEvent.change(selector, { target: { value: 'Add New' } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a new room type')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(screen.getByPlaceholderText('Enter a new room type')).toBeInTheDocument();
    expect(screen.queryByText('SUITE')).not.toBeInTheDocument();
  });
});
