import { render, waitFor } from "@testing-library/react";
import HomePage from "../src/pages/HomePage.jsx";
import { useUser } from "../src/context/UserContext.jsx";
import { api } from "../src/hooks/api.js";

vi.mock("../src/hooks/api.js", () => ({
    api: {
        get: vi.fn()
    }
}));

vi.mock("../src/context/UserContext.jsx", async () => {
    const actual = await vi.importActual("../src/context/UserContext.jsx");
    return {
        ...actual,
        useUser: vi.fn()
    };
});

describe("HomePage tests", () => {

    it("should call /auth/me when component mounts", async () => {
        api.get.mockResolvedValue({
            data: { user: { name: "John", role: "admin" } }
        });

        const mockSetUser = vi.fn();
        const mockSetIsAdmin = vi.fn();

        // mock all values used in UserAuth + HomePage
        useUser.mockReturnValue({
            user: null,
            isAdmin: false,
            authOpen: false,
            setAuthOpen: vi.fn(),
            setUser: mockSetUser,
            setIsAdmin: mockSetIsAdmin,
        });

        render(<HomePage />);

        expect(api.get).toHaveBeenCalledWith("/auth/me");
    });

    it("should update context with user data", async () => {
        api.get.mockResolvedValue({
            data: { user: { name: "John", role: "admin" } }
        });

        const mockSetUser = vi.fn();
        const mockSetIsAdmin = vi.fn();

        useUser.mockReturnValue({
            user: null,
            isAdmin: false,
            authOpen: false,
            setAuthOpen: vi.fn(),
            setUser: mockSetUser,
            setIsAdmin: mockSetIsAdmin,
        });

        render(<HomePage />);

        await waitFor(() => {
            expect(mockSetUser).toHaveBeenCalledWith({ name: "John", role: "admin" });
            expect(mockSetIsAdmin).toHaveBeenCalledWith(true);
        });
    });
});
