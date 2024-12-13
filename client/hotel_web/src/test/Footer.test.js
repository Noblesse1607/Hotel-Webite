import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/layout/Footer'; // Adjust the import path as needed

// Mock react-bootstrap components to avoid additional rendering complexities
jest.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div data-testid="mock-container">{children}</div>,
  Row: ({ children }) => <div data-testid="mock-row">{children}</div>,
  Col: ({ children, ...props }) => <div data-testid="mock-col" {...props}>{children}</div>
}));

describe('Footer Component', () => {
  test('renders footer element', () => {
    const { container } = render(<Footer />);
    
    // Check if footer element exists
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass('bg-dark');
    expect(footerElement).toHaveClass('text-light');
    expect(footerElement).toHaveClass('py-3');
    expect(footerElement).toHaveClass('footer');
    expect(footerElement).toHaveClass('mt-lg-5');
  });

  test('displays correct copyright text with current year', () => {
    render(<Footer />);
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Check copyright text
    const copyrightElement = screen.getByText(`© ${currentYear} Aurora`);
    expect(copyrightElement).toBeInTheDocument();
  });

  test('renders container, row, and column components', () => {
    render(<Footer />);
    
    // Check if mocked components are rendered
    const containerElement = screen.getByTestId('mock-container');
    const rowElement = screen.getByTestId('mock-row');
    const colElement = screen.getByTestId('mock-col');
    
    expect(containerElement).toBeInTheDocument();
    expect(rowElement).toBeInTheDocument();
    expect(colElement).toBeInTheDocument();
  });

  test('column has correct text alignment', () => {
    const { getByText } = render(<Footer />);
    
    // Find the paragraph and check its parent column
    const paragraphElement = getByText(/© \d{4} Aurora/);
    const parentElement = paragraphElement.closest('div');
    
    // Check if parent has text-center class
    expect(parentElement).toHaveClass('text-center');
  });

  test('paragraph has no bottom margin', () => {
    const { getByText } = render(<Footer />);
    
    // Find the paragraph and check its margin class
    const paragraphElement = getByText(/© \d{4} Aurora/);
    expect(paragraphElement).toHaveClass('mb-0');
  });
});