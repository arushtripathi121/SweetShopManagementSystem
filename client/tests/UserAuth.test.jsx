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
        expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
    });

    it("switches to signup tab", () => {
        renderComponent();

        fireEvent.click(screen.getByText("Sign Up"));
        expect(screen.getByText("Create Account")).toBeInTheDocument();
    });

    it("calls login API on valid login", async () => {
        api.post.mockResolvedValue({});
        api.get.mockResolvedValue({
            data: { user: { name: "Arush", email: "a@mail.com", role: "user" } },
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@mail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "abc1234" },
        });

        fireEvent.click(screen.getByTestId("login-btn"));

        await waitFor(() =>
            expect(api.post).toHaveBeenCalledWith("/auth/login", {
                email: "test@mail.com",
                password: "abc1234",
            })
        );

        expect(mockSetUser).toHaveBeenCalled();
        expect(mockSetAuthOpen).toHaveBeenCalledWith(false);
    });

    it("shows login error on API failure", async () => {
        api.post.mockRejectedValue(new Error("fail"));

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@mail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "abc1234" },
        });

        fireEvent.click(screen.getByTestId("login-btn"));

        expect(await screen.findByText("Incorrect email or password.")).toBeInTheDocument();
    });

    it("renders user dashboard view when logged in", () => {
        useAuth.mockReturnValue({
            authOpen: true,
            setAuthOpen: mockSetAuthOpen,
            user: { name: "Arush", email: "a@mail.com", role: "admin" },
            setUser: mockSetUser,
            isAdmin: true,
            setIsAdmin: mockSetIsAdmin,
        });

        renderComponent();

        expect(screen.getByTestId("user-initial")).toHaveTextContent("A");
        expect(screen.getByText("Arush")).toBeInTheDocument();
        expect(screen.getByText("ADMIN")).toBeInTheDocument();
    });

    it("calls logout API", async () => {
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

        fireEvent.click(screen.getByTestId("logout-btn"));

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/auth/logout"));

        expect(mockSetUser).toHaveBeenCalledWith(null);
        expect(mockSetIsAdmin).toHaveBeenCalledWith(false);
    });

    it("closes modal when clicking overlay", () => {
        renderComponent();

        fireEvent.click(screen.getByTestId("overlay"));

        expect(mockSetAuthOpen).toHaveBeenCalledWith(false);
    });
});
