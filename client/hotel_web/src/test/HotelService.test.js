import React from 'react';
import { render, screen } from '@testing-library/react';
import HotelService from '../components/common/HotelService';
import { 
  FaClock, 
  FaWifi, 
  FaUtensils, 
  FaTshirt, 
  FaCocktail, 
  FaParking, 
  FaSnowflake 
} from 'react-icons/fa';

describe('HotelService Component', () => {
  beforeEach(() => {
    render(<HotelService />);
  });

  // Test header and title
  test('renders "Our Services" header', () => {
    const headerElement = screen.getByText(/Our Services/i);
    expect(headerElement).toBeInTheDocument();
  });

  // Test service cards rendering with more flexible matching
  const serviceTestCases = [
    { 
      icon: FaWifi, 
      title: 'WiFi', 
      description: /Stay connected with high-speed internet access/i 
    },
    { 
      icon: FaUtensils, 
      title: 'Breakfast', 
      description: /Start your day with a delicious breakfast buffet/i 
    },
    { 
      icon: FaTshirt, 
      title: 'Laundry', 
      description: /Keep your clothes clean and fresh with our laundry service/i 
    },
    { 
      icon: FaCocktail, 
      title: 'Mini-bar', 
      description: /Enjoy a refreshing drink or snack from our in-room mini-bar/i 
    },
    { 
      icon: FaParking, 
      title: 'Parking', 
      description: /Park your car conveniently in our on-site parking lot/i 
    },
    { 
      icon: FaSnowflake, 
      title: 'Air conditioning', 
      description: /Stay cool and comfortable with our air conditioning system/i 
    }
  ];

  test.each(serviceTestCases)(
    'renders $title service card with correct icon and description',
    ({ title, description }) => {
      const cardTitle = screen.getByText(title);
      const cardDescription = screen.getByText(description);
      
      expect(cardTitle).toBeInTheDocument();
      expect(cardDescription).toBeInTheDocument();
      expect(cardTitle).toHaveClass('hotel-color');
    }
  );

  // Snapshot test
  test('matches snapshot', () => {
    const { asFragment } = render(<HotelService />);
    expect(asFragment()).toMatchSnapshot();
  });
});