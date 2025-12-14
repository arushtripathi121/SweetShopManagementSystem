import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import BuySweets from "../src/components/BuySweets";
import { useBuySweet } from "../src/context/BuySweetContext";
import { useAuth } from "../src/context/AuthContext";
import { api } from "../src/hooks/api";
import AuthContext from '../src/context/AuthContext'

vi.mock("../src/context/BuySweetContext");
vi.mock("../src/context/AuthContext");
vi.mock("../src/hooks/api");

const mockSetBuyOpen = vi.fn();
const mockSetAuthOpen = vi.fn();

const renderComponent = async () => {
    await act(async () => {
        render(<BuySweets />);
    });
};

describe("BuySweets Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("returns null when buyOpen is false", async () => {
        useBuySweet.mockReturnValue({
            buyOpen: false,
            selectedSweetId: null,
            setBuyOpen: mockSetBuyOpen,
        });

        useAuth.mockReturnValue({
            user: null,
            setAuthOpen: mockSetAuthOpen,
        });

        await renderComponent();
        expect(screen.queryByText("Checkout")).toBeNull();
    });

    test("renders loading state", async () => {
        useBuySweet.mockReturnValue({
            buyOpen: true,
            selectedSweetId: "abc",
            setBuyOpen: mockSetBuyOpen,
        });

        useAuth.mockReturnValue({
            user: null,
            setAuthOpen: mockSetAuthOpen,
        });

        api.get.mockResolvedValueOnce({ data: { sweet: null } });

        await renderComponent();

        expect(
            screen.getByText("Loading Checkout...")
        ).toBeInTheDocument();
    });

    test("fetches and displays sweet", async () => {
        useBuySweet.mockReturnValue({
            buyOpen: true,
            selectedSweetId: "123",
            setBuyOpen: mockSetBuyOpen,
        });

        useAuth.mockReturnValue({
            user: null,
            setAuthOpen: mockSetAuthOpen,
        });

        api.get.mockResolvedValueOnce({
            data: {
                sweet: {
                    _id: "123",
                    name: "Ladoo",
                    category: "Indian",
                    price: 200,
                    quantity: 5,
                    rating: 4.5,
                    image: "test.jpg",
                },
            },
        });

        await renderComponent();

        expect(await screen.findByText("Ladoo")).toBeInTheDocument();
        expect(screen.getByText("Indian")).toBeInTheDocument();
    });

    test("admin cannot place order", async () => {
        useBuySweet.mockReturnValue({
            buyOpen: true,
            selectedSweetId: "123",
            setBuyOpen: mockSetBuyOpen,
        });

        useAuth.mockReturnValue({
            user: { role: "admin" },
            setAuthOpen: mockSetAuthOpen,
        });

        api.get.mockResolvedValueOnce({
            data: {
                sweet: {
                    name: "Jalebi",
                    price: 100,
                    quantity: 3,
                    category: "Sweet",
                    rating: 4.9,
                    image: "x.jpg",
                },
            },
        });

        await renderComponent();

        expect(
            await screen.findByText("Admin accounts cannot place orders.")
        ).toBeInTheDocument();
    });

    test("unauthenticated sees login button", async () => {
        useBuySweet.mockReturnValue({
            buyOpen: true,
            selectedSweetId: "123",
            setBuyOpen: mockSetBuyOpen,
        });

        useAuth.mockReturnValue({
            user: null,
            setAuthOpen: mockSetAuthOpen,
        });

        api.get.mockResolvedValueOnce({
            data: {
                sweet: {
                    name: "Ladoo",
                    price: 200,
                    quantity: 5,
                    category: "Sweet",
                    rating: 4.5,
                    image: null, // prevents empty-src warnings
                },
            },
        });

        await renderComponent();

        expect(await screen.findByText("Login First")).toBeInTheDocument();
    });

    test("handles successful purchase", async () => {
        useBuySweet.mockReturnValue({
            buyOpen: true,
            selectedSweetId: "123",
            setBuyOpen: mockSetBuyOpen,
        });

        useAuth.mockReturnValue({
            user: { role: "user" },
            setAuthOpen: mockSetAuthOpen,
        });

        api.get.mockResolvedValueOnce({
            data: {
                sweet: {
                    name: "Ladoo",
                    price: 100,
                    quantity: 3,
                    category: "Sweet",
                    rating: 4.5,
                    image: null,
                },
            },
        });

        api.post.mockResolvedValueOnce({
            data: {
                sweet: {
                    name: "Ladoo",
                    price: 100,
                    quantity: 2,
                },
            },
        });

        await renderComponent();

        fireEvent.click(await screen.findByText("Place Order"));

        const messages = await screen.findAllByText("Order Placed Successfully");
        expect(messages.length).toBeGreaterThan(0);
    });

    test("handles purchase failure", async () => {
        useBuySweet.mockReturnValue({
            buyOpen: true,
            selectedSweetId: "123",
            setBuyOpen: mockSetBuyOpen,
        });

        useAuth.mockReturnValue({
            user: { role: "user" },
            setAuthOpen: mockSetAuthOpen,
        });

        api.get.mockResolvedValueOnce({
            data: {
                sweet: {
                    name: "Ladoo",
                    price: 100,
                    quantity: 3,
                    category: "Sweet",
                    rating: 4.5,
                    image: null,
                },
            },
        });

        api.post.mockRejectedValueOnce({
            response: {
                data: { message: "Unable to place order" },
            },
        });

        await renderComponent();

        fireEvent.click(await screen.findByText("Place Order"));

        const errors = await screen.findAllByText("Unable to place order");
        expect(errors.length).toBeGreaterThan(0);
    });
});
