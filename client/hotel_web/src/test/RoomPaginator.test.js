import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomPaginator from '../components/common/RoomPaginator';

describe('RoomPaginator Component', () => {
  // Test case 1: Renders correct number of page buttons
  test('renders correct number of page buttons', () => {
    const mockPageChange = jest.fn();
    const totalPages = 5;
    
    render(
      <RoomPaginator 
        currentPage={1} 
        totalPages={totalPages} 
        onPageChange={mockPageChange} 
      />
    );

    const pageButtons = screen.getAllByRole('button');
    expect(pageButtons).toHaveLength(totalPages);
  });

  // Test case 2: Highlights current page correctly
  test('highlights current page button', () => {
    const currentPage = 3;
    const totalPages = 5;
    const mockPageChange = jest.fn();

    render(
      <RoomPaginator 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={mockPageChange} 
      />
    );

    const activeButton = screen.getByRole('button', { name: `${currentPage}` });
    expect(activeButton.closest('li')).toHaveClass('active');
  });

  // Test case 3: Calls onPageChange with correct page number when button is clicked
  test('calls onPageChange with correct page number', () => {
    const mockPageChange = jest.fn();
    const totalPages = 5;
    const currentPage = 1;

    render(
      <RoomPaginator 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={mockPageChange} 
      />
    );

    const secondPageButton = screen.getByRole('button', { name: '2' });
    fireEvent.click(secondPageButton);

    expect(mockPageChange).toHaveBeenCalledWith(2);
  });

  // Test case 4: Renders correct page numbers
  test('renders correct page numbers', () => {
    const totalPages = 5;
    const currentPage = 1;
    const mockPageChange = jest.fn();

    render(
      <RoomPaginator 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={mockPageChange} 
      />
    );

    // Check if all page numbers from 1 to totalPages are present
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = screen.getByRole('button', { name: `${i}` });
      expect(pageButton).toBeInTheDocument();
    }
  });

  // Test case 5: Handles edge cases with minimum and maximum pages
  test('handles minimum and maximum page scenarios', () => {
    const { rerender } = render(
      <RoomPaginator 
        currentPage={1} 
        totalPages={3} 
        onPageChange={jest.fn()} 
      />
    );

    // Rerender with last page
    rerender(
      <RoomPaginator 
        currentPage={3} 
        totalPages={3} 
        onPageChange={jest.fn()} 
      />
    );

    // Ensure no errors are thrown and component renders correctly
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});