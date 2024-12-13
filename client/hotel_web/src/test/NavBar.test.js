import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../components/layout/NavBar"; // Adjust the path if necessary
import Logout from "../components/auth/Logout";

jest.mock("../components/auth/Logout", () => () => <div data-testid="logout-component">Logout Component</div>);

describe("NavBar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test("renders NavBar with default links", () => {
    renderWithRouter(<NavBar />);

    // Check for main links
    expect(screen.getByText(/Aurora/i)).toBeInTheDocument();
    expect(screen.getByText(/Đặt phòng/i)).toBeInTheDocument();
    expect(screen.getByText(/Tìm kiếm/i)).toBeInTheDocument();

    // Check for account dropdown
    expect(screen.getByText(/Tài khoản/i)).toBeInTheDocument();
  });

  test("renders Admin link when user is logged in as Admin", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("userRole", "ROLE_ADMIN");

    renderWithRouter(<NavBar />);

    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });

  test("does not render Admin link when user is not an Admin", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("userRole", "ROLE_USER");

    renderWithRouter(<NavBar />);

    expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
  });

  test("shows Logout component when user is logged in", () => {
    localStorage.setItem("token", "test-token");

    renderWithRouter(<NavBar />);

    fireEvent.click(screen.getByText(/Tài khoản/i)); // Simulate click to open dropdown
    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
  });

  test("shows Login link when user is not logged in", () => {
    renderWithRouter(<NavBar />);

    fireEvent.click(screen.getByText(/Tài khoản/i)); // Simulate click to open dropdown
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("toggles account dropdown on click", () => {
    renderWithRouter(<NavBar />);

    const accountDropdown = screen.getByText(/Tài khoản/i);

    // Initially not expanded
    expect(accountDropdown).not.toHaveClass("show");

    // Click to expand
    fireEvent.click(accountDropdown);
    expect(accountDropdown).toHaveClass("show");

    // Click again to collapse
    fireEvent.click(accountDropdown);
    expect(accountDropdown).not.toHaveClass("show");
  });
});
