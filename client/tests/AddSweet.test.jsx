import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddSweet from "../src/components/AddSweet";
import { useAdmin } from "../src/context/AdminContext";
import { api } from "../src/hooks/api";

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    },
}));

vi.mock("../src/context/AdminContext", () => ({
    useAdmin: vi.fn(),
}));

vi.mock("../src/hooks/api", () => ({
    api: {
        post: vi.fn(),
    },
}));

const mockSetAddOpen = vi.fn();
const mockRefresh = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
});

const renderComponent = () => render(<AddSweet refresh={mockRefresh} />);

describe("AddSweet Component", () => {
    it("returns null when addOpen is false", () => {
        useAdmin.mockReturnValue({ addOpen: false, setAddOpen: mockSetAddOpen });

        const { container } = renderComponent();
        expect(container.firstChild).toBeNull();
    });

    it("renders the add sweet modal when addOpen is true", () => {
        useAdmin.mockReturnValue({ addOpen: true, setAddOpen: mockSetAddOpen });

        renderComponent();

        expect(screen.getAllByText("Add Sweet")[0]).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });

    it("updates fields when typing", () => {
        useAdmin.mockReturnValue({ addOpen: true, setAddOpen: mockSetAddOpen });

        renderComponent();

        const nameInput = screen.getByPlaceholderText("Name");
        fireEvent.change(nameInput, { target: { value: "Rasgulla" } });

        expect(nameInput.value).toBe("Rasgulla");
    });

    it("calls API, refresh, and closes modal on submit", async () => {
        useAdmin.mockReturnValue({ addOpen: true, setAddOpen: mockSetAddOpen });

        api.post.mockResolvedValue({});

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText("Name"), {
            target: { value: "Gulab Jamun" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Add Sweet" }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });

        expect(mockRefresh).toHaveBeenCalled();
        expect(mockSetAddOpen).toHaveBeenCalledWith(false);
    });

    it("closes modal when X icon is clicked", () => {
        useAdmin.mockReturnValue({ addOpen: true, setAddOpen: mockSetAddOpen });

        renderComponent();

        const closeBtn = screen.getByTestId("close-btn");
        fireEvent.click(closeBtn);

        expect(mockSetAddOpen).toHaveBeenCalledWith(false);
    });
});
