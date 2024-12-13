import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Checkout from "../components/booking/Checkout";
import { getRoomById } from "../components/utils/ApiFunctions";

// Mock the BookingForm and RoomCarousel components
jest.mock("../components/booking/BookingForm", () => () => <div>Mock BookingForm</div>);
jest.mock("../components/common/RoomCarousel", () => () => <div>Mock RoomCarousel</div>);

// Mock the getRoomById API function
jest.mock("../components/utils/ApiFunctions", () => ({
  getRoomById: jest.fn(),
}));

describe("Checkout Component", () => {
  const mockRoomId = "1";
  const mockRoomInfo = {
    photo: "mockPhotoData",
    roomType: "Deluxe",
    roomPrice: "150",
  };

  const renderWithRouter = (ui, { route = "/" } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/checkout/:roomId" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    renderWithRouter(<Checkout />, { route: `/checkout/${mockRoomId}` });

    expect(screen.getByText("Loading room information...")).toBeInTheDocument();
  });

  test("renders BookingForm and RoomCarousel components", async () => {
    getRoomById.mockResolvedValueOnce(mockRoomInfo);

    renderWithRouter(<Checkout />, { route: `/checkout/${mockRoomId}` });

    await waitFor(() => {
      expect(screen.getByText("Mock BookingForm")).toBeInTheDocument();
      expect(screen.getByText("Mock RoomCarousel")).toBeInTheDocument();
    });
  });
});
