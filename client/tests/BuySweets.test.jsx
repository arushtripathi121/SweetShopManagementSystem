import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import BuySweets from "../src/components/BuySweets";
import { useUser } from "../src/context/UserContext";
import { api } from "../src/hooks/api";

vi.mock("../src/context/UserContext");
vi.mock("../src/hooks/api");

describe("BuySweets Component", () => {
    const mockSetBuyOpen = vi.fn();
    const mockSetAuthOpen = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        useUser.mockReturnValue({
            buyOpen: true,
            setBuyOpen: mockSetBuyOpen,
            selectedSweetId: "123",
            user: { name: "Tester" },
            setAuthOpen: mockSetAuthOpen
        });

        api.get.mockResolvedValue({
            data: {
                sweet: {
                    _id: "123",
                    name: "Gulab Jamun",
                    category: "Indian",
                    price: 250,
                    quantity: 5,
                    rating: 4.8,
                    image: "img.jpg"
                }
            }
        });
    });

    it("renders checkout modal", async () => {
        render(<BuySweets />);
        expect(await screen.findByText("Checkout")).toBeInTheDocument();
    });
});
