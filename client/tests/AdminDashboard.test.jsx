import { render, screen, fireEvent, waitFor } from "./test-utils";
import AdminDashboard from "../src/components/AdminDashboard";
import { useAdmin } from "../src/context/AdminContext";
import { api } from "../src/hooks/api";
import { vi, describe, it, expect, beforeEach } from "vitest";

// ---- MOCKS MUST COME AFTER IMPORTS ----

// mock useAdmin context
vi.mock("../src/context/AdminContext", () => ({
    useAdmin: vi.fn(),
}));

// mock api
vi.mock("../src/hooks/api", () => ({
    api: {
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("AdminDashboard", () => {
    beforeEach(() => {
        useAdmin.mockReturnValue({
            setAdminDashboardOpen: vi.fn(),
            setAddOpen: vi.fn(),
            setUpdateOpen: vi.fn(),
            setUpdateSweetData: vi.fn(),
            setRestockOpen: vi.fn(),
            setRestockData: vi.fn(),
        });

        api.get.mockResolvedValue({
            data: {
                sweets: [
                    {
                        _id: "1",
                        name: "Ladoo",
                        category: "Indian",
                        price: 100,
                        quantity: 10,
                        image: "test.jpg",
                        description: "Sweet ladoo",
                    },
                ],
                totalPages: 1,
            },
        });
    });

    it("renders admin dashboard heading", async () => {
        render(<AdminDashboard />);

        expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();
    });

    it("renders sweet items", async () => {
        render(<AdminDashboard />);

        expect(await screen.findByText("Ladoo")).toBeInTheDocument();
    });
});
