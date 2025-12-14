import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RestockSweet from "../src/components/RestockSweet";
import { useAdmin } from "../src/context/AdminContext";
import { api } from "../src/hooks/api";

// Mock Framer Motion
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    },
}));

// Mock Context
vi.mock("../src/context/AdminContext", () => ({
    useAdmin: vi.fn(),
}));

// Mock API
vi.mock("../src/hooks/api", () => ({
    api: {
        post: vi.fn(),
    },
}));

const mockSetRestockOpen = vi.fn();
const mockRefresh = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
});

const renderComponent = () =>
    render(<RestockSweet refresh={mockRefresh} />);

describe("RestockSweet Component", () => {

    it("returns null when restockOpen is false", () => {
        useAdmin.mockReturnValue({
            restockOpen: false,
            setRestockOpen: mockSetRestockOpen,
            restockData: null,
        });

        const { container } = renderComponent();
        expect(container.firstChild).toBeNull();
    });

    it("renders modal when restockOpen is true", () => {
        useAdmin.mockReturnValue({
            restockOpen: true,
            setRestockOpen: mockSetRestockOpen,
            restockData: { _id: "123" },
        });

        renderComponent();

        expect(screen.getByText("Restock Sweet")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Quantity")).toBeInTheDocument();
    });

    it("updates quantity input", () => {
        useAdmin.mockReturnValue({
            restockOpen: true,
            setRestockOpen: mockSetRestockOpen,
            restockData: { _id: "123" },
        });

        renderComponent();

        const input = screen.getByPlaceholderText("Quantity");

        fireEvent.change(input, { target: { value: "10" } });

        expect(input.value).toBe("10");
    });

    it("calls API, refresh, and closes modal on submit", async () => {
        useAdmin.mockReturnValue({
            restockOpen: true,
            setRestockOpen: mockSetRestockOpen,
            restockData: { _id: "abc123" },
        });

        api.post.mockResolvedValue({});

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText("Quantity"), {
            target: { value: "5" },
        });

        fireEvent.click(screen.getByText("Add Stock"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/inventory/abc123/restock",
                { quantity: "5" }
            );
        });

        expect(mockRefresh).toHaveBeenCalled();
        expect(mockSetRestockOpen).toHaveBeenCalledWith(false);
    });

    it("closes modal when clicking X icon", () => {
        useAdmin.mockReturnValue({
            restockOpen: true,
            setRestockOpen: mockSetRestockOpen,
            restockData: { _id: "123" },
        });

        renderComponent();

        const closeIcon = screen.getByTestId("close-restock");

        fireEvent.click(closeIcon);

        expect(mockSetRestockOpen).toHaveBeenCalledWith(false);
    });
});
