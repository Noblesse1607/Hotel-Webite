import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddRoom from '../components/room/AddRoom';
import { BrowserRouter as Router } from 'react-router-dom';
import { addRoom } from '../components/utils/ApiFunctions';
import { getRoomTypes } from '../components/utils/ApiFunctions';

// Mocking the addRoom API function
jest.mock('../components/utils/ApiFunctions', () => ({
    addRoom: jest.fn(),
    getRoomTypes: jest.fn().mockResolvedValue(['Single', 'Double', 'Suite'])  // mock giá trị trả về
  }));
  


describe('AddRoom Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handles input changes', () => {
    render(
      <Router>
        <AddRoom />
      </Router>
    );

    const roomPriceInput = screen.getByLabelText(/Room Price/i);
    fireEvent.change(roomPriceInput, { target: { value: '100' } });

    expect(roomPriceInput.value).toBe('100');
  });

});
