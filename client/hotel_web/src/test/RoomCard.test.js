import React from "react";
import { render, screen } from "@testing-library/react";
import RoomCard from "../components/room/RoomCard"; // Adjust path as needed
import { BrowserRouter as Router } from "react-router-dom"; // For testing the Link component

describe("RoomCard Component", () => {
  const mockRoom = {
    id: "1",
    roomType: "Deluxe Room",
    roomPrice: "100 USD",
    photo: "base64EncodedImageString", // Mocked base64 image string
  };

  test("renders room card with room details", () => {
    render(
      <Router>
        <RoomCard room={mockRoom} />
      </Router>
    );

    // Check if room type is rendered
    expect(screen.getByText(mockRoom.roomType)).toBeInTheDocument();

    // Use regular expression to find the room price
    const roomPrice = screen.getByText(/100\sUSD/i);
    expect(roomPrice).toBeInTheDocument();

    // Check if the image source is correct
    const img = screen.getByAltText("Room Photo");
    expect(img).toHaveAttribute(
      "src",
      `data:image/png;base64, ${mockRoom.photo}`
    );

    // Check if the "Book Now" button is rendered
    const bookNowButton = screen.getByText("Book Now");
    expect(bookNowButton).toBeInTheDocument();
  });

  test("navigates to the correct booking page when 'Book Now' button is clicked", () => {
    render(
      <Router>
        <RoomCard room={mockRoom} />
      </Router>
    );

    // Simulate the click event on the 'Book Now' button
    const bookNowButton = screen.getByText("Book Now");
    expect(bookNowButton.closest("a")).toHaveAttribute(
      "href",
      `/book-room/${mockRoom.id}`
    );
  });

  test("renders the card structure correctly", () => {
    render(
      <Router>
        <RoomCard room={mockRoom} />
      </Router>
    );

    // Check for room type and price using a regex to match price text
    const roomType = screen.getByText(mockRoom.roomType);
    const roomPrice = screen.getByText(/100\sUSD/i);
    expect(roomType).toBeInTheDocument();
    expect(roomPrice).toBeInTheDocument();

    // Check for the image
    const img = screen.getByAltText("Room Photo");
    expect(img).toBeInTheDocument();

    // Check for the "Book Now" button
    const bookNowButton = screen.getByText("Book Now");
    expect(bookNowButton).toBeInTheDocument();
  });
});
