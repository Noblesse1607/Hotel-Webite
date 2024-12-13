import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthProvider";
import Logout from "../components/auth/Logout";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Logout Component", () => {
  const mockHandleLogout = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders the Logout component with profile link and logout button", () => {
    render(
      <AuthContext.Provider value={{ handleLogout: mockHandleLogout }}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls handleLogout and navigate when logout button is clicked", () => {
    render(
      <AuthContext.Provider value={{ handleLogout: mockHandleLogout }}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/", { state: { message: " You have been logged out!" } });
  });
});
