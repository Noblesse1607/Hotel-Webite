import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomSearchResults from "../components/common/RoomSearchResult";
import RoomCard from "../components/room/RoomCard";
import RoomPaginator from "../components/common/RoomPaginator";

jest.mock("../components/room/RoomCard", () => jest.fn(() => <div>RoomCard</div>));
jest.mock("../components/common/RoomPaginator", () => jest.fn(({ onPageChange }) => (
  <div>
    RoomPaginator
    <button onClick={() => onPageChange(1)}>Page 1</button>
    <button onClick={() => onPageChange(2)}>Page 2</button>
  </div>
)));

describe("RoomSearchResults Component", () => {
  const mockClearSearch = jest.fn();

  const mockResults = [
    { id: 1, name: "Room 1" },
    { id: 2, name: "Room 2" },
    { id: 3, name: "Room 3" },
    { id: 4, name: "Room 4" },
    { id: 5, name: "Room 5" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders results with pagination", () => {
    render(<RoomSearchResults results={mockResults} onClearSearch={mockClearSearch} />);

    expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
    expect(screen.getAllByText(/RoomCard/i)).toHaveLength(3); // 3 items per page
    expect(screen.getByText(/RoomPaginator/i)).toBeInTheDocument();
  });

  test("handles page change correctly", () => {
    render(<RoomSearchResults results={mockResults} onClearSearch={mockClearSearch} />);

    // Expect initial page to show the first 3 items
    expect(screen.getAllByText(/RoomCard/i)).toHaveLength(3);

    // Simulate clicking page 2
    fireEvent.click(screen.getByText(/Page 2/i));

    // Expect the second set of items
    expect(screen.getAllByText(/RoomCard/i)).toHaveLength(2); // Remaining items
  });

  test("calls onClearSearch when 'Clear Search' button is clicked", () => {
    render(<RoomSearchResults results={mockResults} onClearSearch={mockClearSearch} />);

    const clearButton = screen.getByText(/Clear Search/i);
    fireEvent.click(clearButton);

    expect(mockClearSearch).toHaveBeenCalledTimes(1);
  });

  test("does not display anything if no results are available", () => {
    render(<RoomSearchResults results={[]} onClearSearch={mockClearSearch} />);

    expect(screen.queryByText(/Search Results/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RoomCard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RoomPaginator/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Clear Search/i)).not.toBeInTheDocument();
  });
});
