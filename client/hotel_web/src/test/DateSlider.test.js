import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DateSlider from '../components/common/DateSlider'

// Mock CSS imports
jest.mock('react-date-range/dist/styles.css', () => ({}))
jest.mock('react-date-range/dist/theme/default.css', () => ({}))

// Mock react-date-range's DateRangePicker
jest.mock('react-date-range', () => ({
  DateRangePicker: ({ ranges, onChange }) => (
    <div data-testid="date-range-picker">
      <button 
        data-testid="mock-date-picker" 
        onClick={() => onChange({
          selection: {
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-01-07'),
            key: 'selection'
          }
        })}
      >
        Select Dates
      </button>
    </div>
  )
}))

describe('DateSlider Component', () => {
  // Mock callback functions
  const mockOnDateChange = jest.fn()
  const mockOnFilterChange = jest.fn()

  // Render component before each test
  const renderComponent = () => {
    return render(
      <DateSlider 
        onDateChange={mockOnDateChange} 
        onFilterChange={mockOnFilterChange} 
      />
    )
  }

  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders component with initial state', () => {
    renderComponent()

    // Check header text
    expect(screen.getByText('Filter bookings by date')).toBeInTheDocument()

    // Check clear filter button
    const clearFilterButton = screen.getByText('Clear Filter')
    expect(clearFilterButton).toBeInTheDocument()

    // Check date range picker is rendered
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument()
  })

  test('handles date selection', () => {
    renderComponent()

    // Simulate date selection
    const selectDatesButton = screen.getByTestId('mock-date-picker')
    fireEvent.click(selectDatesButton)

    // Verify callback functions were called with correct dates
    expect(mockOnDateChange).toHaveBeenCalledWith(
      new Date('2023-01-01'), 
      new Date('2023-01-07')
    )
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      new Date('2023-01-01'), 
      new Date('2023-01-07')
    )
  })

  test('handles clear filter', () => {
    renderComponent()

    // Simulate date selection first
    const selectDatesButton = screen.getByTestId('mock-date-picker')
    fireEvent.click(selectDatesButton)

    // Now clear the filter
    const clearFilterButton = screen.getByText('Clear Filter')
    fireEvent.click(clearFilterButton)

    // Verify callback functions were called with null
    expect(mockOnDateChange).toHaveBeenCalledWith(null, null)
    expect(mockOnFilterChange).toHaveBeenCalledWith(null, null)
  })

  test('initial state has no dates selected', () => {
    renderComponent()

    // No specific assertion for initial state, but this test ensures 
    // the component renders without throwing errors
    const clearFilterButton = screen.getByText('Clear Filter')
    expect(clearFilterButton).toBeInTheDocument()
  })
})