import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserAuth from "../src/components/UserAuth";
import { useAuth } from "../src/context/AuthContext";
import { api } from "../src/hooks/api";

vi.mock("../src/context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

vi.mock("../src/hooks/api", () => ({
    api: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

const mockSetAuthOpen = vi.fn();
const mockSetUser = vi.fn();
const mockSetIsAdmin = vi.fn();

const renderComponent = () => render(<UserAuth />);

beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
        authOpen: true,
        setAuthOpen: mockSetAuthOpen,
        user: null,
        setUser: mockSetUser,
        isAdmin: false,
        setIsAdmin: mockSetIsAdmin,
    });
});

describe("UserAuth Component", () => {

    it("renders login tab by default", () => {
        renderComponent();

        expect(screen.getByText("Welcome Back")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    it("switches to signup tab", () => {
        renderComponent();

        fireEvent.click(screen.getByText("Sign Up"));

        expect(screen.getByText("Create an Account")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    });

    it("renders logged-in dashboard view", () => {
        useAuth.mockReturnValue({
            authOpen: true,
            setAuthOpen: mockSetAuthOpen,
            user: { name: "Arush", email: "a@mail.com", role: "admin" },
            setUser: mockSetUser,
            isAdmin: true,
            setIsAdmin: mockSetIsAdmin,
        });

        renderComponent();

        expect(screen.getByText("A")).toBeInTheDocument();  // avatar initial
        expect(screen.getByText("Arush")).toBeInTheDocument();
        expect(screen.getByText("ADMIN")).toBeInTheDocument();
    });

    it("performs logout request", async () => {
        useAuth.mockReturnValue({
            authOpen: true,
            setAuthOpen: mockSetAuthOpen,
            user: { name: "Arush", email: "a@mail.com", role: "user" },
            setUser: mockSetUser,
            isAdmin: false,
            setIsAdmin: mockSetIsAdmin,
        });

        api.get.mockResolvedValue({});

        renderComponent();

        fireEvent.click(screen.getByText("Logout"));

        await waitFor(() =>
            expect(api.get).toHaveBeenCalledWith("/auth/logout")
        );

        expect(mockSetUser).toHaveBeenCalledWith(null);
        expect(mockSetIsAdmin).toHaveBeenCalledWith(false);
    });

    it("closes modal when clicking the close button", () => {
        renderComponent();

        const closeBtn = screen.getAllByRole("button")[0]; // first button = close (X)
        fireEvent.click(closeBtn);

        expect(mockSetAuthOpen).toHaveBeenCalledWith(false);
    });
});
