import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../components/auth/Profile";
import { deleteUser, getBookingsByUserId, getUser } from "../components/utils/ApiFunctions";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

jest.mock("../components/utils/ApiFunctions", () => ({
  getUser: jest.fn(),
  getBookingsByUserId: jest.fn(),
  deleteUser: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Profile Component", () => {
  const mockUser = {
    id: "123",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    roles: [{ id: "1", name: "Admin" }],
  };

  const mockBookings = [
    {
      bookingId: "B001",
      room: { id: "R001", roomType: "Deluxe" },
      checkInDate: "20230101",
      checkOutDate: "20230105",
      bookingConfirmationCode: "CONF123",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("userId", "123");
    localStorage.setItem("token", "fake-token");
  });


  it("handles account deletion", async () => {
    deleteUser.mockResolvedValue({ data: "Account deleted successfully" });
    window.confirm = jest.fn(() => true); // Mock `window.confirm`

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Close account"));
    });

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith("123"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("displays error message if fetching bookings fails", async () => {
    // Giả lập hành vi fetch thất bại
    getBookingsByUserId.mockRejectedValue(new Error("Error fetching bookings: Network issue"));
  
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
  
    // Chờ và kiểm tra thông báo lỗi
    await waitFor(() => {
      expect(screen.getByText(/Error fetching bookings:/i)).toBeInTheDocument();
    });
  });
});
