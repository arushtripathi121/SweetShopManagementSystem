import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import UpdateSweet from "../src/components/UpdateSweet";
import { useAdmin } from "../src/context/AdminContext";

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    },
}));

vi.mock("../src/context/AdminContext", () => ({
    useAdmin: vi.fn(),
}));

const mockSetUpdateOpen = vi.fn();

const mockSweet = {
    name: "Gulab Jamun",
    category: "Indian Sweet",
    price: 200,
    quantity: 5,
    rating: 4.5,
    image: "https://example.com/image.jpg",
    description: "Delicious sweet.",
};

beforeEach(() => {
    vi.clearAllMocks();
});

const renderComponent = () => render(<UpdateSweet />);

describe("UpdateSweet Component", () => {
    it("returns null when updateOpen is false", () => {
        useAdmin.mockReturnValue({
            updateOpen: false,
            setUpdateOpen: mockSetUpdateOpen,
            updateSweetData: mockSweet,
        });

        const { container } = renderComponent();
        expect(container.firstChild).toBeNull();
    });

    it("renders form when updateOpen is true", () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            setUpdateOpen: mockSetUpdateOpen,
            updateSweetData: mockSweet,
        });

        renderComponent();

        expect(screen.getByText("Update Sweet")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Gulab Jamun")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Indian Sweet")).toBeInTheDocument();
    });

    it("updates input fields when typing", () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            setUpdateOpen: mockSetUpdateOpen,
            updateSweetData: mockSweet,
        });

        renderComponent();

        const nameInput = screen.getByDisplayValue("Gulab Jamun");
        fireEvent.change(nameInput, { target: { value: "Kaju Katli" } });

        expect(nameInput.value).toBe("Kaju Katli");
    });

    it("closes modal when close button is clicked", () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            setUpdateOpen: mockSetUpdateOpen,
            updateSweetData: mockSweet,
        });

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: "" })); // IoClose has no label

        expect(mockSetUpdateOpen).toHaveBeenCalledWith(false);
    });

    it("closes modal after clicking Save Changes", () => {
        useAdmin.mockReturnValue({
            updateOpen: true,
            setUpdateOpen: mockSetUpdateOpen,
            updateSweetData: mockSweet,
        });

        renderComponent();

        const saveButton = screen.getByText("Save Changes");

        fireEvent.click(saveButton);

        expect(mockSetUpdateOpen).toHaveBeenCalledWith(false);
    });
});
