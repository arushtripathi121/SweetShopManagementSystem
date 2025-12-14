import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UpdateSweet from "../src/components/UpdateSweet";
import { useAdmin } from "../src/context/AdminContext";
import { api } from "../src/hooks/api";

// Mock Framer Motion
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <div>{children}</div>,
}));

// Mock Context
vi.mock("../src/context/AdminContext", () => ({
    useAdmin: vi.fn(),
}));

// Mock API
vi.mock("../src/hooks/api", () => ({
    api: {
        put: vi.fn(),
    },
}));

const mockSetUpdateOpen = vi.fn();
const mockRefresh = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
});

const mockSweet = {
    _id: "abc123",
    name: "Ladoo",
    category: "Indian",
    price: 120,
    quantity: 5,
    rating: 4.5,
    image: "http://image.com/ladoo.png",
    description: "Tasty sweet",
};

const renderComponent = () => render(<UpdateSweet refresh={mockRefresh} />);

describe("UpdateSweet Component", () => {

    it("returns null when updateOpen is false or data missing", () => {
        useAdmin.mockReturnValue({
            updateOpen: false,
            updateSweetData: null,
            setUpdateOpen: mockSetUpdateOpen,
        });

        const { container } = renderComponent();

        expect(container.firstChild).toBeNull();
    });

    it("renders update modal when open", () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            updateSweetData: mockSweet,
            setUpdateOpen: mockSetUpdateOpen,
        });

        renderComponent();

        expect(screen.getByText("Update Sweet")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Sweet Name")).toHaveValue("Ladoo");
        expect(screen.getByPlaceholderText("Price (₹)")).toHaveValue(120);
    });

    it("updates form fields on typing", () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            updateSweetData: mockSweet,
            setUpdateOpen: mockSetUpdateOpen,
        });

        renderComponent();

        const nameInput = screen.getByPlaceholderText("Sweet Name");

        fireEvent.change(nameInput, { target: { value: "Kaju Katli" } });

        expect(nameInput.value).toBe("Kaju Katli");
    });

    it("submits updated sweet data", async () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            updateSweetData: mockSweet,
            setUpdateOpen: mockSetUpdateOpen,
        });

        api.put.mockResolvedValue({});

        renderComponent();

        // update name & price only for test
        fireEvent.change(screen.getByPlaceholderText("Sweet Name"), {
            target: { value: "Barfi" },
        });

        fireEvent.change(screen.getByPlaceholderText("Price (₹)"), {
            target: { value: "200" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith("/sweet/abc123", {
                name: "Barfi",
                category: "Indian",
                price: "200",
                quantity: 5,
                rating: 4.5,
                image: "http://image.com/ladoo.png",
                description: "Tasty sweet",
            });
        });

        expect(mockRefresh).toHaveBeenCalled();
        expect(mockSetUpdateOpen).toHaveBeenCalledWith(false);
    });

    it("closes modal when X button is clicked", () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            updateSweetData: mockSweet,
            setUpdateOpen: mockSetUpdateOpen,
        });

        renderComponent();

        const closeBtn = screen.getAllByRole("button")[0]; // first button is Close (X)

        fireEvent.click(closeBtn);

        expect(mockSetUpdateOpen).toHaveBeenCalledWith(false);
    });
});
