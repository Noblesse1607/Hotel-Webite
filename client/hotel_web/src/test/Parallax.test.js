import React from 'react';
import { render, screen } from '@testing-library/react';
import Parallax from '../components/common/Parallax'; // Adjust the import path as needed

describe('Parallax Component', () => {
  // Test 1: Component renders without crashing
  test('renders Parallax component', () => {
    render(<Parallax />);
    expect(screen.getByText(/Trải nghiệm tốt nhất cùng/i)).toBeInTheDocument();
  });

  // Test 2: Checks for correct text content
  test('displays correct text content', () => {
    render(<Parallax />);
    
    // Check for hotel name
    const hotelName = screen.getByText(/Aurora/i);
    expect(hotelName).toBeInTheDocument();
    expect(hotelName).toHaveClass('hotel-color');

    // Check for main heading
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent(/Trải nghiệm tốt nhất cùng Aurora/);

    // Check for subheading
    const subHeading = screen.getByRole('heading', { level: 3 });
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent(/Nơi cung cấp dịch vụ tốt nhất cho mọi nhu cầu của bạn/);
  });

  // Test 3: Checks for correct className attributes
  test('has correct CSS classes', () => {
    render(<Parallax />);
    
    // Modify the Parallax component to add data-testid
    // const parallaxDiv = screen.getByTestId('parallax-container');
    const parallaxDiv = screen.getByText(/Trải nghiệm tốt nhất cùng/i).closest('.parallax');
    expect(parallaxDiv).toHaveClass('parallax');
    expect(parallaxDiv).toHaveClass('mb-5');

    // Check for container
    const container = screen.getByText(/Trải nghiệm tốt nhất cùng/i).closest('.container');
    expect(container).toHaveClass('text-center');
    expect(container).toHaveClass('px-5');
    expect(container).toHaveClass('py-5');
    expect(container).toHaveClass('justify-content-center');

    // Check for animated texts
    const animatedTexts = screen.getByText(/Trải nghiệm tốt nhất cùng/i).closest('.animated-texts');
    expect(animatedTexts).toHaveClass('bounceIn');
  });
});