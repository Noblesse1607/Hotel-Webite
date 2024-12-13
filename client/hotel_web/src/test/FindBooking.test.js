import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FindBooking from "../components/booking/FindBooking";
import { getBookingByConfirmationCode, cancelBooking } from "../components/utils/ApiFunctions";

jest.mock("../components/utils/ApiFunctions", () => ({
  getBookingByConfirmationCode: jest.fn(),
  cancelBooking: jest.fn(),
}));

describe("FindBooking Component", () => {
  const mockBookingInfo = {
    id: "1",
    bookingConfirmationCode: "ABC123",
    room: { id: "101", roomType: "Deluxe" },
    roomNumber: "101",
    checkInDate: "2024-12-01",
    checkOutDate: "2024-12-05",
    guestName: "John Doe",
    guestEmail: "johndoe@example.com",
    numOfAdults: "2",
    numOfChildren: "1",
    totalNumOfGuests: "3",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial state correctly", () => {
    render(<FindBooking />);

    expect(screen.getByPlaceholderText("Enter the booking confirmation code")).toBeInTheDocument();
    expect(screen.getByText("Find booking")).toBeInTheDocument();
  });

  test("shows loading message while fetching booking", async () => {
    getBookingByConfirmationCode.mockResolvedValueOnce(mockBookingInfo);

    render(<FindBooking />);

    fireEvent.change(screen.getByPlaceholderText("Enter the booking confirmation code"), {
      target: { value: "ABC123" },
    });

    fireEvent.click(screen.getByText("Find booking"));

    expect(screen.getByText("Finding your booking...")).toBeInTheDocument();

    await waitFor(() => expect(getBookingByConfirmationCode).toHaveBeenCalledWith("ABC123"));
  });
});
