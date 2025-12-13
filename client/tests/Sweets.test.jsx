import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import Sweets from "../src/components/Sweets";
import { api } from "../src/hooks/api";
import { useUser } from "../src/context/UserContext";

vi.mock("../src/hooks/api");
vi.mock("../src/context/UserContext");

describe("Sweets Component", () => {
    const mockSetBuyOpen = vi.fn();
    const mockSetSelectedSweetId = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        useUser.mockReturnValue({
            setBuyOpen: mockSetBuyOpen,
            setSelectedSweetId: mockSetSelectedSweetId
        });

        api.get.mockResolvedValue({
            data: {
                sweets: [
                    { _id: "1", name: "Sweet1", image: "1.jpg", category: "Cat1", price: 100, rating: 4.5, description: "Desc1" },
                    { _id: "2", name: "Sweet2", image: "2.jpg", category: "Cat2", price: 200, rating: 4.2, description: "Desc2" }
                ]
            }
        });
    });

    it("renders sweets", async () => {
        render(<Sweets />);

        expect(await screen.findByText("Sweet1")).toBeInTheDocument();
        expect(screen.getByText("Sweet2")).toBeInTheDocument();
    });
});
