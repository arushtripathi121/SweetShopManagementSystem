import { render, screen, fireEvent, waitFor } from "./test-utils";
import BuySweets from "../src/components/BuySweets";
import { useBuySweet } from "../src/context/BuySweetContext";
import { useAuth } from "../src/context/AuthContext";
import { api } from "../src/hooks/api";
import { vi, describe, it, expect, beforeEach } from "vitest";

// ---- MOCKS MUST COME AFTER IMPORTS ----

// mock BuySweet context
vi.mock("../src/context/BuySweetContext", () => ({
    useBuySweet: vi.fn(),
}));

// mock Auth context
vi.mock("../src/context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

// mock api
vi.mock("../src/hooks/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe("BuySweets Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock values for contexts
        useBuySweet.mockReturnValue({
            buyOpen: true,
            setBuyOpen: vi.fn(),
            selectedSweetId: "123",
        });

        useAuth.mockReturnValue({
            user: { role: "user" },
            setAuthOpen: vi.fn(),
        });
    });

    // ------------------------------
    // TEST 1: Loader
    // ------------------------------
    it("shows loader while fetching sweet", async () => {
        api.get.mockReturnValue(new Promise(() => { })); // never resolves -> loader

        render(<BuySweets />);

        expect(screen.getByText("Loading Checkout...")).toBeInTheDocument();
    });

    // ------------------------------
    // TEST 2: OUT OF STOCK UI
    // ------------------------------
    it("shows OUT OF STOCK when quantity is 0", async () => {
        api.get.mockResolvedValue({
            data: {
                sweet: {
                    name: "Ladoo",
                    price: 200,
                    quantity: 0,
                    image: "",
                    rating: 4.5,
                    category: "Indian",
                },
            },
        });

        render(<BuySweets />);

        expect(await screen.findByText("OUT OF STOCK")).toBeInTheDocument();
    });

    // ------------------------------
    // TEST 4: Custom weight validation
    // ------------------------------
    it("shows validation error for invalid custom weight", async () => {
        api.get.mockResolvedValue({
            data: {
                sweet: {
                    name: "Barfi",
                    price: 300,
                    quantity: 2,
                    image: "",
                    rating: 4.2,
                    category: "Indian",
                },
            },
        });

        render(<BuySweets />);

        const input = await screen.findByPlaceholderText("Custom (kg)");

        fireEvent.change(input, { target: { value: "-5" } });

        expect(screen.getByText("Enter valid weight")).toBeInTheDocument();
    });

    // ------------------------------
    // TEST 5: Total amount
    // ------------------------------
    it("calculates total amount correctly", async () => {
        api.get.mockResolvedValue({
            data: {
                sweet: {
                    name: "Barfi",
                    price: 200,
                    quantity: 5,
                    image: "",
                    rating: 4.2,
                    category: "Indian",
                },
            },
        });

        render(<BuySweets />);

        expect(await screen.findByText("₹50.00")).toBeInTheDocument();
    });

    // ------------------------------
    // TEST 6: Login required
    // ------------------------------
    it("shows Login First when user not logged in", async () => {
        useAuth.mockReturnValue({
            user: null,
            setAuthOpen: vi.fn(),
        });

        api.get.mockResolvedValue({
            data: {
                sweet: {
                    name: "Barfi",
                    price: 200,
                    quantity: 5,
                    image: "",
                    rating: 4.2,
                    category: "Indian",
                },
            },
        });

        render(<BuySweets />);

        expect(await screen.findByText("Login First")).toBeInTheDocument();
    });

    // ------------------------------
    // TEST 7: Admin cannot order
    // ------------------------------
    it("blocks admin from ordering", async () => {
        useAuth.mockReturnValue({
            user: { role: "admin" },
            setAuthOpen: vi.fn(),
        });

        api.get.mockResolvedValue({
            data: {
                sweet: {
                    name: "Barfi",
                    price: 200,
                    quantity: 5,
                    image: "",
                    rating: 4.2,
                    category: "Indian",
                },
            },
        });

        render(<BuySweets />);

        expect(await screen.findByText("Admin cannot order.")).toBeInTheDocument();
    });

    // ------------------------------
    // TEST 8: Successful Purchase
    // ------------------------------
    it("handles purchase & shows token", async () => {
        api.get.mockResolvedValue({
            data: {
                sweet: {
                    name: "Gulab",
                    price: 100,
                    quantity: 5,
                    image: "",
                    rating: 4.1,
                    category: "Indian",
                },
            },
        });

        api.post.mockResolvedValue({
            data: {
                orderToken: "ORD123",
                pdfBase64: "ABC123",
                sweet: {
                    name: "Gulab",
                    price: 100,
                    quantity: 4,
                    image: "",
                    rating: 4.1,
                    category: "Indian",
                },
            },
        });

        render(<BuySweets />);

        fireEvent.click(await screen.findByText("Place Order"));

        expect(await screen.findByText("Order Successful! Token: ORD123")).toBeInTheDocument();
    });
});
