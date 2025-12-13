import express from "express";
import {
    purchaseSweet,
    restockSweet
} from "../controllers/inventoryController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const inventoryRouter = express.Router();

// Any authenticated user can purchase
inventoryRouter.post("/:id/purchase", isAuthenticated, purchaseSweet);

// Only admin can restock
inventoryRouter.post("/:id/restock", isAuthenticated, isAdmin, restockSweet);

export default inventoryRouter;
