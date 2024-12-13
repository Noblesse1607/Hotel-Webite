import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '../components/common/Header'

describe('Header Component', () => {
  test('renders header with correct title', () => {
    const testTitle = 'Welcome to Our Website'
    
    render(<Header title={testTitle} />)

    // Check if the title is rendered correctly
    const headerTitle = screen.getByText(testTitle)
    expect(headerTitle).toBeInTheDocument()
    expect(headerTitle).toHaveClass('header-title')
    expect(headerTitle).toHaveClass('text-center')
  })

  test('renders header structure', () => {
    const testTitle = 'Test Header'
    
    const { container } = render(<Header title={testTitle} />)

    // Check for header element
    const headerElement = container.querySelector('.header')
    expect(headerElement).toBeInTheDocument()

    // Check for overlay div
    const overlayElement = container.querySelector('.overlay')
    expect(overlayElement).toBeInTheDocument()

    // Check for container div
    const containerElement = container.querySelector('.container')
    expect(containerElement).toBeInTheDocument()
  })

  test('renders with different titles', () => {
    const testTitles = [
      'Home Page',
      'About Us',
      'Contact',
      ''  // Test with empty string
    ]

    testTitles.forEach(title => {
        // Clear the previous render before each test
        screen.queryAllByRole('heading').forEach(element => element.remove())
        
        // Render with current title
        render(<Header title={title} />)
        
        // Check if the title is rendered correctly
        if (title) {
          const headerTitle = screen.getByText(title)
          expect(headerTitle).toBeInTheDocument()
        }
      })
    })

  test('component matches snapshot', () => {
    const { asFragment } = render(<Header title="Snapshot Test" />)
    
    // Compare with previously saved snapshot
    expect(asFragment()).toMatchSnapshot()
  })
})