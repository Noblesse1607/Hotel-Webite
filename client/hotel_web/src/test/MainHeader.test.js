import React from 'react';
import { render, screen } from '@testing-library/react';
import MainHeader from '../components/layout/MainHeader'; // Adjust the import path as needed

describe('MainHeader Component', () => {
  test('renders welcome text', () => {
    render(<MainHeader />);
    
    // Check for the welcome text
    const welcomeElement = screen.getByText(/Welcome to/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  test('renders Aurora hotel name', () => {
    render(<MainHeader />);
    
    // Check for the specific hotel name
    const hotelNameElement = screen.getByText('Aurora');
    expect(hotelNameElement).toBeInTheDocument();
    expect(hotelNameElement).toHaveClass('hotel-color');
  });

  test('renders Vietnamese subtitle', () => {
    render(<MainHeader />);
    
    // Check for the Vietnamese subtitle
    const subtitleElement = screen.getByText('Trải nghiệm dịch vụ cùng Aurora');
    expect(subtitleElement).toBeInTheDocument();
  });

  test('has correct header structure', () => {
    const { container } = render(<MainHeader />);
    
    // Check for header element
    const headerElement = container.querySelector('header');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass('header-banner');

    // Check for overlay div
    const overlayElement = container.querySelector('.overlay');
    expect(overlayElement).toBeInTheDocument();

    // Check for animated texts div
    const animatedTextsElement = container.querySelector('.animated-texts');
    expect(animatedTextsElement).toBeInTheDocument();
  });
});